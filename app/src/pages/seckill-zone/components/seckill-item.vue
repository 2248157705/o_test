<template>
  <view class="seckill-item" @tap="handleGoodDetail">
    <image
      class="cover"
      mode="aspectFill"
      :src="product.origProductDetail.productCovert"
    />
    <image class="icon" src="/static/images/seckill/icon_special_title.png" />
    <view v-if="!showStock" class="seckill-end">
      <image
        class="end-cover"
        src="/static/images/seckill/icon_buy_end_cover.png"
      />
    </view>
    <view class="product-msg">
      <view class="title">
        <u--text
          :lines="2"
          lineHeight="18"
          size="12"
          color="#1A1A1A"
          prefixImage="/static/images/seckill/icon_special_title.png"
          :prefixImageStyle="{ width: '102rpx', height: '44rpx' }"
          :bold="true"
          :text="productTitle"
        ></u--text>
      </view>
      <text class="old-price">
        ¥ {{ product.origProductDetail.productPrice }}
      </text>
      <view class="dot"></view>
      <view class="price" @tap.stop="handleBuy">
        <image class="price-bg" :src="priceBg" />
        <view class="price-box">
          <text
            class="tips-text"
            :class="{
              out: buyEnd,
            }"
            >仅需¥
          </text>
          <text
            class="text"
            :class="{
              out: buyEnd,
            }"
            >{{ product.skPrice }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { SeckillPurchaseRes } from "@/types/seckill";
import { SeckillShowStatus } from "@/enums/seckill";
import { withDefaults, watch, computed, ref } from "vue";
import { throttle } from "lodash-es";
const props = withDefaults(
  defineProps<{
    product: SeckillPurchaseRes;
    status: any;
  }>(),
  {
    product: {},
    status: {},
  }
);
const status = ref(props.status);

// 是否有库存
const showStock = computed(() => {
  const { productGetInventory } = props.product;
  return productGetInventory && productGetInventory.stockCount >= 1;
});

const buyEnd = computed(() => {
  return !showStock.value || status.value != SeckillShowStatus.ONGOING;
});

const productTitle = computed(() => {
  const { origProductDetail } = props.product;
  return origProductDetail.productTitle
    .replace(/\[.*?\]/g, "")
    .replace(/【.*?】/g, "");
});

const priceBg = computed(() => {
  if (showStock.value && status.value == SeckillShowStatus.ONGOING) {
    return "/static/images/seckill/icon_buy.png";
  }
  if (!showStock.value) {
    return "/static/images/seckill/icon_buy_end.png";
  }
  if (status.value != SeckillShowStatus.ONGOING) {
    return "/static/images/seckill/icon_buy_grey.png";
  }
  return "";
});

const emits = defineEmits(["handleBuy"]);

const handleBuy = throttle(() => {
  const { product } = props;

  if (!showStock.value) {
    uni.$main.toast("已被幸运儿抢走啦～");
    return;
  }
  if (status.value == SeckillShowStatus.UPCOMING) {
    uni.$main.toast("即将开始，敬请留意");
    return;
  }
  if (status.value == SeckillShowStatus.ENDED) {
    uni.$main.toast("秒杀活动已经结束~");
    return;
  }

  emits("handleBuy", {
    productId: product.origProductDetail.productId,
    skNo: product.skNo,
    purchaseNum: 1,
  });
}, 300);

const handleGoodDetail = () => {
  const { origProductDetail } = props.product;
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${origProductDetail.productId}`,
  });
};

watch(
  () => props.status,
  (val, oldVal) => {
    if (val != oldVal) {
      status.value = val;
    }
  },
  {
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.seckill-item {
  display: flex;
  flex-direction: row;
  padding: 16rpx;
  position: relative;
  .seckill-end {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    width: 320rpx;
    height: 240rpx;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .end-cover {
      width: 168rpx;
      height: 168rpx;
      border-radius: 8rpx;
    }
  }
  .icon {
    position: absolute;
    top: 16rpx;
    left: 16rpx;
    width: 102rpx;
    height: 44rpx;
  }
  .cover {
    width: 320rpx;
    height: 240rpx;
    border-radius: 8rpx;
  }
  .product-msg {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 16rpx;
    .title {
      margin: 6rpx 0;
      height: 75rpx;
    }
    .dot {
      margin: 12rpx 0;
    }
    .old-price {
      font-family: Barlow-Medium;
      font-weight: 500;
      font-size: 28rpx;
      color: #afafaf;
      margin: 12rpx 0;
      text-decoration: line-through;
    }
    .price {
      position: relative;
      width: 334rpx;
      height: 72rpx;
      .price-bg {
        position: absolute;
        width: 334rpx;
        height: 72rpx;
        left: 0;
      }
      .price-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 155rpx;
        height: 75rpx;
        margin-top: 5rpx;
        .tips-text {
          font-weight: 600;
          font-size: 28rpx;
          color: #fc2a35;
          padding-top: 10rpx;
          &.out {
            color: #afafaf;
          }
        }
        .text {
          font-family: Barlow-Bold;
          font-weight: bold;
          font-size: 46rpx;
          color: #fc2a35;
          &.out {
            color: #afafaf;
          }
        }
      }
    }
  }
}
</style>
