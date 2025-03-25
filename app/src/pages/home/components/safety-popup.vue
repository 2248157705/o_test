<template>
  <popup
    ref="popupRef"
    :show="visible"
    :closeable="false"
    :popupStyle="popupStyle"
    title=""
    @close="close"
  >
    <view class="safety-content">
      <image class="bg" src="/static/images/home/icon-ax-bg.png" />
      <image
        class="close"
        src="/static/images/home/icon-ax-close.png"
        @tap="close"
      />
      <view class="ax-title">
        <image class="title" src="/static/images/home/icon-ax-title.png" />
      </view>
      <view class="ax-content">
        <image
          class="ax-content-text"
          src="/static/images/home/icon-ax-text.png"
        />
        <view class="ax-item">
          <image class="icon" src="/static/images/home/icon-ax-gou.png" />
          <view class="text-content">
            <text class="top">官方验号</text>
            <text class="line"
              >专属官方验号，保证账号真实性，杜绝虚假商品！</text
            >
          </view>
        </view>

        <view class="ax-item">
          <image class="icon" src="/static/images/home/icon-ax-gou.png" />
          <view class="text-content">
            <text class="top">卖家实名认证</text>
            <text class="line"
              >平台所售商品的卖家均已进行实名认证，安全有保障。</text
            >
          </view>
        </view>

        <view class="ax-item">
          <image class="icon" src="/static/images/home/icon-ax-gou.png" />
          <view class="text-content">
            <text class="top">电子合同</text>
            <text class="line"
              >交易均签署含有法律效用的电子合同，保障您的合法权益。</text
            >
          </view>
        </view>

        <view class="ax-item">
          <image class="icon" src="/static/images/home/icon-ax-gou.png" />
          <view class="text-content">
            <text class="top">找回包赔</text>
            <text class="line"
              >所有购买游戏账号商品，可选择账号包赔保障服务，发生找回时，会根据条例进行理赔，免去买家后顾之忧。</text
            >
          </view>
        </view>
      </view>
    </view>
  </popup>
</template>
<script setup>
import { ref, watch } from "vue";
import Popup from "@/components/popup/index.vue";
const popupStyle = ref({
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  padding: "0", // 修改内边距
  boxSizing: "border-box", // 修改内边距
});
const popupRef = ref(null);
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const visible = ref(props.show);
const emit = defineEmits(["close"]);

const close = () => {
  visible.value = false;
  emit("close");
};
watch(
  () => props.show,
  (val, oldVal) => {
    if (val != oldVal) {
      visible.value = val;
    }
  },
  {
    deep: false,
  }
);
</script>
<style lang="scss" scoped>
.safety-content {
  height: 1120rpx;
  position: relative;
  padding: 0 32rpx;
  .bg {
    flex: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    position: absolute;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
  }
  .close {
    position: absolute;
    right: 32rpx;
    top: 40rpx;
    width: 48rpx;
    height: 48rpx;
  }
  .ax-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    margin-bottom: 24rpx;
    .title {
      width: 152rpx;
      height: 48rpx;
    }
  }
  .ax-content {
    display: flex;
    flex: 1;
    height: 800rpx;
    background-color: #fff;
    margin-bottom: 32rpx;
    border-radius: 12rpx;
    padding: 32rpx;
    .ax-content-text {
      display: flex;
      height: 118rpx;
      margin-bottom: 40rpx;
    }
    .ax-item {
      display: flex;
      flex-direction: row;
      flex: 1;
      .icon {
        width: 40rpx;
        height: 40rpx;
        margin-right: 16rpx;
      }
      .text-content {
        flex: 1;
        .top {
          font-weight: 600;
          font-size: 32rpx;
          color: #1a1a1a;
          margin-bottom: 16rpx;
        }
        .line {
          font-weight: 400;
          font-size: 28rpx;
          color: #606060;
          line-height: 44rpx;
        }
      }
    }
  }
}
</style>
