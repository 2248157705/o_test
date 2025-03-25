<template>
  <view class="btn-box" @click="emits('click')">
    <view style="display: flex; align-items: center">
      <u--text color="#1CC7BE" size="32rpx" bold="500" :text="text"></u--text>
      <image
        style="margin-left: 20rpx; width: 32rpx; height: 32rpx"
        class="next"
        src="@/static/images/im/list/17.png"
      ></image>
    </view>
    <view style="display: flex; align-items: center">
      <slot />
      <u-icon name="arrow-right" size="28rpx" bold color="#1CC7BE"></u-icon>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: "查看详情",
  },
});
const emits = defineEmits(["click"]);
</script>
