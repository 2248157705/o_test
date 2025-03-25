<template>
  <view class="account-category">
    <view class="category">
      <view class="title">
        <text class="text">我是买家</text>
      </view>
      <view class="operation">
        <view class="item" @click="handleOrder">
          <view class="icon">
            <u--image
              width="44rpx"
              height="44rpx"
              src="/static/images/my/icon_buy.png"
            />
          </view>
          <view class="msg">
            <text class="text">我买到的</text>
            <text class="tips text"
              >({{ userStore.userInfo?.user_order || 0 }})</text
            >
          </view>
        </view>
        <view class="item" @click="handleBargain('buyer')">
          <view class="icon">
            <u--image
              width="44rpx"
              height="44rpx"
              src="/static/images/my/icon_bargaining.png"
            />
          </view>
          <view class="msg">
            <text class="text">发出的求降价</text>
            <text class="tips text"
              >({{ userStore.userInfo?.user_buy_num || 0 }})</text
            >
          </view>
        </view>
      </view>
    </view>
    <view class="line"></view>
    <view class="category">
      <view class="title">
        <text class="text">我是卖家</text>
      </view>
      <view class="operation">
        <view class="item" @click="handlePosted">
          <view class="icon">
            <u--image
              width="44rpx"
              height="44rpx"
              src="/static/images/my/icon_my_sell.png"
            />
          </view>
          <view class="msg">
            <text class="text">我发布的</text>
            <text class="tips text"
              >({{ userStore.userInfo?.user_product || 0 }})</text
            >
          </view>
        </view>
        <view class="item" @click="handleBargain('seller')">
          <view class="icon">
            <u--image
              width="44rpx"
              height="44rpx"
              src="/static/images/my/icon_bargaining.png"
            />
          </view>
          <view class="msg">
            <text class="text">收到的求降价</text>
            <text class="tips text"
              >({{ userStore.userInfo?.user_seller_num || 0 }})</text
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const handlePosted = () => {
  uni.navigateTo({
    url: "/pages/my/posted-center/index",
  });
};
const handleOrder = () => {
  uni.navigateTo({
    url: "/pages/order/list",
  });
};
const handleBargain = (bidder: string) => {
  uni.navigateTo({
    url: `/pages/bargain/list?bidder=${bidder}`,
  });
};
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.account-category {
  width: 702rpx;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  margin-top: 24rpx;
  padding: 28rpx 24rpx;
  @include flex(column);
  .line {
    margin: 28rpx 0;
    width: 654rpx;
    height: 1rpx;
    border-bottom: 1rpx solid #f4f5f6;
  }

  .category {
    @include flex(row);
    .title {
      width: 200rpx;
      height: 144rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 40rpx;
      border-right: 1rpx solid #f4f5f6;
      .text {
        font-weight: 600;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
    .operation {
      @include flex(row);
      align-items: center;
      justify-content: space-between;
      flex: 1;
      .item {
        @include flex(column);
        flex: 1;
        align-items: center;
        .msg {
          @include flex(row);
          justify-content: center;
          align-items: center;
          margin-top: 22rpx;
          .text {
            font-weight: 400;
            font-size: 24rpx;
            color: #1a1a1a;
            &.tips {
              color: #afafaf;
            }
          }
        }
        .icon {
          width: 72rpx;
          height: 72rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fafafa;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
