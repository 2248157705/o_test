<template>
  <global-view
    bgColor="linear-gradient(to bottom, #ffffff, #F7F9FA)"
    :showBar="false"
  >
    <view class="platform-rules">
      <z-tabs
        ref="tabs"
        tab-width="115rpx"
        barWidth="56rpx"
        barHeight="8rpx"
        :list="subsectionList"
        :current="current"
        :inactiveStyle="inactiveStyle"
        :tabsStyle="tabsStyle"
        :activeStyle="activeStyle"
        :barStyle="barStyle"
        @change="tabsChange"
      />
      <view style="margin: 20rpx 0">
        <!-- 交易流程 -->
        <TradingProcess v-if="current === 0" />
        <!-- 交易须知 -->
        <TransactionNotice v-else-if="current === 1" />
        <!-- 买家须知 -->
        <BuyerNotice v-else-if="current === 2" />
        <!-- 卖家须知 -->
        <SellerNotice v-else-if="current === 3" />
        <!-- 售后服务 -->
        <AftersaleService v-else-if="current === 4" />
      </view>
    </view>
  </global-view>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import TradingProcess from "./components/trading-process.vue";
import TransactionNotice from "./components/transaction-notice.vue";
import BuyerNotice from "./components/buyer-notice.vue";
import SellerNotice from "./components/seller-natice.vue";
import AftersaleService from "./components/aftersale-service.vue";
import GlobalView from "@/components/global-view/index.vue";

const subsectionList = ref([
  { value: 0, name: "交易流程" },
  { value: 1, name: "交易须知" },
  { value: 2, name: "买家须知" },
  { value: 3, name: "卖家须知" },
  { value: 4, name: "售后服务" },
]);

const tabsStyle = reactive({
  // width: "750rpx",
});
const inactiveStyle = reactive({
  color: "#606060",
  fontSize: "28rpx",
  fontWeight: "400",
});
const activeStyle = reactive({
  color: "#1A1A1A",
  fontSize: "28rpx",
  fontWeight: "600",
});
const barStyle = reactive({
  color: "#539f9a",
  backgroundColor: "#539f9a",
  borderRadius: 0,
  // width:'400rpx'
});

const current = ref(0);
// tabs通知swiper切换
const tabsChange = (index: number) => {
  current.value = index;
};
</script>
<style lang="scss" scoped>
.platform-rules {
  padding: 0 20rpx 80rpx 20rpx;
  :deep(.z-tabs-item) {
    padding: 0 !important;
  }
}
</style>
