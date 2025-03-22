<template>
  <view class="goods-box">
    <view class="goods-box-item">
      <view class="time">
        <text class="date text">{{ formatDate }}</text>
        <template v-if="state.showTime">
          <view style="display: flex; flex-direction: row; align-items: center">
            <bing-countup
              :color="state.msg == '后议价失效' ? '#f42a2a' : '#1CC7BE'"
              :splitorColor="state.msg == '后议价失效' ? '#f42a2a' : '#1CC7BE'"
              :autoStart="true"
              :hour="countDownTime.hours"
              :minute="countDownTime.minutes"
              :second="countDownTime.seconds"
            />

            <text :class="`msg text ${state.color}`">{{ state.msg }}</text>
          </view>
        </template>
        <template v-else>
          <text :class="`msg text ${state.color}`">{{ state.msg }}</text>
        </template>
        <text
          v-if="bargainData.unread_status && bargainData.unread_status > 0"
          class="unread"
        ></text>
      </view>
      <goods-item
        type="personal-list"
        :row="true"
        :product="props.bargainData.product"
        :bargain="{
          price: props.bargainData?.price,
        }"
        @handle-good-detail="handleDetail(props.bargainData)"
      >
      </goods-item>
      <view v-if="state.endTime" class="end-time">
        <text class="text">{{ state.endTime }}</text>
      </view>
      <view class="operation">
        <template v-if="showMore">
          <text
            :id="`more${bargainData.id}`"
            ref="moreRef"
            class="more"
            @click="handleMore(`more${bargainData.id}`)"
            >更多</text
          >
        </template>
        <template
          v-for="(item, index) in state.operation.slice(showMore ? 1 : 0, 4)"
          :key="index"
        >
          <view
            :class="`btn ${item.color}`"
            :style="{
              opacity: item.disable ? 0.4 : 1,
            }"
            @tap="handleOpe(item)"
          >
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
  <u-overlay
    opacity="0"
    :show="showMoreOperation == 0 ? false : true"
    @tap="showMoreOperation = 0"
  >
    <view
      v-if="showMoreOperation"
      class="operation-more"
      :style="{
        top: showMoreOperation + 'px',
      }"
    >
      <template
        v-for="(item, index) in state.operation.slice(
          0,
          state.operation.length - 3
        )"
        :key="index"
      >
        <text
          class="item"
          :class="{
            end: index + 1 == state.operation.length - 3,
          }"
          @tap="handleOpe(item)"
          >{{ item.name }}</text
        >
      </template>
    </view>
  </u-overlay>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GoodsItem from "@/components/goods-item-preview/index.vue";
import BingCountup from "@/components/bing-countup/index.vue";
import { withDefaults, computed, watch, reactive } from "vue";
import { OrderBargainListRes } from "@/types/order";
import { getBargainStatusData, getCountDown } from "../js/bargain";
import { BargainStatus } from "@/enums/order";
import { isEqual } from "lodash-es";
const moreRef = ref(null);

const props = withDefaults(
  defineProps<{
    bargainData: OrderBargainListRes;
    bidder: string;
    bargainRef: any;
    createOrderRef: any;
    closeBargainRef: any;
    purchasePopupRef: any;
    headerHeight: any;
    bargainHistoryRef: any;
  }>(),
  {
    bargainData: {},
    bidder: "buyer",
    bargainRef: null,
    createOrderRef: null,
    closeBargainRef: null,
    purchasePopupRef: null,
    bargainHistoryRef: null,
    headerHeight: 0,
  }
);

const formatDate = computed(() => {
  return props.bargainData.bid_history.now_record.create_time
    .replace(/-/g, "/")
    .split(" ")[0];
});

const countDownTime = computed(() => {
  return getCountDown(props.bargainData.bid_history.now_record.expiration_time);
});

const textColor = (color) => {
  const data = {
    white: "#1CC7BE",
    green: "#fff",
    grey: "#606060",
  };
  return data[color];
};

let state = reactive({});

const showMore = ref(false);

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
        props.purchasePopupRef,
        props.bargainHistoryRef
      );
      state.showTime = [
        "后议价失效",
        "已同意议价",
        "已还价",
        "待处理",
      ].includes(state.msg);

      state.endTime = [
        BargainStatus.SELLER_AGREE,
        BargainStatus.FINISH,
      ].includes(bargain_status)
        ? "协商截止时间：" + bid_history.now_record.expiration_time
        : "";
      showMore.value = state.operation.length >= 4;
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
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${props.bargainData.product.product_id}`,
  });
};
const handleOpe = (item: any) => {
  showMoreOperation.value = 0;
  if (item.disable) {
    uni.$main.toast(`议价已达上限${item.globalRemainingCount}次，请明日再试~`);
    return;
  }
  item.controls((status) => {
    emit("reload", BargainStatus.WAIT_SELLER == status ? 2 : 1);
  });
  emit("onOperation");
};

const showMoreOperation = ref(0);
const handleMore = (id) => {
  // #ifdef H5
  const query = uni.createSelectorQuery().in(this);
  query
    .select("#" + id)
    .boundingClientRect((data) => {
      showMoreOperation.value = data.top - props.headerHeight + 20;
    })
    .exec();
  // #endif

  // #ifdef APP-NVUE
  const dom = weex.requireModule("dom");
  dom.getComponentRect(moreRef.value, (option) => {
    if (option && option.result) {
      showMoreOperation.value = option.size.top + 20;
    }
  });
  // #endif
};
</script>

<style lang="scss" scoped>
:deep(.personal-list.account-list-item) {
  margin-bottom: 0 !important;
  height: 230rpx !important;
}
.operation-more {
  position: fixed;
  z-index: 9999;
  left: 24rpx;
  top: 0;
  width: 192rpx;
  background: #ffffff;
  box-shadow: 0rpx 8rpx 48rpx 0rpx rgba(0, 0, 0, 0.06);
  border-radius: 16rpx;
  padding: 24rpx;
  .item {
    height: 64rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #1a1a1a;
    text-align: center;
    line-height: 64rpx;
    border-bottom: 1rpx solid #f4f5f6;
    &.end {
      border-color: #fff;
    }
  }
}
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
      padding-bottom: 20rpx;
      margin-bottom: 24rpx;
      padding-right: 24rpx;
      border-bottom: 1.5rpx solid #f4f5f6;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        padding-bottom: 2rpx;
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
      .unread {
        background: red;
        position: absolute;
        right: 0px;
        width: 10rpx;
        height: 10rpx;
        top: 4rpx;
        border-radius: 50%;
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
      .more {
        font-weight: 500;
        font-size: 28rpx;
        color: #afafaf;
        margin-right: 16rpx;
      }

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 177rpx;
        height: $app-small-btn-height;
        margin-left: 16rpx;
        border-radius: 200rpx;
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
