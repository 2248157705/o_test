<template>
  <view class="my-empty-wrapper">
    <image class="image" :src="image" />
    <text class="text">{{ tip }}</text>
  </view>
</template>

<script setup>
defineProps({
  tip: {
    type: String,
    default: "暂无数据",
  },
  image: {
    type: String,
    default: "/static/images/empty/icon_message.png",
  },
});
</script>

<style lang="scss" scoped>
.my-empty-wrapper {
  @include flex(column);
  align-items: center;
  justify-content: center;

  .text {
    font-size: 28rpx;
    color: #606060;
  }
  .image {
    width: 520rpx;
    height: 350rpx;
  }
}
</style>
