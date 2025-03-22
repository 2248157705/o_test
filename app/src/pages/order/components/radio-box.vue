<template>
  <view class="radio-box">
    <template v-for="(item, index) in options" :key="index">
      <view
        :class="{
          item: true,
          selected: isSelected(index),
          disabled: item.disabled,
        }"
        @click="handleSelected(index, item.value, item.disabled)"
      >
        <text
          class="text"
          :style="{
            color: isSelected(index) ? '#1CC7BE' : '#1a1a1a',
          }"
          >{{ item.name }}</text
        >
      </view>
    </template>
  </view>
</template>
<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const emit = defineEmits(["change"]);

const selectedData = reactive({
  current: 0,
});

watch(
  () => props.options,
  (values) => {
    if (values.length > 0) {
      // selectedData.current = values.findIndex((el) => el.disabled === false);
      emit("change", values[selectedData.current].value, selectedData.current);
    } else {
      emit("change", null, null);
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const isSelected = (index) => {
  return selectedData.current === index;
};

const handleSelected = (index, value, disabled) => {
  if (!disabled) {
    selectedData.current = index;
    emit("change", value, index);
  }
};
</script>
<style lang="scss" scoped>
.radio-box {
  @include flex(row);
  flex-wrap: wrap;

  .item {
    position: relative;
    padding: 0 20rpx;
    margin: 0 24rpx 24rpx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f5f6;
    height: 66rpx;
    line-height: 66rpx;
    border-radius: 4px;
    border: 2rpx solid #f4f5f6;
    border-radius: 12rpx;

    .text {
      font-size: 28rpx;
      font-weight: 400;
      color: #606060;
    }

    &.disabled {
      background: #c7c7c7;
      border-width: 0rpx;

      .text {
        color: #ffffff;
      }
    }

    &.selected {
      background: #f0fffe;
      border: 2rpx solid #1cc7be;
    }
  }
}
</style>
