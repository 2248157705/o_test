<template>
  <view v-if="showCoinPay" class="content">
    <!-- <view v-if="hasPenalty" class="content"> -->
    <view class="title">
      <text class="text">余额支付</text>
    </view>
    <view class="form-box">
      <pay-tcoin-list :type="type" :totalPrice="totalPrice" />
    </view>
  </view>

  <view v-if="showWay3Pay" class="content">
    <view class="title">
      <text class="text">更多支付方式</text>
      <text class="msg">可与余额组合支付</text>
    </view>
    <view class="form-box">
      <pay-list :type="type" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserStore } from "@/stores/user";
import PayList from "@/pages/order/components/pay-list.vue";
import PayTcoinList from "@/pages/order/components/pay-tcoin-list.vue";
import { computed } from "vue";
import { PayPanel } from "@/enums/common";

const props = defineProps({
  type: {
    type: String,
    default: PayPanel.Other_PAY,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const userStore = useUserStore();

const showCoinPay = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.penaltyMethodData.hasCoinCharge;
  } else {
    return userStore.payMethodData.hasCoinCharge;
  }
});

const showWay3Pay = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.penaltyMethodData.hasWay3Charge;
  } else if (props.type === PayPanel.MERCHANT_PAY) {
    return false;
  } else {
    return userStore.payMethodData.hasWay3Charge;
  }
});

// const way3ChargeItems = computed(() => {
//   return userStore.currentPay === PayPanel.PENALTY_PAY
//     ? userStore.penaltyInfo
//     : userStore.payInfo;
// });

// const hasPenalty = computed(() => {
//   const pays =
//     userStore.currentPay === PayPanel.PENALTY_PAY
//       ? userStore.penaltyInfo
//       : userStore.payInfo;
//   const penaltyPays = pays.filter((el) => el.payMethod === PaymentType.TCOIN);
//   return penaltyPays && penaltyPays.length > 0;
// });
</script>
<style lang="scss" scoped>
@import "./style.scss";

.content {
  margin-top: 44rpx;
}

.form-content {
  width: 450rpx;
}

.form-items {
  align-items: start !important;
}
.form-label {
  padding-top: 20rpx;
}
.title {
  margin-bottom: 24rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .text {
    font-weight: 600;
    font-size: 32rpx;
    color: #1a1a1a;
  }
  .msg {
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
  }
}
</style>
