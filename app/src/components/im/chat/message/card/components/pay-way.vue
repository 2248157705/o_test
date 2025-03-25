<template>
  <u-popup
    :show="show"
    :round="10"
    :mode="'bottom'"
    :close-on-click-overlay="false"
    :closeable="false"
    @close="close"
  >
    <view class="popup-content">
      <image
        class="close"
        src="/static/images/im/close.png"
        @click="close"
      ></image>
      <view class="price-box">
        <view class="unit">￥</view>
        <view class="number">{{ payInfo?.penalty_amount }}</view>
      </view>
      <view class="account-box">
        <view class="name">账号</view>
        <view class="txt">{{ userPhone }}</view>
      </view>
      <view class="form-box">
        <pay-method
          :totalPrice="payInfo?.penalty_amount"
          :type="PayPanel.PENALTY_PAY"
        />
      </view>
      <view class="pay" @click="handlePay">立即支付</view>
    </view>
  </u-popup>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { PayPanel } from "@/enums/common";
import { useUserStore } from "@/stores/user";
import { PenaltyPayment } from "@/pages/order/js/orderPenaltyPayment";
import PayMethod from "@/pages/goods/components/goods-order/pay-method.vue";

interface PayInfoProps {
  penalty_order_id: string;
  actual_amount: number;
  order_id: string;
  origin_amount: number;
  penalty_amount: number;
  penalty_channel: string;
  penalty_status: string;
  rate_formula: string;
  uid: string;
  user_type: string;
  pay_info_value?: any[];
}

const { fetchPurchasePayment, checkH5PayStatus, clearCheckPayStatus } =
  PenaltyPayment();

const userStore = useUserStore();

const show = ref(false);
const payInfo = ref<PayInfoProps>(null);

const userPhone = computed(() => {
  if (userStore?.userInfo?.phone) {
    return userStore?.userInfo?.phone.replace(/(?<=\d{3})\d+(?=\d{4})/, "***");
  }
  return "";
});

// 打开支付弹窗
const open = () => {
  userStore.setCurrentPay(PayPanel.PENALTY_PAY);
  userStore.setPenaltyCB = () => {
    uni.$main.toast("支付成功");
    show.value = false;
    userStore.setPenaltyCB = null;
  };
  show.value = true;
};

// 关闭支付弹窗
const close = () => {
  userStore.setCurrentPay(PayPanel.OTHER_PAY);
  userStore.setPenaltyCB = null;
  show.value = false;
};

//立即支付
const handlePay = () => {
  const { way3Charge, coinCharge } = userStore.selectedPenaltyMethod;
  if (payInfo.value && (way3Charge.payMethod || coinCharge.payMethod)) {
    const { order_id, penalty_order_id, penalty_amount } = payInfo.value;
    fetchPurchasePayment(order_id, penalty_order_id, penalty_amount);
  } else {
    uni.$main.toast("请选择支付方式");
  }
};

// 更新违约金支付信息
const updatePenaltyAmount = (data: PayInfoProps) => {
  payInfo.value = data;
};

onShow(() => {
  // userStore.getUserWalletInfo();
  if (show.value) {
    checkH5PayStatus();
  }
});

onUnmounted(() => {
  clearCheckPayStatus();
});

defineExpose({
  open,
  close,
  updatePenaltyAmount,
});
</script>
<style scoped lang="scss">
.popup-content {
  position: relative;
  .price-box {
    margin-top: 80rpx;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .unit {
      font-weight: bold;
      font-size: 48rpx;
      color: #1a1a1a;
    }
    .number {
      font-weight: bold;
      font-size: 72rpx;
      color: #1a1a1a;
    }
  }

  .recommend {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
    text-align: center;
  }

  .account-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 24rpx;
    .name {
      font-weight: 400;
      font-size: 32rpx;
      color: #afafaf;
      text-align: left;
    }
    .txt {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
      text-align: right;
    }
  }
  .close {
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    width: 50rpx;
    height: 50rpx;
  }
}

.pay-head {
  margin: 16rpx 0rpx;
}
.pay {
  font-weight: 500;
  font-size: 32rpx;
  color: #ffffff;
  text-align: center;
  //width: 686px;
  //height: 96rpx;
  line-height: 96rpx;
  background: #1cc7be;
  border-radius: 12rpx 12rpx 12rpx 12rpx;
  margin-bottom: 30rpx;
  margin: 24rpx 24rpx 50rpx;
}
.form-box {
  background: #ffffff;
  border-radius: 12rpx;
  //box-sizing: border-box;
  box-sizing: content-box;
  margin: 0rpx 24rpx 24rpx;
  width: 700rpx;
}
.balance {
  padding: 18rpx 24rpx 0rpx;
}

.third-part {
  padding: 0rpx 24rpx 18rpx;
}

.pay-list {
  .flex {
    @include flex(row);
  }
  .row {
    position: relative;
    @include flex(row);
    align-items: center;
    justify-content: space-between;
  }

  .coin-item {
    .checkbox {
      position: absolute;
      right: 0;
      top: 0rpx;
    }
  }

  .row.disabled {
    .detail {
      .name {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf !important;
      }
    }
  }

  .list {
    position: relative;
    margin: 8rpx 0;
    padding: 12rpx 0;
    padding-right: 60rpx;

    .img {
      margin-right: 24rpx;
    }
    .detail {
      @include flex(row);
      align-items: center;

      .name {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }

    .tips {
      margin-top: 12rpx;
      width: 550rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #ff4b4b;
        line-height: 50rpx;
      }
    }
  }
}
</style>
