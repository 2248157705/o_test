<template>
  <view v-if="show" class="notification-setup" @click="openNotification">
    <view class="left">
      <image class="img" src="@/static/images/im/list/3.png"></image>
      <view class="des">
        <view class="title">开启通知</view>
        <view class="txt">打开推送，不错过重要消息</view>
      </view>
    </view>
    <view class="start">立即开启</view>
    <view class="close" @click="toClose">
      <image class="img" src="@/static/images/im/list/2.png"></image>
    </view>
  </view>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";

defineProps({
  status: {
    type: Boolean,
    default: true,
  },
});

const show = ref(true);

const toClose = () => {
  show.value = false;
};
const openNotification = () => {};

onMounted(() => {});
</script>

<style scoped lang="scss">
.notification-setup {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 32rpx 32rpx 32rpx;
  position: relative;
  .left {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .img {
      width: 75rpx;
      height: 75rpx;
      margin-right: 16rpx;
    }
    .des {
      .title {
        font-weight: 500;
        font-size: 32rpx;
        color: #1a1a1a;
      }
      .txt {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf;
        margin: 10rpx 0rpx;
      }
    }
  }
  .start {
    font-weight: 500;
    font-size: 28rpx;
    color: #1cc7be;
    margin-right: 48rpx;
  }
  .close {
    position: absolute;
    top: 0rpx;
    right: 20rpx;
    .img {
      width: 50rpx;
      height: 50rpx;
    }
  }
}
</style>
