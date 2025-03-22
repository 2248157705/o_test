<template>
  <view class="form-box">
    <view class="form-items">
      <text class="form-label">买家须知</text>
      <view class="form-content">
        <view class="row" @click.stop="toTradingRules">
          <view class="list">
            <text class="name">提交订单即表示同意&nbsp;</text>
            <text class="text">买卖交易规则</text>
          </view>
          <u--image
            width="32rpx"
            height="32rpx"
            src="/static/images/common/icon_right.png"
          />
        </view>

        <view class="row" @click.stop="toUserAgreement">
          <view class="list">
            <text class="text">用户服务协议及规则</text>
          </view>
          <u--image
            width="32rpx"
            height="32rpx"
            src="/static/images/common/icon_right.png"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { toUserAgreement, toTradingRules } from "@/utils/index";
defineExpose({});
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
