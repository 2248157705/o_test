<template>
  <GlobalView :showBar="false">
    <view class="proposal-wrapper">
      <u-cell-group :border="false">
        <u-cell
          v-if="is_customer_service == 1"
          title="交易遇到问题？"
          value="立即反馈，我们用心聆听每一声建议"
          :border="false"
        >
        </u-cell>
        <u-line color="#F4F5F6"></u-line>
        <u-cell title="投诉电话" value="13553646836" :border="false"> </u-cell>
        <u-line color="#F4F5F6"></u-line>
        <u-cell title="投诉邮箱" :border="false" value="2356108625@qq.com">
        </u-cell>
      </u-cell-group>
      <my-button
        v-if="is_customer_service == 1"
        class="btn"
        text="在线投诉"
        open-type="customer_service"
      ></my-button>
    </view>
  </GlobalView>
</template>

<script setup>
import GlobalView from "@/components/global-view/index.vue";

import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";
const is_customer_service = ref(1);
onLoad((options) => {
  console.log("options?.is_customer_service", options?.is_customer_service);
  is_customer_service.value = options?.is_customer_service || 1;

  if (options?.title) {
    uni.setNavigationBarTitle({
      title: options?.title,
    });
  }
});
</script>

<style lang="scss" scoped>
:deep(.u-line) {
  border-bottom-color: #f4f5f6 !important;
}
.proposal-wrapper {
  padding: 0 20rpx 20rpx 20rpx;
  .label {
    color: #909193;
    font-size: 24rpx;
    display: block;
    margin-top: 5rpx;
  }
  .btn {
    position: fixed;
    bottom: 60rpx;
    width: 94%;
  }
}
</style>
