<template>
  <view class="pay-list">
    <template v-for="item in payMethodItems" :key="item.payMethod">
      <view
        :class="{
          row: true,
          'coin-item': true,
          disabled: userStore.platformCurrency <= 0,
        }"
        @click="handleSelectCoinPay(item)"
      >
        <view class="row list" style="align-items: flex-start">
          <u--image
            class="img"
            width="48rpx"
            height="48rpx"
            :src="
              userStore.platformCurrency <= 0
                ? '/static/images/common/icon_tcoin_pay_disabled.png'
                : '/static/images/common/icon_tcoin_pay.png'
            "
          />
          &nbsp;
          <view style="padding-top: 8rpx">
            <view class="detail">
              <text class="name">{{ item.name }}</text>
              <text class="name"
                >(可用¥ {{ priceFormat(userStore.platformCurrency, 2) }})</text
              >
            </view>
            <view
              v-if="selectPayMethod.payMethod && totalPrice && !isEnoughCoin"
              class="tips"
            >
              <text class="text"
                >余额不足，需组合支付，再选择另一种方式支付剩余金额￥{{
                  priceFormat(totalPrice - userStore.platformCurrency, 2)
                }}</text
              >
            </view>
          </view>
        </view>

        <view class="checkbox" style="top: 24rpx; transform: none">
          <u--image
            class="img"
            width="48rpx"
            height="48rpx"
            bgColor="transparent"
            :showLoading="false"
            :src="
              item.payMethod == selectPayMethod.payMethod
                ? '/static/images/common/icon_radio_active.png'
                : '/static/images/common/icon_radio.png'
            "
          />
        </view>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { priceFormat } from "@/utils/index";
import { PayPanel } from "@/enums/common";

const props = defineProps({
  type: {
    type: String,
    default: PayPanel.Other_PAY,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const userStore = useUserStore();

onMounted(() => {
  // userStore.selectedPayMethod.coinCharge = {};
});

const payMethodItems = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.penaltyMethodData.coinCharge;
  } else {
    return userStore.payMethodData.coinCharge;
  }
});

const selectPayMethod = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.selectedPenaltyMethod.coinCharge;
  } else {
    return userStore.selectedPayMethod.coinCharge;
  }
});

const way3Charge = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    if (userStore.penaltyMethodData.hasWay3Charge) {
      return userStore.penaltyMethodData.way3Charge[0];
    }
  } else if (props.type === PayPanel.Other_PAY) {
    if (userStore.payMethodData.hasWay3Charge) {
      return userStore.payMethodData.way3Charge[0];
    }
  }
  return {};
});

// const coinChargeItems = computed(() => {
//   const pays =
//     userStore.currentPay === PayPanel.PENALTY_PAY
//       ? userStore.penaltyInfo
//       : userStore.payInfo;
//   return pays.filter((el) => el.payMethod === PaymentType.TCOIN);
// });

// 余额是否足够
const isEnoughCoin = computed(() => {
  return userStore.platformCurrency >= props.totalPrice;
});

const handleSelectPenalty = (values) => {
  const { payMethod } = userStore.selectedPenaltyMethod.coinCharge;
  if (payMethod) {
    userStore.selectedPenaltyMethod.coinCharge = {};
    userStore.selectedPenaltyMethod.way3Charge = way3Charge.value;
  } else {
    userStore.selectedPenaltyMethod.coinCharge = values;
    // 余额足够时，三方支付不选中
    if (isEnoughCoin.value) {
      userStore.selectedPenaltyMethod.way3Charge = {};
    } else {
      userStore.selectedPenaltyMethod.way3Charge = way3Charge.value;
    }
  }
};

const handleSelectProduct = (values) => {
  const { payMethod } = userStore.selectedPayMethod.coinCharge;
  if (payMethod) {
    userStore.selectedPayMethod.coinCharge = {};
    userStore.selectedPayMethod.way3Charge = way3ChargePay.value;
  } else {
    userStore.selectedPayMethod.coinCharge = values;
    // 余额足够时，三方支付不选中
    if (isEnoughCoin.value) {
      userStore.selectedPayMethod.way3Charge = {};
    } else {
      userStore.selectedPayMethod.way3Charge = way3ChargePay.value;
    }
  }
};

const handleSelectCoinPay = (values) => {
  if (userStore.platformCurrency > 0) {
    if (props.type === PayPanel.PENALTY_PAY) {
      handleSelectPenalty(values);
    } else {
      handleSelectProduct(values);
    }
  } else {
    console.log("余额为0，无法余额支付");
  }
};

defineExpose({});
</script>
<style lang="scss" scoped>
.pay-list {
  .flex {
    @include flex(row);
  }
  .row {
    position: relative;
    @include flex(row);
    align-items: center;
    justify-content: space-between;
  }

  .coin-item {
    .checkbox {
      position: absolute;
      right: 0;
      top: 0rpx;
      // top: 50%;
      // transform: translate(0, -50%);
      // .img {

      // }
    }
  }

  .row.disabled {
    .detail {
      .name {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf !important;
      }
    }
  }

  .list {
    position: relative;
    margin: 8rpx 0;
    padding: 12rpx 0;
    padding-right: 60rpx;

    .img {
      margin-right: 24rpx;
    }
    .detail {
      @include flex(row);
      align-items: center;

      .name {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }

    .tips {
      margin-top: 12rpx;
      width: 550rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #ff4b4b;
        line-height: 50rpx;
      }
    }
  }
}
</style>
