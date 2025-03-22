<template>
  <popup ref="popupRef" title="卖家须知">
    <view class="explain-popup">
      <scroll-view scroll-y style="height: 480rpx">
        <view class="msg-item">
          <text class="text">
            <text class="text bold">1.</text
            ><text class="text green">
              为保障您的权益，商品换绑后必须签署合同，平台才能进行放款，请持续保持在线，如账号已换绑给买家情况下，签署合同环节失联，账号将由买家游玩，未及时上线签署合同，没有完成交易出现纠纷或损失自行承担。
            </text>
          </text>
        </view>
        <view class="msg-item">
          <text class="text">
            <text class="text bold">2.</text
            ><text class="text">
              若您的游戏账号在多个平台寄售，请保持寄售价格-致，否则账号会被下架;若同一账号多次下单后无理由不交付，默认您有违诚信，平台会下架并联系其他平台拉黑处理该账号。若您寄售的游戏账号在其他地方已出或者不再继续寄售，请务必告知，避免不必要的纠纷
            </text>
          </text>
        </view>
        <view class="msg-item">
          <text class="text">
            <text class="text bold">3.</text
            ><text class="text">
              您若将不合法账号(包括但不限于骗取或本人恶意找回等违法取得情形)放到淘个号平台寄售，淘个号平台会对该账号进行拉黑下架处理，并保留追究法律责任的权利。
            </text>
          </text>
        </view>
        <view class="msg-item">
          <text class="text">
            <text class="text bold">4.</text
            ><text class="text">
              如账号有无法换绑，无法改密等情况交易前或进入交易组后及时告知客服，交付过程出现无法改密等情况导致交付失败，账号安全问题由卖家自行承担。
            </text>
          </text>
        </view>
        <view class="msg-item">
          <text class="text">
            <text class="text bold">5.</text
            ><text class="text">
              禁止搬运他人账号或短时间同账号频繁反复上架本平台，平台会对该账号进行下架处理;<text
                class="text green"
                >情节严重者，平台有权禁止您继续在淘个号平台发布账号。</text
              >
            </text>
          </text>
        </view>

        <view class="msg-item">
          <text class="text">
            <text class="text red bold">注:</text
            >本平台只为年满18周岁的成年人提供账号交易，如果您是未成年擅自使用成年家属身份交易的，平台将视为成年家属自身交易的行为，后续若有损失或交易纠纷，由您自行承担。
          </text>
        </view>
      </scroll-view>
      <view
        class="submit-box"
        :class="{
          active: countdown == 0,
        }"
        @tap="handleAgree"
      >
        <text class="text">我已阅读并同意，立即发布{{ countdownLabel }}</text>
      </view>
    </view>
  </popup>
</template>

<script setup>
import { ref, computed } from "vue";
import popup from "@/components/my-popup/index.vue";
const popupRef = ref(null);
const countdown = ref(6);
const timer = ref(null);
const open = () => {
  countdown.value = 6;
  clearInterval(timer.value);
  popupRef.value.open();
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer.value);
    }
  }, 1000);
};

const emit = defineEmits(["agree"]);

const handleAgree = () => {
  if (countdown.value == 0) {
    clearInterval(timer.value);
    emit("agree");
  }
};
const close = () => {
  popupRef.value.close();
};

const countdownLabel = computed(() => {
  return countdown.value > 0 ? `（${countdown.value}）` : "";
});

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
.explain-popup {
  flex: 1;
  @include flex(column);
  box-sizing: border-box;
  align-items: center;
  padding-top: 24rpx;
  .msg-item {
    margin-bottom: 16rpx;
    flex: 1;
    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #1a1a1a;
      &.bold {
        font-weight: bold;
        font-size: 28rpx;
      }
      &.red {
        color: #f42a2a;
      }
      &.green {
        color: #1cc7be;
      }
    }
  }
  .submit-box {
    width: 100%;
    height: 68rpx;
    background-color: #1cc7be;
    @include flex(column);
    justify-content: center;
    align-items: center;
    opacity: 0.6;
    border-radius: 4rpx;
    margin-top: 24rpx;
    .text {
      font-size: 28rpx;
      color: #fff;
    }
    &.active {
      opacity: 1;
    }
  }
}
</style>
