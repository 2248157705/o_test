<template>
  <view class="raffle-item" @tap="handleGoodDetail">
    <view class="product-box">
      <image class="bg" src="/static/images/raffle/raffle_product_bg.png" />
      <image class="label" src="/static/images/raffle/raffle_item_label.png" />
      <view class="top-msg">
        <text class="text">查看详情</text>
        <image class="icon" src="/static/images/common/icon_right_bold.png" />
      </view>
      <image
        class="cover"
        mode="aspectFill"
        :src="product.origProductDetail.productCovert"
      />
    </view>
    <view class="product-msg">
      <view class="title">
        <u--text
          :lines="2"
          lineHeight="18"
          size="24rpx"
          color="#1A1A1A"
          :prefixImageStyle="{ width: '102rpx', height: '44rpx' }"
          :bold="true"
          :text="productTitle"
        ></u--text>
      </view>
      <text class="old-price">
        ¥{{ product.origProductDetail.productPrice }}
      </text>
      <view class="price" @tap.stop="handleBuy">
        <image
          class="price-bg"
          :src="`/static/images/raffle/raffle_item_${status}.png`"
        />
      </view>
      <view v-if="status == RaffleProductStatus.UPCOMING" class="start-time">
        <image
          class="time-bg"
          src="/static/images/raffle/raffle_item_time_box.png"
        />
        <text class="text">{{ timeTitle }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { SeckillPurchaseRes } from "@/types/seckill";
import { RaffleProductStatus } from "@/enums/raffle";
import { withDefaults, watch, computed, ref } from "vue";
import { throttle } from "lodash-es";
import { getProductStatus } from "../js/utils";
const props = withDefaults(
  defineProps<{
    product: SeckillPurchaseRes;
    timeTitle: string;
    status: any;
  }>(),
  {
    product: {},
    status: {},
    timeTitle: null,
  }
);
const status = ref(props.status);
const timeTitle = ref(props.timeTitle.toString());

const productTitle = computed(() => {
  const { origProductDetail } = props.product;
  return origProductDetail.productTitle
    .replace(/\[.*?\] /g, "")
    .replace(/【.*?】/g, "");
});

const emits = defineEmits(["onBuy", "onGoodDetail"]);

const handleBuy = throttle(() => {
  const { product } = props;

  if (status.value == RaffleProductStatus.ING) {
    uni.$main.toast("已参与，等待开奖");
    return;
  }
  if (status.value == RaffleProductStatus.UPCOMING) {
    uni.$main.toast("即将开始，敬请留意");
    return;
  }
  if (status.value == RaffleProductStatus.YES) {
    uni.$main.toast("联系客服领奖，若已领取，请忽略");
    return;
  }
  if (
    [RaffleProductStatus.ENDED, RaffleProductStatus.NODE].includes(status.value)
  ) {
    uni.$main.toast("抽奖活动已经结束~");
    return;
  }

  emits("onBuy", {
    productId: product.origProductDetail.productId,
    raffleNo: product.raffleNo,
  });
}, 300);

const handleGoodDetail = () => {
  const { raffleNo } = props.product;
  emits("onGoodDetail", {
    raffleNo,
    status: status.value,
  });
};

watch(
  () => [props.status, props.product],
  (newVal) => {
    status.value = getProductStatus(newVal[0], newVal[1]?.raffleOrderDetail);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.raffle-item {
  display: flex;
  flex-direction: row;
  padding: 8rpx 16rpx;
  position: relative;
  .product-box {
    width: 313rpx;
    height: 229rpx;
    justify-content: space-between;

    .bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      flex: 1;
    }
    .label {
      position: absolute;
      width: 143rpx;
      height: 45rpx;
      top: 0;
      right: 0;
    }
    .top-msg {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 22rpx;
      padding-top: 16rpx;
      .text {
        font-weight: 300;
        font-size: 20rpx;
        color: #000000;
      }
      .icon {
        width: 20rpx;
        height: 20rpx;
        margin-top: 1rpx;
      }
    }
    .cover {
      width: 313rpx;
      height: 181.6rpx;
      border-radius: 10rpx;
    }
  }
  .product-msg {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 16rpx;
    .title {
      height: 70rpx;
      margin-top: 10rpx;
    }
    .old-price {
      font-family: Barlow-ExtraBold;
      font-weight: bold;
      font-size: 46rpx;
      color: #ff3624;
      margin: 10rpx 0;
      text-decoration: line-through;
      flex: 1;
    }
    .price {
      position: relative;
      width: 297rpx;
      height: 73rpx;
      .price-bg {
        width: 297rpx;
        height: 73rpx;
      }
    }
  }

  .start-time {
    width: 173rpx;
    height: 57rpx;
    position: absolute;
    z-index: 9999;
    right: 0;
    bottom: 55rpx;
    @include flex(row);
    align-items: center;
    padding-left: 12rpx;
    padding-top: 8rpx;
    .time-bg {
      position: absolute;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
      width: 173rpx;
      height: 57rpx;
    }
    .text {
      font-family: Barlow-SemiBold;
      font-weight: bold;
      font-size: 20rpx;
      color: #2a2a2a;
      text-align: center;
      width: 125rpx;
    }
  }
}
</style>
