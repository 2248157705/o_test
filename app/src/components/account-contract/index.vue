<template>
  <view class="account-contract">
    <view class="card-box">
      <view class="card-item" @click="navigateTo('collect')">
        <text class="number">
          {{ userStore.userInfo?.user_collection || 0 }}
        </text>
        <text class="title">收藏</text>
      </view>
      <view class="card-item" @click="navigateTo('history')">
        <text class="number">
          {{ userStore.userInfo?.browsing_number || 0 }}
        </text>
        <text class="title">足迹</text>
      </view>
      <view class="card-item" @click="navigateTo('consultation')">
        <text class="number">
          {{ userStore.userInfo?.consultation_number || 0 }}
        </text>
        <text class="title">咨询记录</text>
      </view>
    </view>

    <view class="contract">
      <view class="bg-contract"></view>
      <view class="bg-layer-color"> </view>
      <view class="content">
        <view class="title">
          <u--image
            width="40rpx"
            height="40rpx"
            src="/static/images/my/icon_contract.png"
          />
          <text class="text">合同中心</text>
        </view>
        <text class="info-text">买卖交易签署合同，安全有保障！</text>
      </view>

      <view class="btn" @click="navigateTo('contract')">
        <text class="text">查看</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { toLogin, checkIsLogin } from "@/utils/login";
import Events, { report } from "@/utils/report/report";

const userStore = useUserStore();

const navigateTo = (type: string) => {
  console.log("userStore.userInfo", userStore.userInfo);

  if (!checkIsLogin()) {
    toLogin();
    return;
  }

  if (type === "collect") {
    report(Events.MY_COLLECT);
    uni.navigateTo({
      url: "/pages/my/collection-center/index",
    });
  } else if (type === "contract") {
    report(Events.MY_CONTRACT);
    uni.navigateTo({
      url: "/pages/my/contract-center/index",
    });
  } else if (type === "history") {
    report(Events.MY_FOOTMARK);
    uni.navigateTo({
      url: "/pages/my/collection-center/browsing-history",
    });
  } else if (type === "consultation") {
    report(Events.MY_CONSULTATION_RECORD);
    uni.navigateTo({
      url: "/pages/my/collection-center/consultation-records",
    });
  }
};
</script>

<style lang="scss" scoped>
.account-contract {
  .card-box {
    @include flex;
    align-items: center;
    justify-content: space-around;

    .card-item {
      @include flex(column);
      align-items: center;
      justify-content: center;
      .number {
        font-family: Barlow-SemiBold;
        font-weight: 600;
        font-size: 32rpx;
        color: #1a1a1a;
      }
      .title {
        margin-top: 16rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }
  .contract {
    position: relative;
    height: 150rpx;
    margin-top: 24rpx;
    // border: 2rpx solid blue;
    .bg-contract {
      height: 134rpx;
      background: linear-gradient(to right, #63fbf2, #0dd9e5);
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      border: 2rpx solid #ffffff;
    }

    .bg-layer-color {
      width: 450rpx;
      height: 130rpx;
      background: rgba(215, 255, 253, 0.8);
      opacity: 0.4;
      margin-left: 30rpx;
      position: absolute;
      top: 12rpx;
      border-radius: 20rpx 40rpx 20rpx 20rpx;
    }

    .btn {
      width: 158rpx;
      height: 54rpx;
      @include flex;
      align-items: center;
      justify-content: center;
      background: rgba(240, 255, 254, 0.8);
      border-radius: 108rpx 108rpx 108rpx 108rpx;
      border: 2rpx solid rgba(255, 255, 255, 0.6);
      position: absolute;
      right: 24rpx;
      top: 40rpx;
      .text {
        font-weight: 500;
        font-size: 28rpx;
        color: #007980;
      }
    }
    .content {
      width: 480rpx;
      height: 122rpx;
      background: rgba(240, 255, 254, 0.8);
      border: 2rpx solid rgba(255, 255, 255, 0.6);
      @include flex(column);
      // justify-content: center;
      padding: 20rpx 24rpx;
      border-radius: 20rpx 40rpx 20rpx 20rpx;
      position: absolute;
      top: 24rpx;
      margin-left: 16rpx;

      .title {
        @include flex;
        align-items: center;
        margin-right: 8rpx;
        .text {
          font-weight: 600;
          font-size: 28rpx;
          color: #007980;
          position: relative;
          top: 2rpx;
        }
      }
      .info-text {
        font-weight: 400;
        font-size: 24rpx;
        color: #4d878a;
      }
    }
  }
}
</style>
