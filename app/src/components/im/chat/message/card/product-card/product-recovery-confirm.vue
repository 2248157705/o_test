<template>
  <!-- 买家确认信息 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view>
        <text>商品ID: </text>
        <text class="content-name">{{ content?.product_id }}</text>
      </view>
      <view v-if="content?.desc">{{ content?.desc }} </view>
    </view>

    <view v-if="isCanClickable()" class="btn-box-row">
      <BtnInvalid v-if="isInvalid" />
      <BtnInfo v-else-if="isPayed" text="已支付" />
      <BtnInfo v-else-if="isRefund" text="已拒绝" />
      <template v-else>
        <BtnPrimary text="去下单" @click="onConfirm" />
        <BtnInfo text="拒绝" @click="onRefund" />
      </template>
    </view>
  </view>
  <ReasonPopup
    ref="reasonPopupRef"
    title="原因"
    mode="center"
    showConfirmButton
    showCancelButton
    :confirmClose="false"
    @confirm="onReasonPopupConfirm"
  >
    <view class="reason-popup-content">
      <textarea
        v-model="reasonPopupData.reason"
        class="value-textarea"
        placeholder="请输入原因，便于客服处理～"
        maxlength="200"
      />
    </view>
  </ReasonPopup>

  <ExistOrderPopup
    ref="existOrderPopupRef"
    title="温馨提示"
    text="已存在待支付订单，请前往订单详情！"
    showConfirmButton
    showCancelButton
    @confirm="handleOrderDetail"
  />
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { CardBtnType } from "@/components/im/utils/enums";
import { OpenType } from "@/enums/button";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import {
  ReasonPopupUtil,
  ProductConfirmStatus,
} from "@/components/im/chat/message/card/js/reason-popup";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { PurchaseStatus, OrderStatus } from "@/enums/order";
import { productPecoveryConfirmProduct } from "@/api/chat";
import { getOrderPurchasePreview, getOrderList } from "@/api/order";
import ReasonPopup from "@/components/my-popup/index.vue";
import ExistOrderPopup from "@/components/my-popup/index.vue";
import BtnInvalid from "../components/btn-invalid.vue";
import BtnInfo from "../components/btn-info.vue";
import BtnPrimary from "../components/btn-primary.vue";

// 只有买家才能点
const props = defineProps({
  msg: {
    type: Object,
    default: () => {
      return {};
    },
  },
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
          product_id: "",
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const messageStore = useMessageStore();
const userStore = useUserStore();

const { reasonPopupRef, reasonPopupData, openReasonPopup, closeReasonPopup } =
  ReasonPopupUtil();

const { content } = MessageUtil({
  attach: props.attach,
});

const {
  navigateTo,
  getKey,
  isCanClickable,
  isOperated,
  updateOperationPermissions,
  validationRule,
} = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by || [],
  idClient: props.idClient,
  to: props.to,
  time: props.msg?.time,
});

const existOrderPopupRef = ref(null);
const orderId = ref("");
const isPayed = ref(false);

const isRefund = computed(() => {
  return isOperated(CardBtnType.DEFAULT);
});

// const checkIsPayed = computed(() => {
//   return isOperated(CardBtnType.PRIMARY);
// });

// 拒绝支付
const fetchProductPecoveryConfirmProduct = async (opts) => {
  const res = await productPecoveryConfirmProduct(opts);
  if (res) {
    const key = getKey(CardBtnType.DEFAULT);
    updateOperationPermissions(key);
    uni.$main.toast("提交成功");
    closeReasonPopup();
  }
};

// 预下单查询
const fetchPlaceOrder = async (opts) => {
  getOrderPurchasePreview({
    product_id: opts.product_id,
  })
    .then((res) => {
      if (res) {
        const params = uni.$u.queryParams({
          product_id: opts.product_id,
          transaction_type: OpenType.MERCHANT,
        });
        console.log("params", params);
        userStore.setMerchantPayInfo({
          requestParam: opts,
          cb: () => {},
        });
        navigateTo("/pages/goods/front-buy" + params);
      } else {
        uni.$main.toast("下单失败");
      }
    })
    .catch(({ code, data }) => {
      console.log("code", code, data);

      // 重复下单
      if (code && code == PurchaseStatus.ORDER_DUPLICATE) {
        orderId.value = data.order_id;
        existOrderPopupRef.value?.open();
      } else {
        uni.$main.toast("下单失败");
      }
    });
};

// 检查订单状态
const checkOrderStatus = (opts) => {
  getOrderList(opts)
    .then((res) => {
      if (res && res.list && res.list.length > 0) {
        isPayed.value = true;
      }
    })
    .catch((err) => {
      console.log("checkOrderStatus err", err);
    });
};

const handleOrderDetail = () => {
  if (orderId.value) {
    uni.navigateTo({
      url: `/pages/order/detail?orderId=${orderId.value}`,
    });
  } else {
    uni.$main.toast("订单不存在");
  }
};

const onReasonPopupConfirm = () => {
  if (!reasonPopupData.reason) {
    uni.$main.toast("请输入原因");
    return;
  }
  const teamExt = messageStore.teamExt;
  fetchProductPecoveryConfirmProduct({
    ticket_id: teamExt?.ticket?.id,
    product_id: content.value?.product_id,
    status: ProductConfirmStatus.REJECTED,
    reason: reasonPopupData.reason,
  });
};

const onConfirm = () => {
  validationRule(() => {
    const teamExt = messageStore.teamExt;
    fetchPlaceOrder({
      ticket_id: teamExt?.ticket?.id,
      product_id: content.value?.product_id,
      status: ProductConfirmStatus.ACCEPTED,
      reason: "",
    });
  });
};

const onRefund = () => {
  validationRule(() => {
    openReasonPopup();
  });
};

onMounted(() => {
  if (isCanClickable() && content.value?.product_id) {
    checkOrderStatus({
      product_id: content.value?.product_id,
      order_status: [
        OrderStatus.AFTER_SALE_COMPLETED,
        OrderStatus.AFTER_SALE_REJECTED,
        OrderStatus.AFTER_SALE_REQUESTED,
        OrderStatus.AFTER_SALE_PROCESSING,
        OrderStatus.REFUND_COMPLETED,
        OrderStatus.REFUND_REJECTED,
        OrderStatus.REFUND_REQUESTED,
        OrderStatus.CLAIMS_REQUESTED,
        OrderStatus.CLAIMS_PROCESSING,
        OrderStatus.CLAIMS_COMPLETED,
        OrderStatus.CLAIMS_REJECTED,
        OrderStatus.FINISHED,
        OrderStatus.PAID,
        OrderStatus.SENDING,
        OrderStatus.WAIT_RECEIVE,
        OrderStatus.WAIT_SEND,
      ],
      page: 1,
      per_page: 10,
    });
  }
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
