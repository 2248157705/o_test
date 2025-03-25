<template>
  <view class="goods-box">
    <view class="goods-box-item">
      <view class="time">
        <text class="date text">{{ formatDate }}</text>
        <template v-if="state.showTime">
          <view style="display: flex; flex-direction: row; align-items: center">
            <!--            <bing-countup-->
            <!--              :color="state.msg == '后取消' ? '#f42a2a' : '#1CC7BE'"-->
            <!--              :splitorColor="state.msg == '后取消' ? '#f42a2a' : '#1CC7BE'"-->
            <!--              :autoStart="true"-->
            <!--              :hour="countDownTime.hours"-->
            <!--              :minute="countDownTime.minutes"-->
            <!--              :second="countDownTime.seconds"-->
            <!--            />-->

            <text :class="`msg text ${state.color}`">{{ state.msg }}</text>
          </view>
        </template>
        <template v-else>
          <text :class="`msg text ${state.color}`">{{ state.msg }}</text>
        </template>
      </view>
      <goods-item
        type="bargain"
        :row="true"
        :product="props.bargainData.product"
        :bargain="{
          price: props.bargainData?.price,
        }"
        @handle-good-detail="handleDetail(props.bargainData)"
      >
        <!-- <template #price>
          <view class="price-box">
            <view class="original-price price-text">
              <text class="text">原价</text>
              <u--text
                bold
                color="#1A1A1A"
                size="12"
                mode="price"
                align="left"
                :text="+(props.bargainData?.product?.product_price || 0)"
              ></u--text>
            </view>
            <view class="bargain-price price-text">
              <text class="text">议价</text>
              <u--text
                bold
                color="#1A1A1A"
                size="12"
                mode="price"
                align="left"
                :text="+(props.bargainData?.price || 0)"
              ></u--text>
            </view>
          </view>
        </template> -->
      </goods-item>
      <view v-if="state.endTime" class="end-time">
        <text class="text">{{ state.endTime }}</text>
      </view>
      <view class="operation">
        <template v-for="(item, index) in state.operation" :key="index">
          <view :class="`btn ${item.color}`" @tap="handleOpe(item)">
            <text
              class="text"
              :style="{
                color: textColor(item.color),
              }"
              >{{ item.name }}</text
            >
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import GoodsItem from "./goods-item.vue";
// import BingCountup from "@/components/bing-countup/index.vue";
import { withDefaults, computed, watch, reactive } from "vue";
import { OrderBargainListRes } from "@/types/order";
import { getBargainStatusData } from "../js/bargain";
import { BargainStatus } from "@/enums/order";
import { isEqual } from "lodash-es";

const props = withDefaults(
  defineProps<{
    bargainData: OrderBargainListRes;
    bidder: string;
    bargainRef: any;
    createOrderRef: any;
    closeBargainRef: any;
    purchasePopupRef: any;
  }>(),
  {
    bargainData: {},
    bidder: "buyer",
    bargainRef: null,
    createOrderRef: null,
    closeBargainRef: null,
    purchasePopupRef: null,
  }
);

const formatDate = computed(() => {
  return props.bargainData.bid_history.now_record.create_time
    .replace(/-/g, "/")
    .split(" ")[0];
});

// const countDownTime = computed(() => {
//   return getCountDown(props.bargainData.bid_history.now_record.expiration_time);
// });

const textColor = (color) => {
  const data = {
    white: "#1CC7BE",
    green: "#fff",
    grey: "#606060",
  };
  return data[color];
};

let state = reactive({});

watch(
  () => props.bargainData.bargain_status,
  (newVal, oldVal) => {
    if (!isEqual(newVal, oldVal)) {
      const { bid_history, bargain_status } = props.bargainData;

      state = getBargainStatusData(
        props.bargainData,
        props.bidder,
        props.bargainRef,
        props.createOrderRef,
        props.closeBargainRef,
        props.purchasePopupRef
      );
      state.showTime = ["后取消", "已同意", "已还价", "待处理"].includes(
        state.msg
      );

      state.endTime = [
        BargainStatus.SELLER_AGREE,
        BargainStatus.FINISH,
      ].includes(bargain_status)
        ? "协商截止时间：" + bid_history.now_record.expiration_time
        : "";
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// const state = {}

// const TipsMsg = computed(() => {});
const emit = defineEmits(["onDetail", "reload", "onOperation"]);

const handleDetail = () => {
  emit("onDetail");
};
const handleOpe = (item: any) => {
  item.controls(() => {
    emit("reload");
  });
  emit("onOperation");
};
</script>

<style lang="scss" scoped>
.goods-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  .goods-box-item {
    margin-top: 24rpx;
    width: 702rpx;
    background-color: #fff;
    border-radius: $app-box-radius;
    padding: 24rpx;
    padding-bottom: 0;
    /* box-sizing: border-box; */
    .time {
      flex: 1;
      @include flex(row);
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        &.date {
          color: #afafaf;
        }
        &.green {
          color: $app-main-color;
        }
        &.red {
          color: #f42a2a;
        }
        &.grey {
          color: #606060;
        }
      }
    }
    .price-box {
      flex: 1;
      @include flex(row);
      /* align-items: flex-end; */
      .price-text {
        @include flex(row);
        align-items: center;
        .text {
          font-weight: 400;
          font-size: 18rpx;
          border: 2rpx solid #f4f5f6;
          padding: 2rpx 12rpx;
          /* box-sizing: border-box; */
        }
        &.original-price {
          .text {
            color: $app-main-color;
          }
        }
        &.bargain-price {
          margin-left: 8rpx;
          .text {
            color: #f42a2a;
          }
        }
      }
    }
    .end-time {
      margin-top: 24rpx;
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      .text {
        color: #1a1a1a;
        font-size: 24rpx;
      }
    }
    .operation {
      @include flex(row);
      align-items: center;
      justify-content: flex-end;
      margin: 24rpx 0;

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 192rpx;
        height: $app-small-btn-height;
        margin-left: 24rpx;
        border-radius: $app-box-radius;
        border: 2rpx solid #1cc7be;
        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #606060;
        }
        &.white {
          border-color: #1cc7be;
          background-color: #fff;
          .text {
            color: #1cc7be;
          }
        }
        &.green {
          background-color: #1cc7be;
          .text {
            color: #fff;
          }
        }
        &.grey {
          background-color: #f4f5f6;
          border-color: #f4f5f6;
          .text {
            color: #1a1a1a;
            font-weight: 600;
          }
        }
      }
    }
  }
}
</style>
