<template>
  <view class="tab-subsection-wrapper">
    <view v-for="(item, index) in tabsList" :key="index" :style="tabStyle">
      <text>{{ item.name }}</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  width: {
    type: [Number, String],
    default: 212,
  },
  spacing: {
    type: [Number, String],
    default: 20,
  },
});
const tabStyle = reactive({});
const tabsList = ref([
  { name: "账号详情", value: 1 },
  { name: "包赔介绍", value: 2 },
  { name: "交易群", value: 3 },
]);

// const tabsChange = (e) => {
//   tabsValue.value = e.value;
// };
</script>

<style lang="scss" scoped>
.tab-subsection-wrapper {
  @include flex;
  flex: 1;
  background-color: #f4f5f6;
  border-radius: 4rpx 4rpx 4rpx 4rpx;
}
</style>
