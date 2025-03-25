<template>
  <view class="compensation">
    <view class="compensation-item">
      <view class="account-info">
        <view class="info-item" style="margin-bottom: 0; padding-bottom: 0">
          <text class="title"> 商品描述</text>
          <view class="value-box">
            <template v-for="(item, index) in infoList" :key="index">
              <view
                class="value-list"
                :class="{
                  end: (index + 1) % 2 == 0,
                  long: props.type == ProductTypeEnum.VALUATION,
                }"
              >
                <text class="name">{{ item.label }}</text>

                <view class="value">
                  <u--text
                    :lines="2"
                    lineHeight="18"
                    size="14"
                    :bold="true"
                    :text="item.value"
                    color="#1A1A1A"
                  ></u--text>
                </view>
              </view>
            </template>
          </view>
        </view>
        <template v-for="(item, index) in dotList" :key="index">
          <view class="info-item dot-item">
            <view class="title-box">
              <text class="title">{{ item.label }}</text>
              <text class="sup">共 {{ item.value.length }}个 </text>
            </view>
            <view class="value-box">
              <template v-for="(valueItem, i) in item.value" :key="i">
                <view
                  class="info-list"
                  :class="{
                    end: (i + 1) % 3 == 0,
                    long: props.type == ProductTypeEnum.VALUATION,
                  }"
                >
                  <text class="value-text">{{ valueItem }}</text>
                </view>
              </template>
            </view>
          </view>
        </template>

        <view v-if="props.product.product_desc" class="info-item seller-info">
          <text class="title">卖家自述</text>
          <text class="text">{{ props.product.product_desc }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { ProductData } from "@/types/store";
import { useGameStore } from "@/stores/game";
import { parseGoodsInfo } from "@/gameData";
import { ProductTypeEnum } from "@/enums/product";

const gameStore = useGameStore();

const props = withDefaults(
  defineProps<{
    product: ProductData;
    type?: ProductTypeEnum;
  }>(),
  {
    product: {},
    type: ProductTypeEnum.ACCOUNT,
  }
);

const dotList = ref([]);
const infoList = ref([]);
onMounted(() => {
  const { product } = props;
  if (!gameStore.gameDetail[product.game_id]) {
    gameStore.assembleGameForm(product.game_id);
  }
});

const setDot = () => {
  const { product } = props;
  const parse = parseGoodsInfo(
    product.goods_info,
    gameStore.gameDetail[product.game_id].gameFormData
  );

  dotList.value = parse.filter((item) => item.type == "checkbox");
  infoList.value = [
    {
      label: "游戏",
      value: product.game_name,
    },
  ].concat(parse.filter((item) => item.type == "radio"));
};
setDot();
</script>
<style lang="scss" scoped>
.compensation {
  .account-info {
    border-radius: $app-image-radius;
    .info-item {
      background-color: #fff;
      padding: 24rpx;
      /* #ifndef APP-PLUS */
      box-sizing: border-box;
      /* #endif */
      margin-bottom: 16rpx;
      @include flex(column);
      .title {
        font-weight: 600;
        font-size: 32rpx;
        color: #1a1a1a;
        border-radius: 12rpx;
        margin-bottom: 16rpx;
      }
      .value-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .value-list {
          display: flex;
          flex-direction: row;
          width: 292rpx;
          height: 88rpx;
          justify-content: center;
          align-items: center;
          background: #f4f5f6;
          margin-bottom: 4rpx;
          margin-right: 4rpx;
          padding: 0 16rpx;
          /* #ifndef APP-PLUS */
          box-sizing: border-box;
          /* #endif */
          &.end {
            margin-right: 0;
          }
          &.long {
            width: 325rpx;
          }
          .name {
            font-weight: 400;
            font-size: 28rpx;
            color: #606060;
            width: 120rpx;
            margin-right: 24rpx;
          }
          .value {
            flex: 1;
            font-weight: 500;
            font-size: 28rpx;
            color: #1a1a1a;
          }
        }
      }
      .question {
        @include flex(column);
        margin-bottom: 24rpx;
        &.end {
          margin: 0;
        }
        .name {
          font-weight: 400;
          font-size: 28rpx;
          color: #1a1a1a;
        }
        .tips {
          font-weight: 400;
          font-size: 24rpx;
          color: #606060;
          line-height: 44rpx;
        }
      }
      &.seller-info {
        .text {
          background: #f4f5f6;
          border-radius: 8rpx;
          padding: 24rpx;
          /* #ifndef APP-PLUS */
          box-sizing: border-box;
          word-wrap: break-word;
          /* #endif */
          font-weight: 400;
          font-size: 28rpx;
          color: #1a1a1a;
        }
      }
      &.dot-item {
        margin: 0;
        .title-box {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 16rpx;

          .title {
            font-weight: 600;
            font-size: 32rpx;
            color: #1a1a1a;
            border-radius: 12rpx;
            margin-bottom: 0;
          }
          .sup {
            font-weight: 400;
            font-size: 28rpx;
            color: #606060;
            padding-left: 8rpx;
          }
        }
        .value-box {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .info-list {
            width: 215rpx;
            height: 88rpx;
            background: #f4f5f6;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 4rpx;
            margin-bottom: 4rpx;
            &.end {
              margin: 0;
            }
            .value-text {
              font-weight: 400;
              font-size: 28rpx;
              color: #606060;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>
