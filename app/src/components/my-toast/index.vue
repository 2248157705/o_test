<template>
  <u-overlay
    :opacity="0"
    :duration="100"
    :show="mainStore.showToast"
    :custom-style="overlayStyleToast"
    :zIndex="10080"
    @click="() => mainStore.clearToast()"
  >
    <view class="my-toast">
      <view class="toast-view">
        <text class="toast-text">{{ mainStore.toastMsg }}</text>
      </view>
    </view>
  </u-overlay>
  <u-overlay
    :duration="0"
    :opacity="0"
    :show="mainStore.loading"
    :custom-style="overlayStyle"
    :zIndex="10090"
  >
    <view class="my-loading">
      <image
        class="lading-icon"
        src="/static/images/common/loading.gif"
        mode="scaleToFill"
      />
    </view>
  </u-overlay>
</template>

<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/main";
import { onHide, onShow } from "@dcloudio/uni-app";
const mainStore = useMainStore();

const overlayStyle = computed(() => {
  return {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  };
});
const overlayStyleToast = computed(() => {
  return {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    top: uni.getSystemInfoSync().windowHeight / 2 + "px",
    bottom: "unset",
  };
});

const handleClose = () => {
  if (mainStore.showToast) {
    mainStore.clearToast();
  }
  if (mainStore.loading) {
    mainStore.hideLoading();
  }
};

onHide(() => handleClose());
onShow(() => handleClose());
</script>

<style lang="scss" scoped>
.my-toast {
  .toast-view {
    // width: 500rpx;
    padding: 16rpx 24rpx;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    /* #endif */
    .toast-text {
      font-size: 32rpx;
      color: #fff;
    }
  }
}
.my-loading {
  .lading-icon {
    width: 60rpx;
    height: 60rpx;
  }
}
</style>
