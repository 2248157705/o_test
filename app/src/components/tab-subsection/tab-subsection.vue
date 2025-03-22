<template>
  <view>
    <u-tabs :list="tabsList" lineColor="#1CC7BE" @change="tabsChange"></u-tabs>
  </view>
</template>

<script setup>
import { ref } from "vue";
const tabsList = ref([
  { name: "账号详情", value: 1 },
  { name: "包赔介绍", value: 2 },
  { name: "交易群", value: 3 },
]);
const current = ref(0);
const tabsChange = (e) => {
  current.value = e.value;
};
</script>

<style lang="scss" scoped>
:deep(.u-tabs__wrapper__nav__item) {
  flex: 1;
}
:deep(.u-tabs__wrapper__nav) {
  background-color: #ffffff;
}
</style>
