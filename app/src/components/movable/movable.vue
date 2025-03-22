<template>
  <movable-area
    class="movable-area"
    :style="{
      width: system.screenWidth + 'px',
      height: system.screenHeight + 'px',
    }"
  >
    <movable-view
      class="movable-view"
      :style="{ width: width + 'rpx', height: height + 'rpx' }"
      :x="movableStat.x"
      :y="movableStat.y"
      :inertia="true"
      :animation="movableStat.animation"
      direction="all"
      @change="onChange"
      @touchend="onTouchend"
    >
      <slot></slot>
    </movable-view>
  </movable-area>
</template>
<script setup>
import { reactive } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
  movableData: {
    type: Object,
    default() {
      return {
        x: 0,
        y: 0,
        mx: 0,
        my: 0,
        animation: true,
      };
    },
  },
});

const system = uni.getSystemInfoSync();
const movableStat = reactive(uni.$u.deepClone(props.movableData));

let timer = null;

const onChange = (e) => {
  if (e.detail.source === "touch") {
    movableStat.mx = e.detail.x;
    movableStat.my = e.detail.y;
  }
};

const onTouchend = () => {
  const system = uni.getSystemInfoSync();
  let x = 0;
  let y = 0;
  if (movableStat.mx + 40 < system.screenWidth / 2) {
    y = movableStat.my;
    x = 0;
  } else {
    y = movableStat.my;
    x = system.screenWidth;
  }

  movableStat.y = movableStat.my;
  movableStat.x = movableStat.mx;

  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    movableStat.y = y;
    movableStat.x = x;
    timer = null;
  }, 50);
};

defineExpose({});
</script>
<style lang="scss" scoped>
.movable-area {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  pointer-events: none;

  .movable-view {
    // pointer-events: auto;
  }
}
</style>
