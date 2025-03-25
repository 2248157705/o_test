<template>
  <view class="compensation">
    <view class="msg-box">
      <view class="bg"></view>
      <view class="msg">
        <view class="top">
          <view class="line"></view>
          <view class="text">官方验号</view>
        </view>
        <view class="text-tips">该报告由官方验号后出具，请放心购买</view>
      </view>
      <image class="icon" src="/static/images/sell/icon_yanhao.png" />
    </view>
    <view class="compensation-item">
      <template v-for="(item, index) in items" :key="index">
        <view class="cover" @click="previewImages(index)">
          <image mode="aspectFill" class="image" :src="item" />
        </view>
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const previewImages = (index) => {
  uni.previewImage({
    urls: props.items,
    current: index,
  });
};
</script>
<style lang="scss" scoped>
.compensation {
  background-color: #fff;
  border: 2rpx solid #fff1dc;
  margin-bottom: 16rpx;
  border-radius: $app-image-radius;
  .msg-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding-left: 24rpx;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 54rpx;
      background: linear-gradient(to bottom, #fffbeb, #fff);
      z-index: 1;
    }
    .msg {
      z-index: 2;
      .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 16rpx;
        .line {
          width: 8rpx;
          height: 36rpx;
          background: #ffb422;
          border-radius: 36rpx 36rpx 36rpx 36rpx;
          margin-right: 8rpx;
        }
        .text {
          font-weight: 600;
          font-size: 32rpx;
          color: #361401;
        }
      }
      .text-tips {
        font-weight: 400;
        font-size: 24rpx;
        color: #6a4c3b;
      }
    }
    .icon {
      width: 216rpx;
      height: 160rpx;
      z-index: 2;
    }
  }
  .compensation-item {
    padding: 24rpx;
    padding-top: 0;
    margin-bottom: 24rpx;
    .title-item {
      font-weight: bold;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 24rpx;
      display: block;
    }
    .cover {
      flex: 1;
      display: flex;
      align-items: center;
      margin-bottom: 16rpx;
      .image {
        flex: 1;
        border-radius: $app-image-radius;
        border: 4rpx solid #ffd37e;
      }
    }
  }
}
.show-more {
  @include flex(row);
  justify-content: center;
  align-items: center;
  margin-top: 24rpx;

  .text {
    font-weight: 400;
    font-size: 24rpx;
    color: #1a1a1a;
  }
}
</style>
