<template>
  <!-- <popup ref="popupRef" title="金额明细" @close="emit('close')"> -->
  <view class="price-view">
    <view v-if="productPrice" class="item">
      <text class="text">商品总价</text>
      <u--text
        color="#1A1A1A"
        size="24rpx"
        mode="price"
        :bold="true"
        :text="+productPrice"
        align="right"
      ></u--text>
    </view>
    <view v-if="bargainPrice" class="item">
      <text class="text">议价</text>
      <u--text
        color="#1A1A1A"
        size="24rpx"
        mode="price"
        :bold="true"
        :text="+bargainPrice"
        align="right"
      ></u--text>
    </view>
    <view v-if="insuranceActivePrice" class="item">
      <text class="text">包赔费用</text>
      <u--text
        color="#1A1A1A"
        size="24rpx"
        mode="price"
        :bold="true"
        :text="+insuranceActivePrice"
        align="right"
      ></u--text>
    </view>
    <view v-if="guaranteePrice" class="item">
      <text class="text">担保费</text>
      <u--text
        color="#1A1A1A"
        size="24rpx"
        mode="price"
        :bold="true"
        :text="+guaranteePrice"
        align="right"
      ></u--text>
    </view>
    <view v-if="coinPrice" class="item">
      <text class="text">余额</text>
      <u--text
        color="#1A1A1A"
        size="24rpx"
        mode="price"
        :bold="true"
        :text="-coinPrice"
        align="right"
      ></u--text>
    </view>
    <view v-if="totalPrice" class="item">
      <text class="text">合计</text>
      <u--text
        color="#1A1A1A"
        size="14"
        mode="price"
        :bold="true"
        :text="+totalPrice"
        align="right"
      ></u--text>
    </view>
  </view>
  <!-- </popup> -->
</template>

<script lang="ts" setup>
import { ref } from "vue";
// import Popup from "@/components/popup/index.vue";

defineProps({
  productPrice: {
    type: [String, Number],
    default: 0,
  },
  bargainPrice: {
    type: [String, Number],
    default: 0,
  },
  totalPrice: {
    type: [String, Number],
    default: 0,
  },
  insuranceActivePrice: {
    type: [String, Number],
    default: 0,
  },
  guaranteePrice: {
    type: [String, Number],
    default: 0,
  },
  coinPrice: {
    type: [String, Number],
    default: 0,
  },
});

// const emit = defineEmits(["close"]);

const popupRef = ref(null);

const open = () => {
  popupRef.value?.open();
};

const close = () => {
  popupRef.value?.open();
};

defineExpose({
  open,
  close,
});
</script>
<style lang="scss" scoped>
.price-view {
  flex: 1;
  .item {
    display: flex;
    flex: 1;
    justify-content: space-between;
    .text {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 16rpx;
    }
  }
}
</style>
