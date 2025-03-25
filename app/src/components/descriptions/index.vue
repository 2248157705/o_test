<template>
  <view class="descriptions">
    <view class="title">商品信息</view>
    <view class="box">
      <view class="item">
        <view class="label">游戏帐号</view>
        <view class="value">xxxx11111</view>
      </view>
      <view class="item">
        <view class="label">游戏帐号</view>
        <view class="value">xxxx11111</view>
      </view>
      <view class="item">
        <view class="label">游戏帐号</view>
        <view class="value">xxxx11111</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.descriptions {
  .title {
    padding: 20rpx 0;
    font-size: 30rpx;
    font-weight: bold;
  }
  .box {
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .label {
        font-size: 24rpx;
      }
      .value {
        font-size: 24rpx;
      }
    }
  }
}
</style>
