<template>
  <global-view bgColor="#FFFFFF">
    <template #bar>
      <u-navbar
        bgColor="#ffffff"
        title="买号流程"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      />
    </template>

    <view class="paging-content">
      <view class="compensation">
        <view class="compensation-item">
          <image
            class="flow"
            mode="widthFix"
            src="/static/images/sell/transaction_flow.png"
          />
        </view>

        <view class="compensation-item">
          <text class="title">注意：</text>
          <text class="text">
            1.交易账号换绑期间及换绑完成后24小时内建议买卖双方不要对该账号进行任何形式的充值和消费，否则引起的-切纠纷与平台无关。
          </text>
          <text class="text"
            >2.账号如发生冻结或异常等造成不能使用的情况,代售君只能协助处理,有无法解冻的可能,由账号绑定方承担。
          </text>
        </view>
      </view>
    </view>
  </global-view>
</template>
<script lang="ts" setup>
import GlobalView from "@/components/global-view/index.vue";
</script>
<style lang="scss" scoped>
.paging-content {
  padding: 0 24rpx;
  background-color: #fff;
}
.compensation {
  .compensation-item {
    .flow {
      width: 100%;
    }
    .title-item {
      font-weight: bold;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 24rpx;
      display: block;
    }
    .title {
      font-weight: bold;
      font-size: 28rpx;
      color: #1a1a1a;
      margin-bottom: 10rpx;
      display: block;
    }
    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #1a1a1a;
      display: block;
      line-height: 44rpx;
    }
  }
}
</style>
