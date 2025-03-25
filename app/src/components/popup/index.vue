<template>
  <u-popup
    v-model:show="visible"
    :custom-style="props.popupStyle"
    :mode="props.mode"
    :closeable="closeable"
    :closeOnClickOverlay="closeOnClickOverlay"
    :overlay="overlay"
    :duration="duration"
    :zIndex="zIndex"
    @close="onClosePopup"
  >
    <view class="popup-content">
      <view v-if="props.title" class="title" :style="props.titleBoxStyle">
        <text class="text">{{ props.title }}</text>
      </view>
      <slot></slot>
    </view>
  </u-popup>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  titleBoxStyle: {
    type: Object,
    default: () => ({
      backgroundColor: "#fff", // 修改背景色
    }),
  },
  mode: {
    type: String,
    default: "bottom",
  },
  overlay: {
    type: Boolean,
    default: true,
  },
  closeable: {
    type: Boolean,
    default: true,
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: true,
  },
  duration: {
    type: Number,
    default: 300,
  },
  zIndex: {
    type: Number,
    default: 10075,
  },

  popupStyle: {
    type: Object,
    default: () => ({
      backgroundColor: "#fff", // 修改背景色
      borderTopLeftRadius: "24rpx", // 修改圆角
      borderTopRightRadius: "24rpx", // 修改圆角
      padding: "24rpx", // 修改内边距
      boxSizing: "border-box", // 修改内边距
    }),
  },
  operation: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(props.show);

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
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

const onClosePopup = () => {
  // 在此处可以添加关闭 Popup 时的逻辑
  uni.log.info("Popup 被关闭了");
  emit("close");
  props.operation && close();
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
/* 可以在这里添加自定义的样式 */
.popup-content {
  @include flex(column);
  .title {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    .text {
      font-weight: 500;
      font-size: 36rpx;
      color: #1a1a1a;
    }
  }
}
</style>
