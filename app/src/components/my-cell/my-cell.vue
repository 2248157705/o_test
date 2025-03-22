<template>
  <view class="cell-wrapper">
    <view class="cell" :style="style">
      <slot name="icon"></slot>
      <view class="left">
        <view class="title">
          <text class="text">{{ title }}</text>
        </view>
        <text v-if="describe" class="describe">{{ describe }}</text>
      </view>
      <view class="right">
        <slot>
          <text v-if="type === 'text'" class="text">{{ value }}</text>
          <u-switch
            v-if="type === 'switch'"
            v-model="switchValue"
            space="2"
            activeColor="#34C792"
            inactiveColor="rgb(230, 230, 230)"
            @change="handleSwitch"
          >
          </u-switch>
        </slot>
        <u-icon v-if="iconShow" name="arrow-right" color="#AFAFAF"></u-icon>
      </view>
    </view>
    <u-line v-if="border" :hairline="true" color="#F4F5F6" />
    <!-- length="710rpx"
	style="margin: 0 20rpx" -->
  </view>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Boolean],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  iconShow: {
    type: Boolean,
    default: true,
  },
  height: {
    type: [String, Number],
    default: "120",
  },
  border: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "",
  },
  describe: {
    type: String,
    default: "",
  },
});

const style = reactive({
  height: `${props.height}rpx`,
});

const switchValue = ref(false);
const emit = defineEmits(["change"]);
const handleSwitch = (val: boolean) => {
  switchValue.value = val;
  emit("change", val);
};
</script>

<style lang="scss" scoped>
.cell {
  @include flex;
  align-items: center;
  // padding: 0 20rpx;
  // border: 1px solid;
  .icon {
    margin-right: 10rpx;
  }
  .left {
    @include flex(column);
    flex: 1;
    .describe {
      font-size: 24rpx;
      color: #afafaf;
      line-height: 24rpx;
      margin-top: 8rpx;
    }
  }

  .title {
    @include flex;
    align-items: center;
    .text {
      font-weight: 500;
      font-size: 28rpx;
      color: #1a1a1a;
    }
  }
  .right {
    @include flex;
    align-items: center;
    justify-content: center;
    .text {
      font-size: 28rpx;
      color: #606060;
    }
  }
}
</style>
