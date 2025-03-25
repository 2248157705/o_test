<template>
  <view class="compensation">
    <view class="compensation-item">
      <text class="title">注意：</text>
      <view class="desc">
        <text class="text">
          1.
          <text class="strong">平台在处理周期(十五日)内追回账号</text>
          ，号主需无条件接受账号(再发生找回事件平台还会继续进行售后流程)，如在处理周期(十五日)内追回游戏账号，号主拒收账号将视为默认放弃包赔服务，
          <text class="strong"> 如号主需要维权平台将辅助维权，并非主导 </text>。
        </text>
        <text class="text">
          2.找回包赔在完成交易后起365天内，被找回且账号发生找回后15天内无法追回（账号购买后没转手），都无条件补偿，若买家谎称账号被找回或隐瞒账号已转手，按诈骗处理。
        </text>
        <text class="text">
          3.
          <text class="strong">
            找回包赔只针对于“账号找回”行为生效，请广大用户妥善保管自己购入的游戏账号，找回包赔不对盗号、骗号、封号、冻结等形式受损生效
          </text>
          ，淘个号平台售后也会视具体情况对受损买家进行最大程度上的协助。
        </text>
        <text class="text">
          4. 购买包赔服务的订单，若经平合核实确定，
          <text class="strong">
            在交易完成后账号被卖家或他人申诉找回，导致账号无法正常登录的，卖家需配合平台完成售后退款事宜。
          </text>
          未购买包赔服务的订单，平台售后也会协助追偿追损。
        </text>
        <text class="text">
          5.
          若您淘个号购买不可二次账号(仅限一年内购买账号)，因实名被删除导致被封禁一个月，由于厂商机制，该封禁无法申请时间减免，因此情况属于偶发事件，发生概率仅为2%，发生此情况，平台将协助处理。
        </text>
        <text class="text">
          6.
          本平台只为年满18周岁的成年人提供账号交易，如果您是未成年擅自使用成年家属身份交易的，平台将视为成年家属自身交易的行为，后续若有损失或交易纠纷，由您自行承担。
        </text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ProductTypeEnum } from "@/enums/product";
withDefaults(
  defineProps<{
    type?: ProductTypeEnum;
  }>(),
  {
    type: ProductTypeEnum.ACCOUNT,
  }
);
</script>
<style lang="scss" scoped>
.compensation {
  margin-bottom: 16rpx;
  background-color: #fff;
  border-radius: $app-image-radius;
  .compensation-item {
    padding: 16rpx 24rpx;
    .flow {
      width: 100%;
    }
    .title-item {
      font-weight: bold;
      font-size: 32rpx;
      color: #1a1a1a;
      display: block;
    }
    .title {
      display: block;
      margin-bottom: 12rpx;
      line-height: 44rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
      .xing {
        color: $app-main-color;
        margin-right: 6rpx;
      }
    }

    .text {
      display: block;
      font-weight: 400;
      font-size: 28rpx;
      color: #606060;
      line-height: 50rpx;
      &.box {
        padding: 24rpx;
        background-color: rgba(244, 246, 246, 0.3);
        border-radius: $app-box-radius;
        border: 2rpx solid #f4f5f6;
      }
      &.bold {
        font-weight: 600;
      }
    }

    .desc {
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #606060;
      }
    }
    .strong {
      color: #1a1a1a;
    }
  }
}
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
</style>
