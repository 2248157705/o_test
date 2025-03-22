import { customNavigateTo } from "../utils/customNavigate";
import { t } from "../utils/i18n";
import {
  getPostSaleServiceTidByOrderId,
  getSelfConsultationTid,
  personMerchantContact,
} from "@/api/chat";
import { GroupType } from "@/components/im/utils/enums";
import { useMessageStore } from "@/stores/message";
import { useReportStore } from "@/stores/report";
import { ProductMsg } from "@/types/chat";
import { ApplyOrderType, MerchantContactEnter } from "@/enums/common";
import { checkIsLogin, toLogin } from "@/utils/login";
import { loginIM } from "@/components/im/utils/connect";
// import { getChatStatusByTid } from "@/components/im/chat/message/card/js/nim";

const env = import.meta.env.VITE_APP_ENV;

export const notifications = [
  `${env}@system_notification`, //系统通知
  `${env}@trade_notification`, // 交易通知
  `${env}@activity_notification`, // 活动通知
];

export const notificationsNameMap = {
  [notifications[0]]: "系统通知",
  [notifications[1]]: "交易通知",
  [notifications[2]]: "活动通知",
};

// export const getNotificationName = (account: string) => {};

// 是否为通知类型的会话
export const includeNotification = (account: string) => {
  return notifications.includes(account);
};

export const getSessionName = (session: any) => {
  const { scene, lastMsg, to } = session;
  const { team } = getServerExt(session?.serverExt);
  if (scene === "p2p" && includeNotification(to)) {
    return lastMsg?.fromNick || notificationsNameMap[to];
  } else if (team?.type == GroupType.CONSULT) {
    return "官方客服";
  } else if (
    team?.type == GroupType.SECURED_TRANSACTION ||
    team?.type == GroupType.AUDITING ||
    team?.type == GroupType.AFTER_SALES ||
    team?.type == GroupType.POST_SALE_SERVICE
  ) {
    return team?.name ? team?.name : `中介担保`;
  } else if (team?.type == GroupType.TYPE_PRODUCT_RECOVERY) {
    return team?.name ? team?.name : `号商回收`;
  } else {
    return session.name ? session.name : "";
  }
};

export const getServerExt = (ext: any) => {
  if (typeof ext !== "string") {
    return ext || "";
  }
  const obj = ext ? JSON.parse(ext || "{}") : {};
  if (Array.isArray(obj)) {
    return {};
  }
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key] = {};
    } else {
      obj[key] = obj[key] || {};
    }
  }
  return obj;
};
const getTeamList = async (tid: string) => {
  const connectState = uni.$UIKitStore?.connectStore?.connectState;
  if (connectState == "connected") {
    // 调用后端接口创建质询客服再进来，返回了群id说明群聊已创建
    let teamList: any = uni.$UIKitStore?.teamStore?.teams?.get(tid);
    if (!teamList) {
      await uni.$u.sleep(1000);
      teamList = uni.$UIKitStore?.teamStore?.teams?.get(tid);
      uni.log.warn("未找到群=>", tid);
    }
    return teamList;
  } else if (connectState === "disconnected") {
    uni.$main.toast("IM已断开连接，请稍后重试");
  } else {
    uni.$main.toast("IM正在连接中...");
  }
};

export const fetchSelfConsultationTid = async () => {
  const messageStore = useMessageStore();
  let teamId = messageStore.selfConsultationTid;
  if (!teamId) {
    const data = await getSelfConsultationTid().catch((err) => {
      console.log("getSelfConsultationTid err", err);
    });
    if (data) {
      const { tid } = data;
      teamId = tid;
      messageStore.setSelfConsultationTid(tid);
      console.warn("tid", tid);
    }
  }
  return teamId;
};
//订单客服咨询
export const consultPostSaleService = (
  order_id,
  sub_type: ApplyOrderType,
  product?: any
) => {
  uni.$u.throttle(async () => {
    uni.$main.showLoading({
      title: "正在加载中...",
      mask: true,
    });
    const teamRes = await getPostSaleServiceTidByOrderId({
      order_id,
      sub_type,
    }).catch((err) => {
      uni.$main.hideLoading();
      uni.$main.toast(err?.msg || "进入失败");
    });
    if (teamRes && teamRes.tid) {
      selectSesstion(teamRes.tid, false, product);
    } else {
      uni.$main.toast("获取订单客服失败");
    }
  }, 1000);
};

// 咨询客服
export const consultCustomerService = (product?: any) => {
  console.log("consultCustomerService", product);
  uni.$u.throttle(async () => {
    uni.$main.showLoading({
      title: "正在加载中...",
      mask: true,
    });
    const teamId = await fetchSelfConsultationTid().catch(() => {
      uni.$main.hideLoading();
    });
    selectSesstion(teamId, false, null);
  }, 1000);
};
let isRequesting = false; // 标记变量，表示是否正在请求
// 接口调用后->选中会话->跳转页面.
export const selectSesstion = async (
  tid: string,
  isSwitchMsgTab?: boolean,
  product?: any
) => {
  const messageStore = useMessageStore();
  if (!checkIsLogin()) {
    toLogin();
    return;
  }

  if (!messageStore.isConected) {
    loginIM();
    uni.$main.toast(t("connectingText"));
    return;
  }

  if (!tid) {
    uni.$main.toast("进入失败，未找到交易群聊");
    return;
  }

  if (isRequesting) {
    return;
  }
  console.warn("teamId====", tid);
  isRequesting = true; // 标记为正在请求
  uni.$main.showLoading({
    title: "正在加载中...",
    mask: true,
  });
  try {
    const team = await getTeamList(tid);
    if (team) {
      messageStore.setProductCard(null);
      if (product?.product_id) {
        messageStore.setProductCard({
          type: "card",
          option: {
            template: "product_detail",
            content: {
              product_id: product.product_id,
              product_covert: product.product_covert,
              product_title: product.product_title,
              product_price: product.product_price,
            },
          },
        });
      }
      const sessionId = `team-${tid}`;
      await uni.$UIKitStore.uiStore.selectSession(sessionId);
      customNavigateTo({
        url: `/components/im/chat/index?sessionId=${sessionId}&backMsgTab=${isSwitchMsgTab}`,
      });
    } else {
      uni.$main.toast("未找到群组，请稍后重试");
    }
  } catch (error) {
    uni.log.info("selectSesstion异常=>", error);
    if (messageStore.isConected !== 1) {
      uni.$main.toast("IM已断开");
    } else {
      uni.$main.toast("客服会话异常");
    }
  } finally {
    isRequesting = false;
    uni.$main.hideLoading();
  }
};

let flag = false;
// 点击会话
export const navigateToChat = async (sessionId: string) => {
  if (flag) return;
  try {
    flag = true;
    const messageStore = useMessageStore();
    const reportStore = useReportStore();
    reportStore.setIMLaunchTime({
      enter_chat: new Date().getTime(),
    });
    messageStore.setProductCard(null);
    await uni.$UIKitStore.uiStore.selectSession(sessionId);
    // if (session) {
    //   await getChatStatusByTid(session.teamId);
    // }
    customNavigateTo({
      url: `/components/im/chat/index?sessionId=${sessionId}`,
    });
  } catch (e) {
    console.log("navigateToChat err", e);
    uni.showToast({
      title: t("selectSessionFailText"),
      icon: "error",
    });
  } finally {
    flag = false;
  }
  if (uni.$currentAudioContext) {
    uni.$currentAudioContext?.destroy();
    uni.$currentAudioContext = null;
  }
};
// 号商回收
export const navigateToMerchantContact = (data: { uid: number | string }) => {
  const { uid } = data;
  personMerchantContact({ merchant_uid: uid }).then((res) => {
    if (res.merchant_accid) {
      gotoChitChat(res.merchant_accid);
    }
  });
};

//联系号商
export const navigateToPMerchantContact = async (
  data: { uid: number | string },
  enterType: MerchantContactEnter,
  product: ProductMsg
) => {
  const { uid } = data;
  const from = uni.$UIKitStore.userStore.myUserInfo.account;
  let msg = "";
  if (enterType === MerchantContactEnter.PRODUCT_DETAILS) {
    msg = "您可以发送商品链接，以便卖家为您解答";
  }
  if (enterType === MerchantContactEnter.MERCHANT_ADVERT) {
    msg = "您好！这里是回收专区，高价回收游戏账号";
  }

  const attach = {
    type: "text",
    option: {
      scene: "team_prompt",
      position: "center",
      content: {
        msg,
      },
    },
  };
  const res = await personMerchantContact({ merchant_uid: uid }).catch(
    (err) => {
      console.log("获取号商失败", err);
    }
  );

  if (enterType) {
    const sendRes = await uni.$UIKitStore.msgStore
      .sendCustomMsgActive({
        scene: "p2p",
        from,
        to: res.merchant_accid,
        attach: JSON.stringify(attach),
      })
      .catch((err) => {
        console.log("消息发送失败，请稍后重试", err);
        uni.$main.toast("消息发送失败，请稍后重试");
      });

    if (sendRes) {
      // uni.$emit(events.ON_SCROLL_BOTTOM)
    }
  }

  if (res && res.merchant_accid) {
    const messageStore = useMessageStore();
    messageStore.setProductCard(null);
    if (product?.product_id) {
      messageStore.setProductCard({
        type: "card",
        option: {
          template: "product_detail",
          content: {
            product_id: product.product_id,
            product_covert: product.product_covert,
            product_title: product.product_title,
            product_price: product.product_price,
          },
        },
      });
    }
    const sessionId = `p2p-${res.merchant_accid}`;
    await uni.$UIKitStore.uiStore.selectSession(sessionId);
    customNavigateTo({
      url: `/components/im/chat/index?sessionId=${sessionId}`,
    });
  }
};

// 去聊天-单聊
export const gotoChitChat = async (accid: string) => {
  const sessionId = `p2p-${accid}`;
  await uni.$UIKitStore.uiStore.selectSession(sessionId);
  customNavigateTo({
    url: `/components/im/chat/index?sessionId=${sessionId}`,
  });
};

export const getSessionLastMsg = (msgs: any) => {
  const list = msgs
    .filter((item: { type: string }) => item.type !== "notification")
    .sort((a: { time: number }, b: { time: number }) => b.time - a.time);
  return list.length > 0 ? list[0] : {};
};
