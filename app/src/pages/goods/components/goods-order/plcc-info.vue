<template>
  <view class="contract-box">
    <view class="hand">
      <view class="left">
        <view class="title">
          <text class="text">选择包赔</text>
        </view>
        <image
          class="img"
          src="/static/images/common/icon_help.png"
          @click="handelQuery"
        />
      </view>
      <text class="right">95%的玩家已购买包赔</text>
    </view>
    <explain-popup
      ref="compensateRef"
      title="包赔类型说明"
      mode="center"
      showConfirmButton
      confirmText="我知道了"
      @confirm="handleConfirm"
    >
      <view class="compensate-view">
        <view v-for="item in lists" :key="item.id" class="item">
          <text class="title">{{ item.insurance_name }}</text>
          <text class="text">{{ item.insurance_instructions_concat }}</text>
        </view>
      </view>
    </explain-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { InsuranceType } from "@/enums/order";
import ExplainPopup from "@/components/my-popup/index.vue";
const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  price: {
    type: [Number, String],
    default: 0,
  },
});

const lists = computed(() => {
  return props.list.filter(
    (item) => item.insurance_type != InsuranceType.NO_BUY
  );
});

const compensateRef = ref(null);

const handelQuery = () => {
  compensateRef.value.open();
};
const handleConfirm = () => {};
defineExpose({});
</script>
<style lang="scss" scoped>
.contract-box {
  margin: 16rpx 0;
  .hand {
    @include flex;
    justify-content: space-between;
    .left {
      @include flex;
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 600;
        font-size: 32rpx;
        color: #1a1a1a;
      }
      .img {
        width: 40rpx;
        height: 40rpx;
        // position: relative;
        // top: -21rpx;
        margin-left: 6rpx;
      }
    }
    .right {
      font-weight: 400;
      font-size: 28rpx;
      color: #1a1a1a;
    }
  }
}
.compensate-view {
  @include flex(column);
  margin: 24rpx 0;
  .item {
    margin-bottom: 20rpx;
    @include flex(column);
    .title {
      font-weight: 500;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 16rpx;
    }
    .text {
      font-weight: 400;
      font-size: 32rpx;
      color: #606060;
      line-height: 58rpx;
    }
  }
}
</style>
