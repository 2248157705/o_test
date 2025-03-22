<template>
  <view class="account-contract">
    <view class="item first-child" @click="handleGoCollection">
      <view class="icon">
        <u--image
          src="/static/images/my/icon_collection.png"
          width="40rpx"
          height="40rpx"
        ></u--image>
        <text class="text">收藏</text>
      </view>
      <view class="msg">
        <text class="text">{{ userStore.userInfo?.user_collection || 0 }}</text>
        <u--image
          width="40rpx"
          height="40rpx"
          src="/static/images/my/icon_back.png"
        />
      </view>
    </view>
    <view></view>
    <view class="item" @click="handleGoContract">
      <view class="icon">
        <u--image
          src="/static/images/my/icon_contract.png"
          width="40rpx"
          height="40rpx"
        ></u--image>
        <text class="text">合同中心</text>
      </view>
      <view class="msg">
        <text class="text">{{ userStore.userInfo?.user_contract || 0 }}</text>
        <u--image
          width="40rpx"
          height="40rpx"
          src="/static/images/my/icon_back.png"
        />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const handleGoContract = () => {
  if (!userStore.userInfo) {
    uni.navigateTo({
      url: "/pages/login/index",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/my/contract-center/index",
  });
};
const handleGoCollection = () => {
  if (!userStore.userInfo) {
    uni.navigateTo({
      url: "/pages/login/index",
    });
    return;
  }
  uni.navigateTo({
    url: "/pages/my/collection-center/index",
  });
};
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.account-contract {
  width: 702rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  padding: 28rpx 24rpx;
  background-color: #fff;
  .item {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    &.first-child {
      border-right: 1rpx solid #f4f5f6;
      padding-right: 30rpx;
      margin-right: 30rpx;
    }
    .icon {
      @include flex(row);
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
        margin-left: 8rpx;
      }
    }
    .msg {
      @include flex(row);
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #afafaf;
      }
    }
  }
}
</style>
