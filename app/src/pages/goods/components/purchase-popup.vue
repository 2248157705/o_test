<template>
  <popup ref="purchasePopupRef">
    <view class="purchase-popup">
      <view class="purchase-content">
        <text class="text">已存在待支付订单，请前往个人中心支付！</text>
      </view>
      <view class="btn-box">
        <view class="btn cancel" @click="purchasePopupRef.close()">
          <text class="text">再看看</text>
        </view>
        <view class="btn confirm" @click="handleConfirm">
          <text class="text">立即前往</text>
        </view>
      </view>
    </view>
  </popup>
</template>

<script setup>
import { ref } from "vue";
import Popup from "@/components/my-popup/index.vue";
const purchasePopupRef = ref(null);

const handleConfirm = () => {
  purchasePopupRef.value.close();
  uni.navigateTo({
    url: "/pages/order/list",
  });
};

const close = () => {
  purchasePopupRef.value.close();
};

const open = () => {
  purchasePopupRef.value.open();
};

defineExpose({
  close,
  open,
});
</script>

<style lang="scss" scoped>
.purchase-popup {
  flex: 1;
  @include flex(column);
  /* max-height: max-content; */
  .purchase-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .text {
      color: #1a1a1a;
      font-size: 32rpx;
      font-weight: 400;
    }
  }
  .btn-box {
    @include flex(row);
    justify-content: space-between;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 236rpx;
      height: 68rpx;
      border-radius: 4rpx;
      margin-top: 30rpx;
      .text {
        font-weight: 500;
        font-size: 28rpx;
        color: #ffffff;
      }
      &.cancel {
        background-color: #f4f5f6;
        .text {
          color: #606060;
        }
      }
      &.confirm {
        background-color: #1cc7be;
      }
    }
  }
}
</style>
