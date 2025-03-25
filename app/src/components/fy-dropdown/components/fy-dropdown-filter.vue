<style lang="scss" scoped>
.fy-dropdown-section {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  .section-inp {
    flex: 1;
    border-radius: 4rpx;
    padding: 10rpx 50rpx;
    background-color: #f4f5f6;
  }
  .line {
    width: 18rpx;
    height: 2rpx;
    background-color: #000000;
    margin: 0 24rpx;
  }
}
.fy-dropdown-button-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 50rpx;
}
.fy-dropdown-button-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: $app-max-btn-height;
  background-color: #fff;
  border-radius: $app-box-radius;
  &.reset {
    border: 2rpx solid #1a1a1a;
    margin-right: 22rpx;
  }
  .fy-dropdown-button-text {
    font-weight: 500;
    font-size: 32rpx;
    color: #1a1a1a;
  }
  &.confirm {
    flex: 1;
    background-color: $app-main-color;
    border: 2rpx solid $app-main-color;
    .fy-dropdown-button-text {
      color: #fff;
    }
  }
}
</style>

<script setup lang="ts">
import { ref, watch } from "vue";
const props = defineProps({
  value: {
    type: Object,
    default: {},
  },
});
const priceStart = ref(props.value?.priceStart);
const priceEnd = ref(props.value?.priceEnd);
const emit = defineEmits(["success"]);
function handlerConfirm() {
  if (
    priceStart.value &&
    priceEnd.value &&
    priceStart.value - 0 >= priceEnd.value - 0
  ) {
    uni.$main.toast("最低价格不能大于或等于最高价格");
    return;
  }
  if (!priceStart.value && !priceEnd.value) {
    emit("success", {
      confirm: true,
      type: "priceFilter",
      value: {},
    });
    return;
  }
  emit("success", {
    confirm: true,
    type: "priceFilter",
    value: { priceStart: priceStart.value, priceEnd: priceEnd.value },
  });
}
function handlerCancel() {
  priceStart.value = "";
  priceEnd.value = "";
}
watch(
  () => props.value,
  (value) => {
    priceStart.value = value?.priceStart;
    priceEnd.value = value?.priceEnd;
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <view style="padding: 24rpx">
    <view class="fy-dropdown-floor_ul fy-dropdown-section">
      <view class="section-inp">
        <u--input
          v-model="priceStart"
          type="digit"
          placeholder="自定义最低价格"
          border="none"
          inputAlign="center"
          clearable
          font-size="24rpx"
        />
      </view>
      <text class="line"></text>
      <view class="section-inp">
        <u--input
          v-model="priceEnd"
          type="digit"
          inputAlign="center"
          placeholder="自定义最高价格"
          border="none"
          clearable
          font-size="24rpx"
        />
      </view>
    </view>
    <view class="fy-dropdown-button-list">
      <view
        class="fy-dropdown-button-item reset"
        @tap.stop.prevent="handlerCancel"
      >
        <text class="fy-dropdown-button-text">重置</text>
      </view>
      <view
        class="fy-dropdown-button-item confirm"
        @tap.stop.prevent="handlerConfirm"
      >
        <text class="fy-dropdown-button-text">确认</text>
      </view>
    </view>
  </view>
</template>
