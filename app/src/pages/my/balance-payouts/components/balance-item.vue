<template>
  <template v-if="isPayouts">
    <withdraw-item :item="withdrawInfo" />
  </template>
  <template v-else>
    <view class="balance-box">
      <view class="flex">
        <view class="strong left" style="width: 550rpx">
          <u--text
            v-if="productInfo.prodId"
            :text="`${bizCodeStatusMap[item.biz_code] ? bizCodeStatusMap[item.biz_code] + '-' : ''}${productInfo.prodName}`"
            size="32rpx"
            color="#1a1a1a"
            :lines="2"
          ></u--text>
          <u--text
            v-else
            :text="`${bizCodeStatusMap[item.biz_code]}`"
            size="32rpx"
            color="#1a1a1a"
            :lines="2"
          ></u--text>
        </view>
        <!-- <view class="price">
          <text class="strong">+</text>
          <u--text
            bold
            color="#1A1A1A"
            size="14"
            mode="price"
            align="left"
            :text="+(item.amount || 0)"
          ></u--text>
          <text class="strong">元</text>
        </view> -->
        <text v-if="+item.addi > 0" class="strong"
          >+{{ formatPrice(item.amount) }}元</text
        >
        <text v-else-if="+item.deduct > 0" class="strong"
          >-{{ formatPrice(item.amount) }}元</text
        >
      </view>
      <view class="flex">
        <text class="text">
          {{ dayjs(item.deal_time).format("YYYY-MM-DD HH:mm:ss") }}</text
        >
      </view>
      <view v-if="productInfo.prodId" class="flex">
        <text class="text">商品编号: {{ productInfo.prodId }}</text>
      </view>
      <view v-if="item.biz_order_id" class="flex">
        <text class="text">订单号: {{ item.biz_order_id }}</text>
      </view>
    </view>
  </template>
</template>
<script setup lang="ts">
import { computed } from "vue";
import dayjs from "dayjs";
import WithdrawItem from "./withdraw-item.vue";

const props = defineProps({
  item: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const bizCodeStatusMap = {
  PAYOUTS: "提现成功",
  PAYOUTS_REFUND: "提现失败",
  ORDER_FINISHED: "售出商品",
  ORDER_REFUNDED: "商品退款",
  ORDER_AFTER_SALE: "售后商品",
  ORDER_INSURANCE: "商品理赔",
  GOODS_ORDER: "余额支付",
  PAY_GROUP_REFUND: "订单关闭退回",
  PENALTY_ORDER: "违约金支付",
  // CHANGE_BALANCE: "余额变更",
  // BALANCE_CHARGE: "余额变更",
};

const formatPrice = (num) => {
  if (("" + num).includes(".")) {
    return uni.$u.priceFormat(num || 0, 2);
  } else {
    return uni.$u.priceFormat(num || 0);
  }
};

const productInfo = computed(() => {
  if (props.item && props.item.order_snap) {
    return JSON.parse(props.item.order_snap);
  }
  return {};
});

const isPayouts = computed(() => {
  const { biz_code } = props.item;
  return biz_code && (biz_code === "PAYOUTS" || biz_code === "PAYOUTS_REFUND");
});

const withdrawInfo = computed(() => {
  const { biz_code, deal_time, addi, deduct } = props.item;
  if (isPayouts.value) {
    const isSuccess = biz_code === "PAYOUTS";
    return {
      price: isSuccess ? deduct : addi,
      create_time: dayjs(deal_time).format("YYYY-MM-DD HH:mm:ss"),
      change_type: "",
      trans_status: biz_code,
      refuse_cause: productInfo.value?.description,
    };
  }
  return {};
});
</script>
<style lang="scss" scoped>
.balance-box {
  padding: 24rpx;
  background: #fff;
  .flex {
    @include flex(row);
    justify-content: space-between;
    align-items: center;
    margin: 8rpx 0;
  }
  .price {
    @include flex(row);
    align-items: center;
  }
  .strong {
    text-align: right;
    font-weight: 500;
    font-size: 30rpx;
    color: #1a1a1a;

    &.left {
      text-align: left;
    }
  }

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
  }
  .status {
    font-weight: 400;
    font-size: 28rpx;
    color: $app-main-color;

    &.success {
      color: #1a1a1a;
    }
    &.failed {
      color: #f42a2a;
    }
  }
}
</style>
