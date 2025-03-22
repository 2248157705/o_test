<template>
  <view class="goods-server">
    <view class="flex assure-box" @click="showCompensatePopupRef = true">
      <view class="detail">
        <image class="img" src="/static/images/sell/icon_assure_v2.png" />
      </view>
    </view>

    <view class="purchase-box" @click="handleGoPurchaseProcess">
      <view class="detail">
        <view class="flex title">
          <text class="text">交易流程</text>
          <image
            src="/static/images/sell/icon_left_green.png"
            style="width: 36rpx; height: 36rpx"
          />
        </view>
        <view class="purchase-process">
          <template
            v-if="props.product.product_type == ProductTypeEnum.GUARANTEE"
          >
            <image
              class="img"
              src="/static/images/sell/purchase-process-guarantee.png"
            />
          </template>
          <template
            v-else-if="props.product.product_type == ProductTypeEnum.RECYCLE"
          >
            <image
              class="img"
              src="/static/images/sell/purchase-process-recycle.png"
            />
          </template>
          <template v-else>
            <image class="img" src="/static/images/sell/purchase-process.png" />
          </template>
        </view>
      </view>
    </view>
    <goods-purchase-process ref="processRef" :product="props.product" />
    <compensate-popup
      v-if="props.product?.product_id"
      ref="compensatePopupRef"
      :product="props.product"
      :show="showCompensatePopupRef"
      @close="showCompensatePopupRef = false"
    />
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GoodsPurchaseProcess from "./goods-purchase-process.vue";
import CompensatePopup from "./compensate-popup.vue";
import { ProductTypeEnum } from "@/enums/product";
import Events, { report } from "@/utils/report/report";
const compensatePopupRef = ref(null);
const showCompensatePopupRef = ref(false);

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
});
const processRef = ref();

const handleGoPurchaseProcess = () => {
  report(Events.PRODUCT_TRANSACTION_FLOW);
  processRef.value?.open();
  // uni.navigateTo({ url: "/pages/my/security-center/purchase-process" });
};
</script>
<style lang="scss" scoped>
.goods-server {
  margin-bottom: 16rpx;
  border-radius: 24rpx;
  border: 2rpx solid #ffffff;
  background-image: linear-gradient(
    180deg,
    #ffffff 0%,
    #ffffff 50%,
    #f9fffe 100%
  );
  overflow: hidden;

  .flex {
    @include flex(row);
    align-items: center;
  }

  .assure-box {
    .detail {
      .img {
        width: 702rpx;
        height: 88rpx;
      }
    }
    // padding-right: 24rpx;
    // height: 64rpx;
    // background: linear-gradient(90deg, #30dcf8 0%, #51f9f8 100%);
    // border-radius: 12rpx 12rpx 0rpx 0rpx;

    // &.flex {
    //   justify-content: space-between;
    // }

    // .title {
    //   padding-left: 24rpx;
    //   .text {
    //     font-weight: 500;
    //     font-size: 28rpx;
    //     color: #363c57;
    //   }
    // }
  }
  .purchase-box {
    position: relative;
    margin-top: -30rpx;
    padding: 24rpx 24rpx;
    background: linear-gradient(180deg, #e3f8ff 0%, #ffffff 47%, #ffffff 100%);
    border-radius: 12rpx;
    // border: 2rpx solid rgba(236, 251, 255, 1);
    border-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1),
        rgba(236, 251, 255, 1)
      )
      2 2;
    z-index: 100;

    .title {
      margin-bottom: 16rpx;

      &.flex {
        justify-content: space-between;
      }
      .text {
        font-weight: 600;
        font-size: 32rpx;
        color: #161616;
      }
    }

    .purchase-process {
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
      .img {
        width: 654rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
