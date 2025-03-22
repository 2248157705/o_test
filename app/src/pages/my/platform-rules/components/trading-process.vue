<template>
  <!-- 交易流程 -->
  <view class="trading-process-wrapper content-wrapper">
    <view class="card-box">
      <view class="step-title">
        <text class="en">STEP ONE</text>
        <text class="name">交易流程</text>
      </view>
    </view>
    <view class="process-box">
      <view class="step-box">
        <view class="title">
          <view class="serial-number">
            <text class="text">01</text>
          </view>
          <text class="text">账号发布</text>
        </view>
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line"></view>
        </view>
        <view class="explain"
          ><text class="text">填写账号信息，挂售商品</text></view
        >
      </view>

      <view class="step-box">
        <view class="title">
          <view class="serial-number">
            <text class="text">02</text>
          </view>
          <text class="text">审核上架</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line"></view>
        </view>
        <view class="explain"
          ><text class="text">客服对商品进行审核，审核通过后上架</text></view
        >
      </view>

      <view class="step-box">
        <view class="title">
          <view class="serial-number">
            <text class="text">03</text>
          </view>
          <text class="text">买家下单</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line"></view>
        </view>
        <view class="explain"
          ><text class="text">买家在线付款到淘个号平台</text></view
        >
      </view>

      <view class="step-box">
        <view class="title"
          ><view class="serial-number"> <text class="text">04</text> </view
          ><text class="text">自动拉组</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line" style="height: 100rpx"></view>
        </view>
        <view class="explain"
          ><text class="text"
            >买家付款后系统自动拉群，买家、卖家、客服可在群聊进行沟通</text
          ></view
        >
      </view>

      <view class="step-box">
        <view class="title"
          ><view class="serial-number"> <text class="text">05</text> </view
          ><text class="text">买家验号</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line"></view>
        </view>
        <view class="explain"
          ><text class="text"
            >群聊中，卖家发号，买家验号，查看是否与描述相符</text
          ></view
        >
      </view>

      <view class="step-box">
        <view class="title"
          ><view class="serial-number"> <text class="text">06</text> </view
          ><text class="text">账号换绑</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line" style="height: 90rpx"></view>
        </view>
        <view class="explain"
          ><text class="text"
            >买家验号无误，确认要购买，客服协助买卖双方进行换绑、修改密码、引导签署合同</text
          ></view
        >
      </view>

      <view class="step-box">
        <view class="title"
          ><view class="serial-number"> <text class="text">07</text> </view
          ><text class="text">买家收货</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
          <view class="line" style="height: 90rpx"></view>
        </view>
        <view class="explain"
          ><text class="text"
            >买家确认收货（未确认，系统会在签署合同完成后24小时自动确认收货）</text
          ></view
        >
      </view>

      <view class="step-box">
        <view class="title"
          ><view class="serial-number"> <text class="text">08</text> </view
          ><text class="text">卖家到账</text></view
        >
        <view class="number-box">
          <view class="number"><view class="text"></view></view>
        </view>
        <view class="explain"
          ><text class="text">确认收货后，平台放款至卖家账户余额</text></view
        >
      </view>
    </view>

    <view class="attention-instructions">
      <text class="take-care text">注：</text>
      <view class="instructions">
        <text class="text"
          >1.交易账号换绑期间及换绑完成后24小时内建议买卖双方不要对该账号进行任何形式的充值和消费，否则引起的一切纠纷与平台无关。</text
        >
        <text class="text"
          >2.账号如发生冻结或异常等造成不能使用的情况平台只能协助处理,有无法解冻的可能,由账号绑定方承担。</text
        >
      </view>
    </view>
  </view>
</template>
<style lang="scss" scoped>
@import "./common.scss";
.trading-process-wrapper {
  $lineHeight: 40rpx;
  .process-box {
    @include flex(column);
    align-items: center;
    margin: 20rpx 0;
    padding: 40rpx 20rpx;

    background-color: rgba(244, 245, 246, 0.4);
    border-radius: 4rpx;
    .step-box {
      @include flex;
      .title {
        width: 180rpx;
        @include flex;

        .text {
          text-align: center;
          font-size: 28rpx;
          color: #000000;
          font-weight: 500;
        }
      }
      .number-box {
        width: 100rpx;
        @include flex(column);
        align-items: center;
        justify-content: start;

        .number {
          border-radius: 50rpx;
          width: 28rpx;
          height: 28rpx;
          @include flex;
          align-items: center;
          justify-content: center;
          width: 28rpx;
          height: 28rpx;
          background: #d8dddd;

          .text {
            width: 12rpx;
            height: 12rpx;
            border-radius: 50rpx;
            background-color: #000000;
          }
        }
        .line {
          border-radius: 50rpx;
          background-color: #afafaf;
          height: 60rpx;
          width: 1rpx;
          margin: 10rpx;
        }
      }
      .explain {
        margin-top: -4rpx;
        @include flex(columns);
        width: 400rpx;
        flex-wrap: wrap;
        .text {
          font-size: 28rpx;
          color: #606060;
          line-height: $lineHeight;
        }
      }
    }
  }
}
</style>
