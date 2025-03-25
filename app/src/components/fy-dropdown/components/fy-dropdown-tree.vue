<style lang="scss" scoped>
.tree-box {
  height: 440rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 24rpx;
  .tree-list {
    width: 254rpx;
    background-color: #f4f5f6;
    .tree-list-item {
      width: 254rpx;
      height: 86rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .line {
        position: absolute;
        width: 8rpx;
        height: 56rpx;
        background-color: $app-main-color;
        left: 0;
        top: 20rpx;
        opacity: 0;
        &.active {
          opacity: 1;
        }
      }
      .text {
        color: #1a1a1a;
        font-size: 32rpx;
        &.active {
          color: $app-main-color;
        }
      }
      &.active {
        background-color: #fff;
      }
    }
  }
  .tree-content {
    flex: 1;
    background-color: #fff;
    padding-left: 24rpx;
    .tree-content-box {
      height: 385rpx;
    }
  }
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";
import FRadio from "@/components/enter-form/f-radio.vue";
import { cloneDeep } from "lodash-es";
const props = defineProps({
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const selectOption = ref(cloneDeep(props.options[0]));

const selectOptions = computed(() => {
  return selectOption.value.options.map((o) => {
    o.value = o.value + "/" + selectOption.value.name;
    return o;
  });
});

const emit = defineEmits(["success"]);
const checked = ref(
  cloneDeep(props.options).map((o) => {
    return o.value + "/" + o.name;
  })
);
const handleCheckboxChange = (value) => {
  console.log(value);
  emit("success", {
    confirm: true,
    type: "filter",
    value: {
      [selectOption.value.name]: value.toString().split("/")[0],
    },
  });
};
</script>

<template>
  <view class="tree-box">
    <scroll-view scroll-y class="tree-list" :show-scrollbar="false">
      <template v-for="(item, index) in options" :key="index">
        <view
          class="tree-list-item"
          :class="{
            active: selectOption.label == item.label,
          }"
          @tap="selectOption = cloneDeep(item)"
        >
          <view
            :class="{
              active: selectOption.label == item.label,
            }"
            class="line"
          ></view>
          <text
            :class="{
              active: selectOption.label == item.label,
            }"
            class="text"
            >{{ item.label }}</text
          >
        </view>
      </template>
    </scroll-view>
    <view class="tree-content">
      <scroll-view class="tree-content-box" scroll-y :show-scrollbar="false">
        <f-radio
          :gap="2"
          className="fy tree"
          :type="selectOption.type"
          :list="selectOptions"
          :modelValue="checked"
          @handle-change="handleCheckboxChange"
        />
      </scroll-view>
    </view>
  </view>
</template>
