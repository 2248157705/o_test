<template>
  <view class="card-messsage-wrapper">
    <view class="title">{{ content.title }}</view>
    <view class="content">
      <!-- <view v-if="link.content">{{ link.content }}</view> -->
      <view v-for="(item, index) in content_labels" :key="index">
        {{ item.label }}：{{ item.value }}
      </view>
      <view v-if="content.desc">{{ content.desc }}</view>
      <!-- {{ attach?.permissions?.clickable_by }}=== -->
    </view>
    <template v-if="content.card_image">
      <image
        @click="previewPic"
        mode="aspectFill"
        v-if="template === MsgTemplate.APP_MESSAGE"
        class="envelope"
        :src="content.card_image"
      />
      <image
        @click="previewPic"
        mode="aspectFill"
        v-else
        class="image"
        :src="content.card_image"
      />
    </template>
    <template v-if="link.confirmText">
      <view v-if="!link.btn" class="line">
        <u-line :hairline="true" color="#F4F5F6" />
        <my-button
          class="btn"
          style="margin-top: 22rpx"
          height="42"
          color="#AFAFAF"
          width="180"
          size="32"
          bold="500"
          :open-type="openType"
          :params="btn_params"
          :text="link.confirmText"
          type="link"
          @click="navigatorTo()"
        />
      </view>

      <view
        v-else-if="link.cancelText || link.confirmText"
        :class="link.btnRow ? 'btn-box-row' : 'btn-box'"
      >
        <my-button
          v-if="link.cancelText"
          class="btn info"
          height="74"
          width="180"
          size="32"
          :text="link.cancelText"
          :disabled="disabled() || link.disabled"
          type="info"
          @click="onCancel"
        />

        <my-button
          v-if="link.confirmText"
          class="btn primary"
          height="74"
          width="180"
          size="32"
          :open-type="openType"
          :params="btn_params"
          :text="link.confirmText"
          :disabled="disabled() || link.disabled"
          type="primary"
          @click="navigatorTo()"
        />
      </view>
    </template>

    <template v-if="link.desc">
      <view class="l-m-10"></view>
      <u-line :hairline="true" color="#F4F5F6" />
      <my-button
        class="btn"
        style="margin-top: 22rpx"
        height="42"
        color="#AFAFAF"
        width="180"
        size="32"
        bold="500"
        :open-type="openType"
        :params="btn_params"
        :text="link.desc"
        type="link"
        @click="navigatorTo()"
      />
    </template>
  </view>
  <!-- v-if="link.open_type === LinkOpenType.INQUIRY_REASON" -->
  <ReasonPopup
    ref="reasonPopupRef"
    :title="reasonPopup.title"
    mode="center"
    :confirmClose="false"
    showConfirmButton
    showCancelButton
    @confirm="onReasonPopupConfirm"
  >
    <view class="reason-popup-content">
      <!-- <u--textarea class="textarea" v-model="reasonPopup.reason" placeholder="请输入原因,便于客服处理～" count height="80"
                maxlength="200" :placeholderStyle="`font-size:40rpx;`" /> -->
      <textarea
        v-model="reasonPopup.reason"
        class="value-textarea"
        placeholder="请输入原因，便于客服处理～"
        maxlength="200"
        :placeholder-style="placeholderStyle"
      />
      <view class="textarea-word">
        <text class="text">
          {{ `${reasonLength}/200` }}
        </text>
      </view>
    </view>
  </ReasonPopup>
</template>
<script lang="ts" setup>
import ReasonPopup from "@/components/my-popup/index.vue";
import { MsgTemplate, ProductConfirmStatus } from "@/components/im/utils/enums";
import { ProductTypeEnum } from "@/enums/product";
import { OpenType } from "@/enums/button";
import { computed, reactive, ref, onBeforeUnmount } from "vue";
import { useCard } from "./common";
import { useMainStore } from "@/stores/main";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";
import { OrderStatus, PurchaseStatus } from "@/enums/order";
// import xss from "@/utils/xss";
import { getRaffleActivityDetail } from "@/api/raffle";
import {
  productRecoveryRefund,
  productPecoveryConfirmProduct,
  securedTransactionConfirmProduct,
} from "@/api/chat";
import {
  getOrderPurchasePreview,
  orderBargainDetail,
  updatePurchaseStatus,
} from "@/api/order";
import UImage from "@/uni_modules/uview-plus/components/u--image/u--image.vue";
import { getEstimateProductInfo } from "@/api/product";

const userStore = useUserStore();
const messageStore = useMessageStore();
const mainStore = useMainStore();

const identifyNum = computed(() => Boolean(userStore?.userInfo?.identifyNum));

const props = defineProps({
  to: {
    type: String,
    default: "", // 会话id
  },
  idClient: {
    //  消息唯一id
    type: String,
    default: "",
  },
  attach: {
    type: Object,
    default: () => ({
      option: {
        template: "",
        content: {
          title: "",
          desc: "",
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
  status: "",
  btnText: {
    type: String,
    default: "",
  },
});
const placeholderStyle = reactive({
  fontSize: "24rpx",
  color: "#AFAFAF",
});
const teamExt = messageStore.teamExt;
const option = props.attach?.option;
const content = reactive({ ...option?.content }) || {};

const reasonPopupRef = ref(null);
const reasonPopup = reactive({
  title: "不通过原因",
  reason: "",
  open: () => {
    reasonPopup.reason = "";
    reasonPopupRef.value?.open();
  },
});
const reasonLength = computed(() => {
  if (!reasonPopup.reason) return 0;
  return reasonPopup.reason.length;
});

const { disabled, getBtnTypeKey } = useCard({
  clickable_by: props.attach?.permissions?.clickable_by || [],
  to: props.to,
  idClient: props.idClient,
});

const link = reactive({
  confirmText: "",
  cancelText: "",
  url: "",
  btn: true,
  btnRow: false,
  disabled: false,
  desc: false,
});

const content_labels = ref([]);
const initContentLabels = () => {
  content_labels.value = [];
  for (const key in content) {
    const record = messageStore.messageCardFieldLabel.find(
      (item) => item.field === key
    );
    if (record) {
      content_labels.value.push({
        label: record.label,
        value: content[record.field],
      });
    }
  }
};
initContentLabels();

const previewPic = () => {
  if (content.card_image) {
    uni.previewImage({ urls: [content.card_image] });
  }
};

const enum LinkOpenType {
  INQUIRY_REASON = "inquiry_reason",
}
const template = option?.template;
const openType = ref(""); // 传入按钮的打开类型
const btn_params = ref({});
switch (template) {
  case MsgTemplate.SECURED_TRANSACTION_PRODUCT_WAIT_ENTERED:
    link.confirmText = "立即录入";
    link.open_type = "real_name_auth";
    link.url = `/pages/sell-account/sell-game-enter/index?ticketId=${content.ticket_id}&title=${content.title}&type=${ProductTypeEnum.GUARANTEE}`;
    break;
  case MsgTemplate.VALUATION_RESULT:
    link.confirmText = "查看详情";
    // link.content = `估价ID:${content.estimate_id}`;
    // link.url = `/pages/sell-account/sell-game-enter/index?title=${content.title}&type=${ProductTypeEnum.VALUATION}&estimate_id=${content.estimate_id}`
    link.url = `/pages/valuation/detail?id=${content.estimate_id}`;
    link.btn = false;
    link.open_type = template;
    break;
  case MsgTemplate.ACTIVITY_PARTICIPATION:
    link.confirmText = "前往活动";
    link.btn = false;
    break;
  case MsgTemplate.ACTIVITY_NON_WINNER:
    openType.value = OpenType.CUSTOMER_SERVICE;
    link.confirmText = "联系客服"; // 跳到咨询客服
    link.btn = false;
    break;
  case MsgTemplate.ACTIVITY_WINNER:
    openType.value = OpenType.CUSTOMER_SERVICE;
    link.confirmText = "联系客服";
    btn_params.value = {
      order_id: content.order_id,
    };
    link.btn = false;
    break;
  case MsgTemplate.SECURED_TRANSACTION_DESC:
    link.confirmText = "立即认证"; // 担保交易说明模板
    link.open_type = "real_name_auth";
    link.disabled = identifyNum.value;
    break;
  case MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_BUYER:
    link.confirmText = "去签署"; // 待买家签署
    link.url = `/pages/web-view/index?url=${content?.contract_link}&title=签署合同`;
    // link.open_type = "link";
    // plus.runtime.openWeb();
    // plus.runtime.openURL(jump_url);
    break;

  //号商包赔买家签署
  case MsgTemplate.PRODUCT_RECOVERY_CONTRACT_FOR_BUYER:
    link.confirmText = "去签署"; // 待买家签署
    link.url = `/pages/web-view/index?url=${content?.contract_link}&title=签署合同`;
    // link.open_type = "link";
    // plus.runtime.openWeb();
    // plus.runtime.openURL(jump_url);
    break;
  case MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_SELLER:
    link.confirmText = "去签署"; // 待卖家签署
    link.url = `/pages/web-view/index?url=${content?.contract_link}&title=签署合同`;
    // link.open_type = "link";
    break;
  case MsgTemplate.SECURED_TRANSACTION_PRODUCT_CONFIRM:
    link.confirmText = "通过";
    link.cancelText = "不通过";
    link.open_type = LinkOpenType.INQUIRY_REASON; // 询问原因弹窗
    reasonPopup.title = "不通过原因";
    break;

  case MsgTemplate.PRODUCT_RECOVERY_WAIT_ENTERED: // 号商商品已录入
    link.confirmText = "去录入";
    link.open_type = "real_name_auth";

    userStore.setGameHistory({
      id: content.game_id,
      game_name: content.game_name,
      icon: content.game_icon,
    });

    link.url = `/pages/sell-account/sell-information-enter/index?ticketId=${content.ticket_id}&title=${content.title}&type=${ProductTypeEnum.RECYCLE}`;
    break;
  case MsgTemplate.PRODUCT_RECOVERY_ORDER_REFUND: // 号商商品退款
    link.confirmText = "同意";
    link.cancelText = "不同意";
    // link.content = `退款原因：${content.reason}`
    link.open_type = LinkOpenType.INQUIRY_REASON; // 询问原因弹窗
    reasonPopup.title = "不同意退款原因";
    break;
  case MsgTemplate.PRODUCT_RECOVERY_REQUEST_CONFIRM_RECEIPT: // 号商商品已录入
    link.confirmText = "确认收货";
    const data: any = messageStore.loginCredential;
    link.disabled = data?.accid !== teamExt?.buyer?.accid ? true : false;
    break;
  case MsgTemplate.PRODUCT_RECOVERY_PRODUCT_CONFIRM: // 号商商品确认
    link.confirmText = "同意并支付";
    link.cancelText = "拒绝";
    link.btnRow = true;
    // link.disabled = true // 客户端暂时没有接接口，先禁用

    break;
  case MsgTemplate.APP_MESSAGE: // 号商商品确认
    console.log("APP_MESSAGE站内信:");
    link.desc = content?.redirect?.button_text;
    link.open_type = "link";
    link.url = content?.redirect?.page_path?.app;
    // link.url=gotoNotice()
    // link.btnRow = true
    break;
  case MsgTemplate.PRODUCT_COUNTER_OFFER: // 议价
  case MsgTemplate.PRODUCT_COUNTER_OFFER_ACCEPTED:
    link.confirmText = "查看详情";
    link.url = `/pages/bargain/list?bidder=seller&bargainNo=${content.bargain_no}&bargainStatus=${content.bargain_status}`;
    link.btn = false;
    break;
  default:
    break;
}

// 确认
const navigatorTo = async (type) => {
  if (disabled.value() || link.disabled || !link.btn) {
    // 禁用，不是按钮
    // console.log("2222222222222222");

    if (link.open_type === MsgTemplate.VALUATION_RESULT) {
      const { data } = await getEstimateProductInfo(content.estimate_id);
      link.url =
        data.estimate_type == "2"
          ? `/pages/valuation/result?id=${data.estimate_id}&gameId=${data.game_id}`
          : `/pages/valuation/detail?id=${data.estimate_id}`;
      uni.navigateTo({
        url: link.url,
      });
      return;
    }

    if (
      template === MsgTemplate.PRODUCT_COUNTER_OFFER ||
      template === MsgTemplate.PRODUCT_COUNTER_OFFER_ACCEPTED
    ) {
      const { bargain_status, bidder, buyer_id } = await orderBargainDetail({
        bargain_no: content.bargain_no,
      });
      const currentUid = userStore.userInfo.uid.toString();
      let realBidder = bidder;
      if (bidder === "buyer" && buyer_id !== currentUid) {
        realBidder = "seller";
      }
      if (bidder === "seller" && buyer_id === currentUid) {
        realBidder = "buyer";
      }
      //   const realBidder = bidder === "buyer" ? "seller" : "buyer";
      link.url = `/pages/bargain/list?bidder=${realBidder}&bargainNo=${content.bargain_no}&bargainStatus=${bargain_status}`;
      uni.navigateTo({
        url: link.url,
      });
    }
    return;
  }

  // 实名认证
  if (link.open_type === "real_name_auth" && !identifyNum.value) {
    mainStore.toggleRealPopup(true);
    return;
  }
  // 原因确定提交
  onRequest();

  const str = await gotoActivity(template); // 前往活动

  link.url = str || link.url;
  if (typeof link.url === "string") {
    // 打开链接
    if (link.open_type === "link") {
      // #ifdef APP
      plus.runtime.openWeb(link.url);
      // #endif

      // #ifdef H5
      location.href = link.url;
      // #endif
      return;
    }

    if (template === MsgTemplate.PRODUCT_RECOVERY_WAIT_ENTERED) {
      userStore.setGameHistory({
        id: content.game_id,
        game_name: content.game_name,
        icon: content.game_icon,
      });
    }

    // 跳转页面
    uni.navigateTo({
      url: link.url,
      complete() {
        messageStore.setSessionMsgBtnKey(getBtnTypeKey());
      },
    });
  }
};
// 取消
const onCancel = () => {
  if (disabled.value() || link.disabled || !link.btn) {
    // 禁用，不是按钮
    return;
  }
  if ((link.open_type = LinkOpenType.INQUIRY_REASON)) {
    reasonPopup.open();
    return;
  }
};

// 请求接口方法
const onRequest = (data?: any) => {
  console.log("data", data);
  const { productConfirmStatus } = data || {};
  const status = productConfirmStatus || ProductConfirmStatus.ACCEPTED;
  switch (template) {
    case MsgTemplate.SECURED_TRANSACTION_PRODUCT_CONFIRM:
      onSecuredTransactionConfirmProduct(status, reasonPopup.reason);
      break;
    case MsgTemplate.PRODUCT_RECOVERY_ORDER_REFUND: // 号商商品退款
      onProductRecoveryRefund(status, reasonPopup.reason);
      break;
    case MsgTemplate.PRODUCT_RECOVERY_REQUEST_CONFIRM_RECEIPT: // 号商买家确认收货
      onConfirmReceipt();
      break;
    case MsgTemplate.PRODUCT_RECOVERY_PRODUCT_CONFIRM: // 号商同意支付
      if (productConfirmStatus === ProductConfirmStatus.REJECTED) {
        onProductPecoveryConfirmProduct(status);
      } else {
        handlePlaceOrder(status);
      }
      break;
    default:
      break;
  }
};

const handlePlaceOrder = (status) => {
  // if (disabled.value(type)) {
  //   return
  // }
  // if (!userStore.userInfo.identifyNum) {
  //   mainStore.toggleRealPopup(true);
  //   return;
  // }
  // uni.$main.showLoading();
  const params = { product_id: content.product_id };
  getOrderPurchasePreview(params)
    .then((res) => {
      try {
        const params = uni.$u.queryParams({
          product_id: content.product_id,
          transaction_type: OpenType.MERCHANT,
        });
        console.warn("params", params);
        userStore.setMerchantPayInfo({
          requestParam: {
            ticket_id: teamExt?.ticket?.id,
            product_id: content.product_id,
            status: status,
            reason: reasonPopup.reason,
          },
          // btnTypeKey:getBtnTypeKey()
          cb: () => {
            messageStore.setSessionMsgBtnKey(getBtnTypeKey());
            messageStore.setOperationPermissions();
          },
        });
        // messageStore.setSessionMsgBtnKey(getBtnTypeKey(type))
        uni.navigateTo({ url: "/pages/goods/front-buy" + params });
      } catch (error) {
        console.error(error);
      }
    })
    .catch(({ code, data }) => {
      // 重复下单
      if (code && code == PurchaseStatus.ORDER_DUPLICATE) {
        existOrderPopupRef.value.open();
        order_id.value = data.order_id;
      }
    });
};

// 原因弹窗确认
const onReasonPopupConfirm = (
  status: string = ProductConfirmStatus.REJECTED
) => {
  if (!reasonPopup.reason) {
    uni.$main.toast("请输入原因");
    return;
  }
  onRequest({
    productConfirmStatus: status,
  });
};
const onProductPecoveryConfirmProduct = (status: any) => {
  productPecoveryConfirmProduct({
    ticket_id: teamExt?.ticket?.id,
    product_id: content.product_id,
    status: status,
    reason: reasonPopup.reason,
  }).then((res) => {
    uni.$main.toast("提交成功");
    messageStore.setSessionMsgBtnKey(getBtnTypeKey());
    messageStore.setOperationPermissions();
    reasonPopupRef.value?.close();
  });
};

// 担保商品信息确认
const onSecuredTransactionConfirmProduct = (status, reason: string = "") => {
  const params = {
    product_id: content.product_id,
    status: status,
    ticket_id: teamExt?.ticket?.id,
    reason,
  };
  securedTransactionConfirmProduct(params).then((res) => {
    messageStore.setSessionMsgBtnKey(getBtnTypeKey());
    messageStore.setOperationPermissions();
    uni.$main.toast("提交成功");
    reasonPopupRef.value?.close();
  });
};

// 号商买家确认收货
const onConfirmReceipt = async () => {
  const res = await updatePurchaseStatus({
    order_id: content.order_id,
    to_order_status: OrderStatus.FINISHED,
  });
  if (res) {
    uni.$main.toast("收货成功");
    messageStore.setSessionMsgBtnKey(getBtnTypeKey());
    messageStore.setOperationPermissions();
  }
};

// 号商商品退款
const onProductRecoveryRefund = (status, reason: string = "") => {
  const params = {
    ticket_id: content.ticket_id,
    status,
    reason,
  };
  productRecoveryRefund(params).then((res) => {
    uni.$main.toast("提交成功");
    messageStore.setSessionMsgBtnKey(getBtnTypeKey());
    messageStore.setOperationPermissions();
    reasonPopupRef.value?.close();
  });
};
// 前往活动
const gotoActivity = async (template) => {
  // 前往活动
  if (template === MsgTemplate.ACTIVITY_PARTICIPATION) {
    const res = await getRaffleActivityDetail(
      mainStore.homeRaffle?.activity_id
    ).catch((err) => {});
    if (res && res.nowTimeId) {
      const { timeList, nowTimeId } = res;
      return `/pages/raffle/index?timeList=${JSON.stringify(
        timeList
      )}&nowTimeId=${nowTimeId}`;
    }
  }
};

onBeforeUnmount(() => {
  //关闭图片预览
  uni.closePreviewImage({
    fail: (err) => {
      // console.log("图片预览关闭失败", err);
    },
  });
});

// const gotoNotice = async (template) => {
//   // 前往活动
//   if (template === MsgTemplate.APP_MESSAGE) {
//       return content?.redirect?.page_path?.app
//   }
// };
</script>
<style lang="scss" scoped>
@import "./common.scss";

.l-m-10 {
  width: 100%;
  height: 30rpx;
}
</style>
