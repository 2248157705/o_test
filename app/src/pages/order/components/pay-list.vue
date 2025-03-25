<template>
  <view class="pay-list">
    <template v-for="item in payMethodItems" :key="item.payMethod">
      <view class="row way3-item" @click="handleSelectPay(item)">
        <view class="row list">
          <u--image class="img" width="48rpx" height="48rpx" :src="item.img" />
          &nbsp;
          <view class="detail">
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
        <view class="checkbox">
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
import { computed, onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { PayPanel } from "@/enums/common";

const props = defineProps({
  type: {
    type: String,
    default: PayPanel.Other_PAY,
  },
});

const userStore = useUserStore();
const selectedWay3Charge = ref({});

onMounted(() => {
  //
});

const payMethodItems = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.penaltyMethodData.way3Charge;
  } else {
    return userStore.payMethodData.way3Charge;
  }
});

const selectPayMethod = computed(() => {
  if (props.type === PayPanel.PENALTY_PAY) {
    return userStore.selectedPenaltyMethod.way3Charge;
  } else {
    return userStore.selectedPayMethod.way3Charge;
  }
});

// const way3ChargeItems = computed(() => {
//   const payWays =
//     userStore.currentPay === PayPanel.PENALTY_PAY
//       ? userStore.penaltyInfo
//       : userStore.payInfo;
//   return payWays.filter((el) => el.payMethod !== PaymentType.TCOIN);
// });

// const way3ChargePay = computed(() => {
//   if (userStore.selectedPayMethod.way3Charge.payMethod) {
//     return userStore.selectedPayMethod.way3Charge;
//   } else if (selectedWay3Charge.value.payMethod) {
//     return selectedWay3Charge.value;
//   }
//   return way3ChargeItems.value[0];
// });

const handleSelectPay = (values) => {
  selectedWay3Charge.value = values;
  if (props.type === PayPanel.PENALTY_PAY) {
    userStore.selectedPenaltyMethod.way3Charge = values;
  } else {
    userStore.selectedPayMethod.way3Charge = values;
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
