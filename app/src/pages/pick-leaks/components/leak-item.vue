<template>
  <view class="leak-item" @tap="handleGoodDetail">
    <image class="cover" mode="aspectFill" :src="product.product_covert" />
    <image class="icon" src="/static/images/sell/icon_special_title_1.png" />
    <view class="title">
      <u--text
        :lines="2"
        lineHeight="43rpx"
        size="28rpx"
        color="#1A1A1A"
        :bold="true"
        :text="product.product_title"
      ></u--text>
    </view>
    <view class="price">
      <text class="unit">¥</text>
      <text class="text">{{ product.product_price }} </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { ProductData } from "@/types/store";
import { withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    product: ProductData;
  }>(),
  {
    product: {},
  }
);

const handleGoodDetail = () => {
  const { product } = props;
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${product.product_id}`,
  });
};
</script>

<style lang="scss" scoped>
.leak-item {
  display: flex;
  flex-direction: column;
  position: relative;
  .icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 128rpx;
    height: 44rpx;
  }
  .cover {
    flex: 1;
    height: 235rpx;
    border-radius: 8rpx;
  }
  .title {
    margin: 6rpx 0;
  }
  .price {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    .unit {
      font-family: Barlow-Bold;
      font-weight: bold;
      font-size: 28rpx;
      color: #fc2a35;
    }
    .text {
      font-family: Barlow-Bold;
      font-weight: bold;
      font-size: 40rpx;
      color: #fc2a35;
    }
  }
}
</style>
