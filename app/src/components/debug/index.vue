<template>
  <view v-if="commonStore.openDebugger">
    <view class="debug-box">
      <u-button
        type="primary"
        text="console"
        style="opacity: 0.8"
        @click="open"
      ></u-button>
      <debuggerBox v-if="debugData.show" @close="close" />
    </view>
  </view>

  <!-- <Movable
    v-if="commonStore.openDebugger"
    ref="movableRef"
    :movable-data="movableData"
    :width="200"
    :height="80"
  >
    <u-button
      type="primary"
      text="console"
      style="opacity: 0.8"
      @click="open"
    ></u-button>
  </Movable>
  <debuggerBox v-if="debugData.show" @close="close" /> -->
</template>

<script setup>
// import { reactive, ref, onMounted } from "vue";
import { useCommonStore } from "@/stores/common";
import debuggerBox from "@/uni_modules/imengyu-IMDebuggerWindow/pages/components/debuggerBox.vue";
// import Movable from "@/components/movable/movable.vue";

import { DebugUtil } from "@/utils/debug";
const commonStore = useCommonStore();
const { debugData, open, close } = DebugUtil();
// const movableRef = ref();
// const system = uni.getSystemInfoSync();

// const movableData = reactive({
//   x: system.screenWidth,
//   y: system.screenHeight,
//   mx: system.screenWidth,
//   my: system.screenHeight,
//   animation: true,
// });
</script>

<style lang="scss" scoped>
.debug-box {
  position: fixed;
  right: 0;
  bottom: 400rpx;
  z-index: 9999999;
}
</style>
