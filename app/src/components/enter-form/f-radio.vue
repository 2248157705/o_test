<template>
  <view>
    <view :class="`sunui-group ${className} ${type}`">
      <view
        v-for="(item, index) in checkbox"
        :key="index"
        @tap="handleChange(item)"
        class="sunui-label"
        :class="{
          active: item.checked,
          end: (index + 1) % gap == 0,
        }"
      >
        <text
          class="text"
          :class="{
            active: item.checked,
          }"
          >{{ item.name }}</text
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { isArray } from "lodash-es";
const checkbox = ref([]);
const props = defineProps({
  gap: {
    type: Number,
    default: () => 3,
  },
  disable: {
    type: Boolean,
    default: () => false,
  },
  className: {
    type: String,
    default: () => "",
  },
  type: {
    type: String,
    default: () => "radio",
  },
  list: {
    type: Array,
    default: () => [],
  },
  label: {
    type: String,
    default: () => "name",
  },
  value: {
    type: [String, Number],
    default: () => "id",
  },
  modelValue: {
    type: [Number, String, Array],
    required: false,
    default: () => null,
  },
});

const handleInit = () => {
  const model = props.list.map((element) => {
    const modelValue = props.modelValue;
    const bool = isArray(modelValue);
    return {
      checked: bool
        ? modelValue?.includes(element.value)
        : modelValue == element.value,
      value: element.value,
      name: element.label,
    };
  });
  checkbox.value = model;
};

watch(
  () => props.list,
  (val) => {
    if (val && val[0]) {
      handleInit();
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      handleInit();
    }
  },
  { deep: true, immediate: true }
);
const height = computed(() => {
  return checkbox.value.length * 48 + "rpx";
});
const emits = defineEmits(["handleChange"]);

const handleChange = (e) => {
  if (props.disable) return;
  if (props.type == "radio") {
    checkbox.value.forEach((item) => {
      // fy模式下 可以去除选中
      // if (props.className == "fy") {
      //   if (item.value == e.value) {
      //     item.checked = !item.checked;
      //   } else {
      //     item.checked = item.value == e.value;
      //   }
      // } else {
      //   item.checked = item.value == e.value;
      // }
      if (item.value == e.value) {
        item.checked = !item.checked;
      } else {
        item.checked = item.value == e.value;
      }
    });
  }
  if (props.type == "checkbox") {
    checkbox.value.forEach((item) => {
      if (item.value == e.value) {
        item.checked = !item.checked;
      }
    });
  }

  emits(
    "handleChange",
    checkbox.value
      .filter((item) => item.checked)
      .map((item) => {
        return item.value;
      })
  );
  // this.$forceUpdate();
};
</script>

<style lang="scss">
.mar5 {
  margin: 5rpx;
}

.sunui-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* #ifndef APP-NVUE */
  max-height: 330rpx;
  /* #endif */
  overflow: hidden;
  /* #ifndef APP-NVUE */
  overflow: auto;
  /* #endif */

  &.radio {
    .sunui-label {
      width: 120rpx;
      &.active {
        width: 116rpx;
      }
    }
  }
  &.fy,
  &.popup {
    /* #ifndef APP-NVUE */
    max-height: max-content;
    /* #endif */
    .sunui-label {
      width: 212rpx;
      height: $app-small-btn-height;
      border-radius: $app-box-radius;
      margin: 0;
      margin-right: 24rpx;
      margin-bottom: 24rpx;
      padding: 0;
      border: 2rpx solid #f4f5f6;
      &.active {
        width: 212rpx;
        border-color: $app-main-color;
      }
      .text {
        &.active {
          color: $app-main-color;
        }
      }
      &.end {
        margin-right: 0;
      }
    }
  }
  &.fy {
    .sunui-label {
      width: 215rpx !important;
    }
  }
  &.tree {
    .sunui-label {
      .text {
        font-size: 28rpx;
      }
    }
  }
  .sunui-label {
    padding: 12rpx 24rpx;
    width: 106rpx;
    background: #f4f5f6;
    border-radius: $app-box-radius;
    display: flex;
    flex-flow: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 16rpx;
    border: 2rpx solid #f4f5f6;
    &.active {
      border-color: $app-main-color;
      background: #f0fffe;
    }
    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #606060;
      &.active {
        color: $app-main-color;
      }
    }
  }
  &.active {
    /* #ifndef APP-NVUE */
    overflow: auto;
    max-height: unset;
    /* #endif */
  }
}
</style>
