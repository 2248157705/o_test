<template>
  <view
    class="category-navbar"
    :style="{
      background: props.bgColor,
    }"
  >
    <view class="category-navbar-text">
      <image
        class="icon"
        :src="`/static/images/home/${props.categoryIcon}.png`"
        style="width: 156rpx; height: 32rpx"
      ></image>
      <view v-if="props.moreText" class="more" @tap="handleClick">
        <text class="text">{{ props.moreText }}</text>
        <u-icon name="arrow-right" color="#AFAFAF" size="10"></u-icon>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  moreText: {
    type: String,
    default: "",
  },
  categoryIcon: {
    type: String,
    default: "",
  },
  bgColor: {
    type: String,
    default: "#fff",
  },
});

const emit = defineEmits(["handleClick"]);

const handleClick = () => {
  emit("handleClick");
};
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.category-navbar {
  width: 702rpx;
  margin-top: 16rpx;
  padding: 0 12rpx;
  background-color: #fff;
  border-radius: 12rpx;
  .category-navbar-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 12rpx;
    padding: 20rpx 12rpx;
    .more {
      display: flex;
      flex-direction: row;
      align-items: center;
      .text {
        font-size: 24rpx;
        color: #afafaf;
        margin-right: 5rpx;
      }
    }
  }
}
</style>
