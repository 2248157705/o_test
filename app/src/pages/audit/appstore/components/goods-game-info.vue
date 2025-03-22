<template>
  <view class="compensation">
    <view class="compensation-item">
      <view class="account-info">
        <view class="info-item" style="margin-bottom: 0; padding-bottom: 0">
          <text class="title"> 商品描述</text>
          <view>
            <text>{{ props.product.product_title }}</text>
          </view>
        </view>

        <view v-if="props.product.product_desc" class="info-item seller-info">
          <text class="title">卖家自述</text>
          <text class="text">{{ props.product.product_desc }}</text>
        </view>
        <view v-if="props.type == ProductTypeEnum.ACCOUNT" class="info-item">
          <text class="title">常见问题</text>
          <view class="question">
            <text class="name">Q:怎么联系商家？</text>
            <text class="tips">答: 在商品页面，点击“客服”即可与商家联系。</text>
          </view>
          <view class="question">
            <text class="name">Q:商品交易流程</text>
            <text class="tips"
              >答:下单-填写地址-平台发货-确认收货-订单完成</text
            >
          </view>
          <view class="question">
            <text class="name">Q:购买的商品出现质量问题如何处理？</text>
            <text class="tips"
              >答: 商品有质量问题支持7天退货、15天内换货、质保期内保修。</text
            >
          </view>
          <view class="question end">
            <text class="name">Q:如何取消订单？</text>
            <text class="tips"
              >答:
              订单在“待付款”、“未发货”状态下，您可以进入“我的订单”，点击“取消”按钮直接取消订单</text
            >
          </view>
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
