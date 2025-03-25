<template>
  <view v-if="orderStatusData.name" :class="btnListClass">
    <!-- 拒绝售后 -->
    <template
      v-if="[OrderStatus.AFTER_SALE_REJECTED].includes(orderStatusData.action)"
    >
      <view
        :class="`btn plain`"
        @click="handleBtn(orderActionMap.AFTERSALE_CHAT)"
      >
        <text class="text">联系客服</text>
      </view>
      <view :class="`btn plain`" @click="handleBtn(orderStatusData.action)">
        <text class="text">再次售后</text>
      </view>
    </template>

    <!-- 未支付订单 -->
    <template
      v-else-if="[orderActionMap.PAID].includes(orderStatusData.action)"
    >
      <view :class="`btn plain`" @click="handleBtn(orderActionMap.CLOSE)">
        <text class="text">取消订单</text>
      </view>
      <view :class="`btn solid`" @click="handleBtn(orderStatusData.action)">
        <text class="text">立即付款</text>
      </view>
    </template>

    <!-- 待发货 -->
    <template
      v-else-if="[orderActionMap.REFUND].includes(orderStatusData.action)"
    >
      <view :class="`btn plain`" @click="handleBtn(orderActionMap.REFUND)">
        <text class="text">申请退款</text>
      </view>
      <view
        :class="`btn primary`"
        @click="handleBtn(orderActionMap.ORDER_CHAT)"
      >
        <text class="text">交易群聊</text>
      </view>
    </template>

    <template v-else>
      <view :class="btnClass" @click="handleBtn(orderStatusData.action)">
        <text class="text">
          {{ orderStatusData.name }}
        </text>
      </view>
    </template>
    <refund-popup
      ref="refundRef"
      :title="refundApplyData.title"
      :options="refundApplyData.options"
      @change="handleChangeRefund"
    />
    <pay-select-popup ref="selectPayRef" @submit="handleSubmitPay" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { OrderStatus } from "@/enums/order";
import {
  GoodsOrder,
  getOrderStatusData,
  orderActionMap,
  refundApplyReasonOptions,
  // afterSaleApplyReasonOptions,
} from "@/pages/order/js/order";
import { GoodsPurchase } from "@/pages/order/js/purchase";
import RefundPopup from "@/pages/order/components/refund-popup.vue";
import PaySelectPopup from "@/pages/order/components/pay-select-popup.vue";
import { payMethodDataMap } from "@/pages/order/js/purchase";
import { PayStatus, PaymentType } from "@/enums/order";
// import { ApplyOrderType } from "@/enums/common";
import {
  consultCustomerService,
  consultPostSaleService,
} from "@/components/im/conversation-list";
import Events, { report } from "@/utils/report/report";

const props = defineProps({
  order: {
    type: Object,
    default: () => {
      return {};
    },
  },
  size: {
    type: String,
    default: "",
  },
  showPopup: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["refresh"]);
const {
  refundRef,
  detailData,
  refundApplyData,
  fetchUpdatePurchaseStatus,
  fetchAfterSaleApply,
  fetchPurchaseRefundApply,
  fetchAfterSaleTidByOrderId,
  fetchClosePurchase,
} = GoodsOrder({
  refresh: () => {
    emit("refresh");
  },
});

const {
  orderData,
  fetchPurchasePaymentV2,
  checkH5PayStatus,
  closeWebview,
  clearCheckPayStatus,
} = GoodsPurchase();

const selectPayRef = ref();

watch(
  () => props.order,
  (values) => {
    // console.log("props.order", values);
    if (values && values.order_id) {
      detailData.orderId = values.order_id;
      detailData.detail = values;
      orderData.price = values.actual_amount;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const btnListClass = computed(() => {
  return {
    "btn-list": true,
    large: props.size === "large",
    more: [orderActionMap.PAID].includes(orderStatusData.value.action),
  };
});

const btnClass = computed(() => {
  // const bool = [orderActionMap.PAID, orderActionMap.RECEIVE].includes(
  //   orderStatusData.value?.action
  // );
  return {
    btn: true,
    primary: [orderActionMap.RECEIVE].includes(orderStatusData.value?.action),
    solid: [orderActionMap.PAID].includes(orderStatusData.value?.action),
  };
});

const orderStatusData = computed(() => {
  const { order_status, order_type } = props.order;
  const insurance_id =
    props.order.insurance_order_id || props.order.order_insurance?.insurance_id;

  return getOrderStatusData(order_status, order_type, {
    insurance_id: insurance_id,
  });
});

const usedPayMethodData = computed(() => {
  if (detailData.detail) {
    const { pay_info_value } = detailData.detail;
    const data = {
      coinCharge: null,
      way3Charge: null,
    };
    if (pay_info_value && pay_info_value.pay_info_list.length > 0) {
      pay_info_value.pay_info_list.forEach((el) => {
        if (el.pay_status === PayStatus.ING) {
          if (el.pay_method === PaymentType.TCOIN) {
            data.coinCharge = {
              code: el.pay_channel,
              payMethod: el.pay_method,
              name: payMethodDataMap[el.pay_method].name,
              img: payMethodDataMap[el.pay_method].img,
            };
          } else {
            data.way3Charge = {
              code: el.pay_channel,
              payMethod: el.pay_method,
              name: payMethodDataMap[el.pay_method].name,
              img: payMethodDataMap[el.pay_method].img,
            };
          }
        }
      });
    }
    return data;
  } else {
    return null;
  }
});

// const statusColor = computed(() => {
//   if (props.order.order_status === OrderStatus.Unpaid) {
//     return "#F42A2A";
//   } else if (props.order.order_status === OrderStatus.CLOSED) {
//     return "#AFAFAF";
//   } else {
//     return "#2E9D97";
//   }
// });

const handleBtn = async (action) => {
  if (action === orderActionMap.PAID) {
    // 支付
    handlePay();
  } else if (action === orderActionMap.RECEIVE) {
    // 确认收货
    handleReceive();
  } else if (action === orderActionMap.REFUND) {
    // 退款申请
    report(Events.ORDER_PURCHASE_REFUND_APPLY);
    handleRefunded();
  } else if (action === orderActionMap.CONTACT) {
    // 申请售后
    report(Events.ORDER_PURCHASE_AFTERSALE_APPLY);
    handleOrderSale();
  } else if (action === orderActionMap.CLAIMS) {
    // 申请理赔
    report(Events.ORDER_PURCHASE_AFTERSALE_CLAIMS);
    handleOrderClaims();
  } else if (action === orderActionMap.ORDER_CHAT) {
    // 进入交易群聊
    handleOrderService();
  } else if (action === orderActionMap.AFTERSALE_CHAT) {
    // 进入售后群聊
    handleAfterSaleService();
  } else if (action === orderActionMap.CLOSE) {
    // 取消订单
    handleClose();
  } else if (action === orderActionMap.SERVICE) {
    // 联系客服
    handleService(props.order.product);
  }
};
const handlePay = async () => {
  handleSubmitPay();
};

const handleSubmitPay = async () => {
  if (detailData.detail && detailData.detail.pay_info_value) {
    const { pay_info_value } = detailData.detail;
    const pay_info_list = pay_info_value.pay_info_list.filter(
      (el) => el.pay_status === PayStatus.ING
    );
    if (usedPayMethodData.value && pay_info_list.length > 0) {
      await fetchPurchasePaymentV2(detailData.orderId, {
        coinCharge: usedPayMethodData.value.coinCharge,
        way3Charge: usedPayMethodData.value.way3Charge,
      });
      emit("refresh");
    } else {
      uni.$main.toast("请选择支付方式");
    }
  } else {
    uni.$main.toast("请选择支付方式");
  }

  // const { code, payMethod } = userStore.selectedPayMethod.way3Charge;
  // if (code && payMethod) {
  //   selectPayRef.value?.close();
  //   await fetchPurchasePaymentV2(detailData.orderId);
  //   emit("refresh");
  // } else {
  //   uni.$main.toast("请选择支付方式");
  // }
};

const handleRefunded = async () => {
  refundApplyData.title = "退款理由";
  refundApplyData.options = refundApplyReasonOptions;
  refundApplyData.action = "refund";
  refundRef.value?.open();
};

const handleReceive = async () => {
  await fetchUpdatePurchaseStatus(detailData.orderId);
};

const handleClose = async () => {
  await fetchClosePurchase(detailData.orderId);
};

const handleOrderSale = async () => {
  uni.navigateTo({
    url: "/pages/order/after-sale?order_id=" + detailData.orderId,
  });
};

const handleOrderClaims = async () => {
  uni.navigateTo({
    url: "/pages/order/after-claims?order_id=" + detailData.orderId,
  });
};

const handleOrderService = () => {
  // consultPostSaleService(
  //   detailData.orderId,
  // );
  fetchAfterSaleTidByOrderId(detailData.orderId, detailData.detail?.order_type);
};

const handleAfterSaleService = () => {
  consultPostSaleService(
    detailData.orderId,
    orderStatusData.value.sub_type,
    props.order.product
  );
};

const handleService = (product) => {
  consultCustomerService(product);
};

const handleChangeRefund = async (values) => {
  if (refundApplyData.action === "refund") {
    await fetchPurchaseRefundApply({
      order_id: detailData.orderId,
      reason: values.reason,
      apply_desc: values.apply_desc,
    });
  } else {
    await fetchAfterSaleApply({
      order_id: detailData.orderId,
      reason: values.reason,
      apply_desc: values.apply_desc,
    });
  }
};

defineExpose({
  checkH5PayStatus,
  closeWebview,
  clearCheckPayStatus,
});
</script>

<style lang="scss" scoped>
.btn-list {
  @include flex(row);
  justify-content: flex-end;

  &.large {
    .btn {
      margin: 0rpx;
      width: 702rpx;
      height: 96rpx;
      border-radius: 12rpx;

      .text {
        font-weight: 500;
        font-size: 32rpx;
      }
    }

    &.more {
      width: 750rpx;
      justify-content: space-between !important;

      .btn {
        width: 340rpx;
      }
    }
  }
}
.btn {
  margin-left: 24rpx;
  padding: 0 36rpx;
  background: #f4f5f6;
  border-radius: $app-box-radius;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 200rpx;
  // box-sizing: border-box;
  border: 2rpx solid #f4f5f6;
  height: $app-small-btn-height;

  &.primary {
    background: #1cc7be;
    border-color: $app-main-color;
    .text {
      @include flex(row);
      justify-content: center;
      align-items: center;
      color: $uni-text-color-white;
      font-weight: 500;
    }
  }
  &.solid {
    background: $app-main-color;
    border-color: $app-main-color;
    .text {
      font-weight: 500;
      font-size: 28rpx;
      color: #ffffff;
    }
  }

  .text {
    font-weight: 500;
    font-size: 28rpx;
    color: #1a1a1a;
  }
}
// ::v-deep .goods-view .u-count-down .u-count-down__text {
//   color: #fff !important;
//   font-size: 22rpx !important;
// }
</style>
