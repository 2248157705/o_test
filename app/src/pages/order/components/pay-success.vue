<template>
  <view class="success-view">
    <view class="view">
      <u--image
        width="240rpx"
        height="240rpx"
        src="/static/images/sell/icon_success.png"
      />
      <text class="msg">支付成功</text>
      <text class="intro">点击下方按钮进入群聊，等待卖家进行交易</text>
      <view class="success-box">
        <view class="btn full" @click="handleIM"
          ><text class="text">进入群聊</text></view
        >
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
const handleIM = () => {
  //
};
</script>
<style lang="scss" scoped>
@import "@/pages/sell-account/sell-information-enter/index.scss";
</style>
