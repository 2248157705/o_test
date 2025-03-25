<template>
  <view class="order-status-box">
    <view class="order-time">
      <text class="text">{{ order.create_time }}</text>
    </view>
    <view class="order-status">
      <u-count-down
        v-if="
          orderStatusData.action &&
          [orderActionMap.PAID].includes(orderStatusData.action)
        "
        :time="getCountDownTime(order.unpay_close_time)"
        format="mm:ss"
        @finish="handleFinishCountDown"
      ></u-count-down>
      <text :class="`text ${orderStatusData.color || ''}`">
        &nbsp;{{ orderStatusData.msg || "" }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, computed } from "vue";
import {
  getCountDownTime,
  getOrderStatusData,
  orderActionMap,
} from "@/pages/order/js/order";

// const emit = defineEmits(["finish"]);

const props = withDefaults(defineProps<{ order: any }>(), {
  order: {},
});

const orderStatusData = computed(() => {
  const { order_status, order_type } = props.order;
  return getOrderStatusData(order_status, order_type);
});

const handleFinishCountDown = () => {
  // emit("finish");
};
</script>

<style lang="scss" scoped>
.order-status-box {
  @include flex(row);
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20rpx;
  margin-bottom: 24rpx;
  border-bottom: 1.5rpx solid #f4f5f6;

  .order-time {
    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: #afafaf;
    }
  }

  .order-status {
    @include flex(row);
    align-items: center;
    justify-content: flex-end;
    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: $app-main-color;

      &.red {
        color: #f42a2a;
      }
    }
  }
}
</style>
