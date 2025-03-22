<template>
  <u-transition :show="show">
    <!-- <view style="position: absolute;top: 0;z-index: 999999999;"> -->
    <div class="card-wrapper">
      <u--image
        class="image"
        width="120rpx"
        height="90rpx"
        radius="6rpx"
        :src="info.product_covert"
        mode="aspectFit"
      />
      <view class="info">
        <u-text
          bold
          color="#1A1A1A"
          size="28rpx"
          :lines="1"
          style="width: 382rpx"
          :text="info.product_title"
        ></u-text>
        <view class="bottom">
          <u-text
            bold
            color="#1A1A1A"
            size="28rpx"
            mode="price"
            :text="+(info.product_price || 0)"
          ></u-text>
          <view class="btn" @click="send">
            <text class="text">发送链接</text>
          </view>
        </view>
      </view>
      <view class="close" @click="close">
        <image class="image" src="@/static/images/im/close.png" />
      </view>
    </div>
    <!-- </view> -->
  </u-transition>
</template>

<script lang="ts" setup>
defineProps({
  info: {
    type: Object,
    default: () => {},
  },
  show: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["send", "update:show"]);
const close = () => {
  emit("update:show", false);
};
const send = () => {
  emit("send");
};
</script>
<style lang="scss" scoped>
.card-wrapper {
  @include flex;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0rpx 0rpx 8rpx #f5f5f5;
  border-radius: 4rpx;
  height: 138rpx;
  margin: 10rpx 10rpx 20rpx 10rpx;
  padding: 0 20rpx;
  position: relative;
  position: absolute;
  top: -160rpx;
  z-index: 9;
  width: 684rpx;

  .info {
    margin-left: 14rpx;
    flex: 1;
    @include flex(column);
    .bottom {
      @include flex;
      align-items: right;
      justify-content: center;

      .btn {
        width: 152rpx;
        height: 48rpx;
        @include flex;
        align-items: center;
        justify-content: center;
        background: $app-main-color;
        border-radius: 4rpx;
        .text {
          font-weight: 500;
          font-size: 22rpx;
          color: #ffffff;
        }
      }
    }
  }
  .close {
    position: absolute;
    right: 10rpx;
    top: 10rpx;
    height: 40rpx;
    width: 60rpx;
    @include flex;
    justify-content: flex-end;
    align-items: right;
    .image {
      width: 40rpx;
      height: 40rpx;
    }
  }
}
</style>
