<template>
  <u-overlay :show="show" @tap="close">
    <view class="popup-rule">
      <view class="warp" @tap.stop>
        <image class="bg" src="/static/images/raffle/raffle_rule_bg.png" />
        <view class="rule-content">
          <view class="item item-1">
            <image
              class="title"
              src="/static/images/raffle/raffle_rule_title1.png"
            />
            <text class="text"
              >本次抽奖旨在回馈我们的忠实用户，为您的游戏体验增添更多乐趣。请仔细阅读以下规则。</text
            >
          </view>
          <view class="item item-2">
            <image
              class="title"
              src="/static/images/raffle/raffle_rule_title2.png"
            />

            <view class="text-box">
              <view class="icon"></view>
              <text class="text">年满18岁的实名用户每日可享3次抽奖机会。</text>
            </view>
            <view class="text-box">
              <view class="icon"></view>
              <text class="text">奖品随机抽取，公平公正。</text></view
            >
            <view class="text-box">
              <view class="icon"></view>
              <text class="text"
                >中奖者须于开奖后的3个正常工作日内，联系客服领取奖品，超时视为自动放弃奖品。</text
              ></view
            >
          </view>
          <view class="item item-3">
            <image
              class="title"
              src="/static/images/raffle/raffle_rule_title3.png"
            />

            <view class="text-box">
              <view class="icon"></view>
              <text class="text">抽奖结果即时揭晓，敬请关注系统通知。</text>
            </view>
            <view class="text-box">
              <view class="icon"></view>
              <text class="text">获奖账号不适用包赔政策。</text></view
            >
          </view>
          <view class="item item-4">
            <image
              class="title"
              src="/static/images/raffle/raffle_rule_title4.png"
            />

            <view class="text-box">
              <view class="icon"></view>
              <text class="text"
                >一旦参与，即表示您同意遵守本活动的所有规则。</text
              >
            </view>
            <view class="text-box">
              <view class="icon"></view>
              <text class="text">淘个号保留对本次活动的最终解释权。</text></view
            >
            <view class="text-box">
              <view class="icon"></view>
              <text class="text"
                >对于任何试图操纵中奖结果的行为，我们有权取消其参与资格并追究法律责任。</text
              ></view
            >
          </view>
        </view>
      </view>
      <image
        class="close"
        src="/static/images/raffle/raffle_rule_close.png"
        @tap="close"
      />
    </view>
  </u-overlay>
</template>

<script setup>
import { watch, ref } from "vue";
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

const show = ref(props.show);

const emits = defineEmits(["close"]);

const close = () => {
  emits("close");
};

watch(
  () => props.show,
  (val) => {
    show.value = val;
  },
  {
    deep: true,
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
.popup-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  position: relative;
  .close {
    width: 58rpx;
    height: 63rpx;
    /* position: absolute; */
    /* bottom: 50%; */
  }
  .warp {
    /* flex: 1; */
    height: 1095rpx;
    position: relative;
    padding: 0 107rpx;
    padding-top: 324rpx;
    .bg {
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      flex: 1;
    }

    .rule-content {
      flex: 1;
      .item {
        .title {
          width: 131rpx;
          height: 34rpx;
          margin-bottom: 10rpx;
        }
        .text {
          font-weight: 400;
          font-size: 22rpx;
          color: #434343;
          line-height: 28rpx;
        }
        .text-box {
          display: flex;
          flex-direction: row;
          /* align-content: center; */
          .icon {
            width: 7rpx;
            height: 7rpx;
            background: #f7dead;
            border-radius: 50%;
            margin-right: 11rpx;
            margin-top: 12rpx;
          }
          .text {
            width: 496rpx;
            line-height: 38rpx;
            /* width: 100rpx; */
          }
        }
        &-1 {
          margin-bottom: 52rpx;
        }
        &-3 {
          margin: 24rpx 0;
        }
      }
    }
  }
}
</style>
