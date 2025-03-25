<template>
  <view class="aftersale-service-wrapper content-wrapper">
    <view class="card-box">
      <view class="step-title">
        <text class="en">STEP ONE</text>
        <text class="name">售后服务</text>
      </view>
      <view class="info">
        <view class="line">
          <view class="serial-number">
            <text class="text">01</text>
          </view>
          <text class="highlight-text"
            >找到对应订单号，描述当前问题给客服</text
          ></view
        >
        <view class="line">
          <view class="serial-number">
            <text class="text">02</text>
          </view>
          <text class="highlight-text">售后服务电话：13553646836</text></view
        >
        <view class="line">
          <view class="serial-number">
            <text class="text">02</text>
          </view>
          <text class="highlight-text">联系在线客服</text></view
        >
      </view>
    </view>

    <my-button
      class="btn"
      text="在线客服"
      open-type="customer_service"
    ></my-button>
  </view>
</template>
<style lang="scss" scoped>
@import "./common.scss";

.aftersale-service-wrapper {
  .btn {
    position: fixed;
    bottom: 60rpx;
    width: 94%;
  }
}
</style>
