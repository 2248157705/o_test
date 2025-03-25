<template>
  <u-overlay :zIndex="zIndex" :show="visible" @click="close">
    <view class="popup-box">
      <view class="popup-content-view" :style="popupStyle" @tap.stop>
        <slot name="bgView"></slot>
        <view v-if="title" class="title">
          <text class="text">{{ title }}</text>
        </view>
        <slot>
          <view class="content">
            <text class="text" :style="textStyle">{{ text }}</text>
          </view>
        </slot>
        <view v-if="showCancelButton || showConfirmButton" class="btn">
          <my-button
            v-if="showCancelButton"
            class="cancel"
            height="78"
            radius="6"
            :text="cancelText"
            type="info"
            @tap="close"
          />
          <my-button
            v-if="showConfirmButton"
            class="confirm"
            height="78"
            radius="8"
            :text="confirmText"
            type="primary"
            color="#ffffff"
            :style="showCancelButton ? 'margin-left: 15rpx' : ''"
            :disabled="confirmDisabled"
            @tap="onConfirm"
          />
        </view>
      </view>
      <view v-if="closeOnClickOverlay" class="close-btn" @tap="close">
        <u--image
          width="48rpx"
          height="48rpx"
          src="/static/images/common/icon_close.png"
        />
      </view>
    </view>
  </u-overlay>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  zIndex: {
    type: String,
    default: "99999",
  },
  title: {
    type: String,
    default: "",
  },
  show: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: "bottom",
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
  confirmText: {
    type: String,
    default: "确认",
  },
  cancelText: {
    type: String,
    default: "取消",
  },
  showConfirmButton: {
    type: Boolean,
    default: false,
  },
  showCancelButton: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: "",
  },
  textStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  confirmClose: {
    type: Boolean,
    default: true,
  },
  confirmDisabled: {
    type: Boolean,
    default: false,
  },
  popupStyle: {
    type: Object,
    default: () => {},
  },
});
const visible = ref(props.show);

const open = () => {
  visible.value = true;
};
const emit = defineEmits(["confirm", "close"]);

const close = () => {
  emit("close");
  visible.value = false;
};
const onConfirm = () => {
  emit("confirm");
  if (props.confirmClose) {
    close();
  }
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
defineExpose({
  open,
  close,
});
</script>

<style scoped lang="scss">
.popup-box {
  flex: 1;
  height: 100%;
  @include flex(column);
  align-items: center;
  justify-content: center;
  .popup-content-view {
    position: relative;
    width: 606rpx;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 16rpx;
    @include flex(column);
    margin-bottom: 40rpx;
    /* #ifndef APP-NVUE */
    box-sizing: border-box;
    max-height: max-content;
    /* #endif */
    .title {
      // flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 542rpx;
      // border: 1rpx solid;
      height: 62rpx;
      // padding: 20rpx 0;
      z-index: 2;
      .text {
        font-weight: 600;
        font-size: 36rpx;
        color: #1a1a1a;
      }
    }
    .content {
      margin-bottom: 24rpx;
      text-align: center;
      .text {
        color: #1a1a1a;
        line-height: 40rpx;
        font-size: 26rpx;
        text-align: center;
      }
    }
    .btn {
      @include flex;
      align-items: center;
      justify-content: space-between;
      .confirm {
        color: #ffffff;
      }
      .cancel {
        margin-right: 15rpx;
      }
    }
  }
}
</style>
