<template>
  <!-- 开发环境生效 -->
  <u-gap bgColor="#F7F9FA" height="6" />
  <u-cell-group class="cell-group-wrapper" :border="false">
    <u-cell title="开发环境" :border="true">
      <template #value>
        <text class="right-text">测试环境</text>
      </template>
    </u-cell>
    <u-cell title="开发组件" :border="true">
      <template #value>
        <text class="right-text" @click="navigatorTo">跳转页面</text>
      </template>
    </u-cell>
    <u-cell title="debug" :border="false">
      <template #value>
        <u-switch
          v-model="commonStore.openDebugger"
          space="2"
          activeColor="#34C792"
          inactiveColor="rgb(230, 230, 230)"
          @change="toggleDebugger"
        >
        </u-switch>
      </template>
    </u-cell>
  </u-cell-group>
</template>

<script setup lang="ts">
import { useCommonStore } from "@/stores/common";
const commonStore = useCommonStore();

const toggleDebugger = (val) => {
  commonStore.toggleDebugger(val);
};
const navigatorTo = () => {
  uni.navigateTo({
    url: "/components/test-component/index",
  });
};
</script>
