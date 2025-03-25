import type { IMMessage } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import dayjs from "dayjs";
import { MsgTemplate } from "@/components/im/utils/enums";
import { getTicketDetailByTid } from "@/api/chat";
import { ConectedStatus } from "@/stores/message";
import {
  useMessageStore,
  ConfirmStatus,
  PaymentStatus,
} from "@/stores/message";
import { toLogin, checkIsLogin, getCurPage } from "@/utils/login";
import { getContractSignUrl } from "@/api/user";
import { includeNotification } from "@/components/im/conversation-list/index";

export enum ContractUrlType {
  H5 = "H5",
  MP = "MP",
}

// 打开url
export const openUrl = (url) => {
  if (url.includes("http://") || url.includes("https://")) {
    // #ifdef H5
    window.location.href = url;
    // #endif

    // #ifdef APP-PLUS
    plus.runtime.openURL(url);
    // #endif
  } else {
    uni.navigateTo({ url });
  }
};

// 打开合同签署链接
export const openContractUrl = async (
  type: ContractUrlType,
  sign_task_id: string
) => {
  if (sign_task_id) {
    const data = await getContractSignUrl(sign_task_id);
    if (data) {
      if (type === ContractUrlType.H5) {
        openUrl(data.long_url);
      } else {
        openUrl(data.sign_url);
      }
    }
  }
};

// 选择图片、视频、文件、媒体拦截器
export const interceptorMedia = () => {
  const messageStore = useMessageStore();

  const success = () => {
    const pagePath: string = getCurPage();
    // 针对IM组件页面拦截
    if (pagePath.includes("components/im")) {
      if (checkIsLogin() && messageStore.isConected === ConectedStatus.YES) {
        // do nothing
      } else {
        toLogin();
      }
    }
  };
  uni.addInterceptor("chooseImage", {
    invoke() {},
    success,
  });
  uni.addInterceptor("chooseVideo", {
    invoke() {},
    success,
  });
  uni.addInterceptor("chooseFile", {
    invoke() {},
    success,
  });
  uni.addInterceptor("chooseMedia", {
    invoke() {},
    success,
  });
};

// 是否为json字符串
export const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// 删除用户信息
export const removeUserInfoByNim = () => {
  console.log("清除用户IM信息");
  const messageStore = useMessageStore();
  messageStore.sessionMsgBtnKey = "";
  messageStore.selfConsultationTid = "";
  messageStore.setIsConected(ConectedStatus.NO);
  messageStore.removeLoginCredential();
  messageStore.resetServiceSessionRes();
  messageStore.removeOperationPermissions();
};

// 删除登录凭证
export const removeLoginCredential = () => {
  const messageStore = useMessageStore();
  messageStore.removeLoginCredential();
};

// 检查登录凭证是否有效
export const checkLoginCredentialValid = (opts = null): boolean => {
  const messageStore = useMessageStore();
  const vaildDay = 3; // 有效天数
  const loginCredential = opts || messageStore.loginCredential;
  if (loginCredential && loginCredential.accid && loginCredential.time) {
    const diff = dayjs().diff(dayjs(loginCredential.time), "day");
    if (diff <= vaildDay) {
      return true;
    }
    return false;
  }
  return false;
};

/**
 * 检查聊天卡片消息状态
 * @param messages
 */
export const checkChatMsgStatus = async (messages: IMMessage[]) => {
  const messageStore = useMessageStore();
  if (Array.isArray(messages) && messages.length > 0) {
    const status = {
      enter: [], // 录入商品
      payment: null, // 支付 PaymentStatus
      payment_penalty: false, // 支付违约金
      order_refund: null, // 商品退款 ConfirmStatus
      confirm_receipt: false, // 确认收货
      contract_seller: false, // 卖家签署合同
      contract_buyer: false, // 买家签署合同
      confirm_info_buyer: [], // 买家确认信息
    };

    const arr = messages.filter((item) => {
      return (
        item?.body?.includes("卖家不同意退款") ||
        item?.body?.includes("卖家已同意退款") ||
        item?.attach?.option?.template
      );
    });
    console.log("checkChatMsgStatus", arr);
    arr.forEach((item) => {
      if (item.attach && item.attach.option) {
        const { template } = item.attach.option;
        switch (template) {
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_WAIT_ENTERED: // 中介担保-商品待录入
          case MsgTemplate.PRODUCT_RECOVERY_WAIT_ENTERED: // 号商回收-商品待录入
            status.enter.push({
              status: false,
              idClient: item.idClient,
            });
            break;
          case MsgTemplate.PRODUCT_RECOVERY_CONTRACT_BUYER_SIGN_COMPLETED:
          case MsgTemplate.SECURED_TRANSACTION_CONTRACT_BUYER_SIGN_COMPLETED: // 买家已签署合同
            status.contract_buyer = true;
            break;
          case MsgTemplate.PRODUCT_RECOVERY_CONTRACT_SELLER_SIGN_COMPLETED:
          case MsgTemplate.SECURED_TRANSACTION_CONTRACT_SELLER_SIGN_COMPLETED: // 卖家已签署合同
            status.contract_seller = true;
            break;
          case MsgTemplate.PRODUCT_RECOVERY_PRODUCT_DETAIL:
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_ENTERED:
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_DETAIL: {
            // 商品已录入
            const len = status.enter.length;
            if (len > 0) {
              status.enter[len - 1].status = true;
            }
            break;
          }
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_CONFIRM: // 买家确认信息
            status.confirm_info_buyer.push({
              status: null,
              idClient: item.idClient,
            });
            break;
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_BUYER_AGREED: {
            // 买家已确认商品信息
            const len = status.confirm_info_buyer.length;
            if (len > 0) {
              status.confirm_info_buyer[len - 1].status = ConfirmStatus.AGREE;
            }
            break;
          }
          case MsgTemplate.SECURED_TRANSACTION_PRODUCT_BUYER_DISAGREED: {
            // 买家否决商品信息
            const len = status.confirm_info_buyer.length;
            if (len > 0) {
              status.confirm_info_buyer[len - 1].status = ConfirmStatus.REFUND;
            }
            break;
          }
          case MsgTemplate.SECURED_TRANSACTION_BUYER_PAYMENT_COMPLETED: // 买家已支付，进入验号和换绑流程
            status.payment = PaymentStatus.PAYED;
            break;
          case MsgTemplate.PRODUCT_RECOVERY_REQUEST_CONFIRM_RECEIPT: // 买家已支付，进入验号和换绑流程
            status.confirm_receipt = true;
            break;

          case MsgTemplate.SECURED_TRANSACTION_PAYMENT_ORDER: // 待买家下单
            //
            break;
        }
      } else if (item.body) {
        if (item?.body?.includes("卖家不同意退款,客服将介入协助处理")) {
          status.order_refund = ConfirmStatus.REFUND;
        } else if (item?.body?.includes("卖家已同意退款")) {
          status.order_refund = ConfirmStatus.AGREE;
        }
      }
    });

    messageStore.setChatMsgStatus(status);
  } else {
    messageStore.clearChatMsgStatus();
  }
};

export const getChatStatusByTid = async (tid: string) => {
  const messageStore = useMessageStore();
  if (!tid) {
    messageStore.clearChatMsgStatus();
    console.error("tid is empty");
    return;
  }

  try {
    const res = await getTicketDetailByTid({
      tid,
    });
    if (res && res.id) {
      const status = {
        enter: false, // 录入商品
        payment: null, // 支付 PaymentStatus
        payment_penalty: false, // 支付违约金
        order_refund: null, // 商品退款 ConfirmStatus
        contract_seller: false, // 卖家签署合同
        contract_buyer: false, // 买家签署合同
        confirm_receipt: false, // 确认收货
        confirm_info: null, // 确认信息 ConfirmStatus
      };

      if (res.product_id) {
        status.enter = true;
      }
      if (res.order_id) {
        status.payment = res.payment_status;
      }
      if (res.confirm_status === 1) {
        // 商品待卖家录入
        status.enter = false;
      } else if (res.confirm_status === 2) {
        // 待买家确认
        status.enter = true;
        status.confirm_info = null;
      } else if (res.confirm_status === 3) {
        // 买家确认通过
        status.enter = true;
        status.confirm_info = ConfirmStatus.AGREE;
      } else if (res.confirm_status === 4) {
        // 买家确认不通过
        status.enter = true;
        status.confirm_info = ConfirmStatus.REFUND;
      } else {
        //
      }
      messageStore.setChatMsgStatus(status);
    } else {
      messageStore.clearChatMsgStatus();
    }
  } catch (error) {
    messageStore.clearChatMsgStatus();
    console.error("getChatStatusByTid err", error);
  }
};

// 获取消息内容
export const getChatContent = (lastMsg) => {
  const { type, target, attach, body } = lastMsg;
  const { template, content } = attach?.option || {};

  if (type === "custom") {
    if (attach?.type === "card") {
      // 系统通知、交易通知
      if (includeNotification(target)) {
        return content?.title || "消息通知";
      } else if (template === MsgTemplate.PRODUCT_DETAIL) {
        return "[商品链接]";
      } else if (template === MsgTemplate.PAYMENT_PENALTY) {
        return "[违约金支付链接]";
      } else {
        return content?.title || content?.desc || body || "";
      }
    } else if (attach?.type === "text") {
      return content?.msg;
    }
  }

  return "";
};

export function NimUtil() {
  return {};
}
