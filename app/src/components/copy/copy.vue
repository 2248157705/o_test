<template>
  <u-copy :content="content">
    <view class="copy">
      <text class="text" :style="textStyle">{{ text || content }}</text>
      <u--image
        class="img"
        src="/static/images/common/icon_copy.png"
        width="32rpx"
        height="32rpx"
      />
    </view>
  </u-copy>
</template>

<script setup lang="ts">
defineProps({
  content: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  btnText: {
    type: String,
    default: "复制",
  },
  textStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<style lang="scss" scoped>
.copy {
  @include flex(row);
  align-items: center;
  .text {
    margin-right: 10rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
  }
  .btn-text {
    font-weight: 400;
    font-size: 28rpx;
    color: $app-main-color;
  }
}
</style>
