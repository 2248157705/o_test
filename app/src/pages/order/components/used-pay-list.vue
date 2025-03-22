<template>
  <view class="pay-list">
    <template v-for="item in items" :key="item.payMethod">
      <view v-if="item.payStatus === PayStatus.ING" class="row">
        <view class="row list">
          <u--image class="img" width="48rpx" height="48rpx" :src="item.img" />
          &nbsp;
          <view class="detail">
            <text class="name">{{
              payMethodDataMap[item.payMethod].name
            }}</text>
          </view>
        </view>
        <view class="status">
          <text class="text">待付款</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { payMethodDataMap } from "@/pages/order/js/purchase";
import { PayStatus } from "@/enums/order";

defineProps({
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

onMounted(() => {
  //
});

defineExpose({});
</script>
<style lang="scss" scoped>
.pay-list {
  .flex {
    @include flex(row);
  }
  .row {
    position: relative;
    @include flex(row);
    align-items: center;
    justify-content: space-between;
  }

  .list {
    position: relative;
    margin: 8rpx 0;
    padding: 12rpx 0;
    padding-right: 60rpx;

    .img {
      margin-left: 24rpx;
    }
    .detail {
      @include flex(row);
      align-items: center;

      .name {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }

  .status {
    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: #1a1a1a;
    }
  }
}
</style>
