<template>
  <view class="goods-view">
    <view class="cover">
      <u--image
        width="208rpx"
        height="156rpx"
        radius="4"
        :src="props.product.product_covert"
      />
      <image
        v-if="props.product.product_type == ProductTypeEnum.GUARANTEE"
        class="tag"
        src="/static/images/common/guarantee.png"
      />
    </view>
    <view class="intro">
      <view class="title">
        <u--text
          :lines="1"
          color="#636363"
          size="28rpx"
          :text="props.product.product_title"
        ></u--text>
      </view>
      <view
        class="msg"
        :class="{
          column: props.bargain && props.bargain.price,
        }"
      >
        <view class="btn-wrapper">
          <view class="btn">
            <text class="text">找回包赔</text>
          </view>
          <view
            v-if="props.product.product_type !== ProductTypeEnum.RECYCLE"
            class="btn"
          >
            <text class="text">合同保障</text>
          </view>
        </view>
        <template v-if="props.bargain && props.bargain.price">
          <view class="price-box">
            <view class="original-price price-text">
              <text class="text">原价</text>
              <u--text
                bold
                color="#1A1A1A"
                size="12"
                mode="price"
                align="left"
                decoration="line-through"
                :text="+(props.product.product_price || 0)"
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
                :text="+(props.bargain.price || 0)"
              ></u--text>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="price">
            <text class="mark">¥</text
            ><text class="text">{{
              priceFormat(props.product.product_price || 0, 2)
            }}</text>
            <!-- <u--text
              bold
              color="#1A1A1A"
              size="16"
              mode="price"
              :text="+(props.product.product_price || 0)"
              align="right"
            ></u--text> -->
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ProductTypeEnum } from "@/enums/product";
import { withDefaults } from "vue";
import { priceFormat } from "@/utils/index";

const props = withDefaults(
  defineProps<{ product: ProductData; bargain?: any }>(),
  {
    product: {},
    bargain: {},
  }
);
</script>

<style lang="scss" scoped>
.goods-view {
  // width: 702rpx;
  padding: 24rpx;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  border-radius: 12rpx;

  .cover {
    margin-right: 20rpx;
    position: relative;
    .tag {
      width: 208rpx;
      height: 46rpx;
      border-radius: 0 0 8rpx 8rpx;
      position: absolute;
      bottom: 0;
    }
  }
  .intro {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      width: 400rpx;
    }
    .btn-wrapper {
      display: flex;
      flex-direction: row;
      // border: 1px solid;
      // position: absolute;
      // top: 200rpx;
      // z-index: 99;
    }
    .btn {
      margin-right: 8rpx;
      margin-bottom: 25rpx;
      width: 112rpx;
      height: 36rpx;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      border: 1rpx solid #fd505e;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 500;
        font-size: 24rpx;
        color: #fd505e;
      }
    }
    .msg {
      display: flex;
      flex-direction: column;
      // align-items: center;
      // justify-content: space-between;
      &.column {
        // flex: 1;
        align-items: flex-start;
        flex-direction: column;

        // .price-box {
        //   padding-top: 10rpx;
        // }
      }
      .price-box {
        flex: 1;
        @include flex(row);
        align-items: center;
        .price-text {
          @include flex(row);
          align-items: center;
          .text {
            // display: inline-block;
            font-weight: 400;
            font-size: 22rpx;
            border: 2rpx solid #f4f5f6;
            padding: 2rpx 12rpx;
            // box-sizing: border-box;
          }
          &.original-price {
            .text {
              font-size: 22rpx;

              color: $app-main-color;
            }
          }
          &.bargain-price {
            margin-left: 8rpx;
            .text {
              font-size: 22rpx;

              color: #f42a2a;
            }
          }
        }
      }

      .price {
        @include flex;
        align-items: flex-end;
        position: relative;
        bottom: -4rpx;
        .mark {
          font-weight: 600;
          font-size: 22rpx;
          color: #1a1a1a;
          margin-right: 2rpx;
          // padding-bottom: 4rpx;
          position: relative;
          bottom: 3rpx;
        }
        .text {
          position: relative;
          top: 2rpx;
          font-weight: 600;
          font-size: 34rpx;
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>
