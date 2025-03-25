<template>
  <popup ref="popupRef" :title="title">
    <view class="bargain-box" :style="{ paddingBottom: keyboardHeight + 'px' }">
      <view class="price-view">
        <view class="price-box">
          <text class="text yj">原价</text>
          <u--text
            bold
            color="#4A4C5A"
            size="18"
            mode="price"
            align="left"
            :text="+(props.product?.product_price || 0)"
          ></u--text>
        </view>

        <view v-if="bargainParam.bargain_no" class="price-box">
          <text class="text cj">议价</text>
          <u--text
            bold
            color="#4A4C5A"
            size="18"
            mode="price"
            align="left"
            :text="+(bargainParam?.price || 0)"
          ></u--text>
        </view>
      </view>

      <view
        class="price-inp"
        :class="{
          active: bargainPrice,
        }"
      >
        <text v-if="bargainPrice" class="sup">¥</text>
        <!-- <view class="input"> -->
        <u--input
          v-model="bargainPrice"
          :placeholder="placeholder"
          :customStyle="customStyle"
          type="digit"
          border="none"
          color="#1A1A1A"
          fontSize="16px"
          clearable
          :adjustPosition="false"
          :placeholderStyle="placeholderStyle"
          :password="false"
          @change="errTips = ''"
        />
        <!-- </view> -->
        <text class="sub">元</text>
      </view>
      <view class="bargain-count">
        <view v-if="!userStore.userInfo?.merchant_type" class="msg">
          <text class="text">可议价次数</text>
          <text class="num">{{ remainingCount }}</text>
        </view>
        <view v-if="errTips" class="err-tips">
          <u--image
            width="28rpx"
            height="28rpx"
            src="/static/images/common/icon_slices.png"
          />
          <text class="text">{{ errTips }}</text>
        </view>
      </view>
      <view
        class="submit-box"
        :class="{
          active: bargainPrice,
        }"
        @tap="handleSubmit"
      >
        <text class="text">提交</text>
      </view>
    </view>
  </popup>
</template>

<script setup lang="ts">
import type { ProductData } from "@/types/store";
import type { OrderBargainListRes } from "@/types/order";
import { BargainStatus } from "@/enums/order";
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { Bargain } from "../js/bargain";
import Popup from "@/components/popup/index.vue";
import Events, { report } from "@/utils/report/report";

const popupRef = ref<Popup>(null);
const errTips = ref<string>("");
const bargainPrice = ref<number>();
const userStore = useUserStore();
const keyboardHeight = ref(0);
const placeholderStyle = ref<any>({
  fontWeight: 400,
  fontSize: "32rpx",
  color: "#AFAFAF",
});
const customStyle = ref<any>({
  fontWeight: 600,
});

uni.onKeyboardHeightChange &&
  uni.onKeyboardHeightChange((res) => {
    keyboardHeight.value = res.height;
  });

const emits = defineEmits(["reload"]);
const props = withDefaults(
  defineProps<{
    product: ProductData;
    bargainParam?: OrderBargainListRes;
  }>(),
  {
    product: {},
    bargainParam: {},
  }
);

const remainingCount = computed(() => {
  return (
    userStore.userInfo?.remainingCount +
    "/" +
    userStore.userInfo?.globalRemainingCount
  );
});

const title = computed(() => {
  const { bargain_status } = props.bargainParam;
  if (bargain_status === BargainStatus.WAIT_SELLER) {
    return "还价";
  }
  if (bargain_status === BargainStatus.WAIT_BUYER) {
    return "重新出价";
  }
  return "求降价";
});
const placeholder = computed(() => {
  const { bargain_status } = props.bargainParam;
  if (bargain_status === BargainStatus.WAIT_SELLER) {
    return "请输入还价金额";
  }
  return "请输入心里价";
});

const { fetchCreateOrderBargain, fetchAgainOrderBargain } = Bargain();

// 创建议价单
const handleSubmit = async () => {
  const { bargain_status, bargain_no, price } = props.bargainParam;
  if (!bargainPrice.value) return;
  const { product_id, product_price } = props.product;
  if (bargainPrice.value - 0 > product_price - 0) {
    errTips.value = "金额不能高于原价";
    return;
  }
  if (bargainPrice.value - 0 == product_price - 0) {
    errTips.value = "金额不能等于原价";
    return;
  }
  if (bargainPrice.value - 0 < product_price * 0.65) {
    errTips.value = "金额不能低于原价65%";
    return;
  }
  if (
    bargainPrice.value - 0 < price &&
    bargain_status === BargainStatus.WAIT_SELLER
  ) {
    errTips.value = "还价必须高于买家出价";
    return;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(bargainPrice.value)) {
    errTips.value = "金额最多保留两位小数";
    return;
  }

  const msg = "提交成功，可前往“我的-我的砍价”查看详情";

  report(Events.PRODUCT_NEGOTIATE_PRICE_SUBMIT, {
    product_id: product_id,
  });

  if (!bargain_no) {
    const data = await fetchCreateOrderBargain({
      uid: userStore.userInfo.uid,
      product_id: product_id,
      price: bargainPrice.value,
    });
    if (data) {
      uni.$main.toast(msg);
      popupRef.value.close();
      handleReload();
    }
    return;
  }

  if (
    [
      BargainStatus.WAIT_SELLER,
      BargainStatus.WAIT_BUYER,
      BargainStatus.SELLER_REFUSE,
    ].includes(bargain_status)
  ) {
    const data = await fetchAgainOrderBargain({
      bargain_no,
      uid: userStore.userInfo.uid,
      price: bargainPrice.value,
    });
    if (data) {
      uni.$main.toast(msg);
      popupRef.value.close();
      handleReload();
    }
  }
};

const handleReload = () => {
  uni.hideKeyboard();
  userStore.getMyInfoV2({ order_bargain_resp: true, order_unread_resp: true });
  emits("reload");
};

const close = () => {
  popupRef.value.close();
};

const open = () => {
  popupRef.value.open();
};

defineExpose({
  close,
  open,
});
</script>

<style lang="scss" scoped>
.bargain-box {
  .bargain-count {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 14rpx;
    flex: 1;
    .msg {
      display: flex;
      flex-direction: row;
      align-items: center;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #4a4c5a;
      }
      .num {
        font-weight: 500;
        font-size: 28rpx;
        color: $app-main-color;
        margin-left: 5rpx;
      }
    }
    .err-tips {
      @include flex(row);
      align-items: center;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #f42a2a;
        margin-left: 4rpx;
      }
    }
  }
  .price-view {
    display: flex;
    flex-direction: row;
    .price-box {
      flex: 1;
      @include flex(row);
      align-items: center;
      margin-bottom: 24rpx;
      .text {
        font-weight: bold;
        font-size: 32rpx;
        color: #4a4c5a;
        &.yj {
          color: $app-main-color;
        }
        &.cj {
          color: #ff4b4b;
        }
      }
    }
  }
  .price-inp {
    position: relative;
    flex: 1;
    @include flex(row);
    align-items: center;
    justify-content: center;
    height: 96rpx;
    background-color: #f4f5f6;
    padding: 30rpx 20rpx;
    margin-bottom: 10rpx;
    // #ifndef APP-NVUE
    box-sizing: border-box;
    // #endif
    &.active {
      /* padding: 0 50rpx; */
    }
    /* .input {
      flex: 1;
      height: 96rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    } */
    .sup {
      width: 25rpx;
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .sub {
      width: 30rpx;
      margin-left: 10rpx;
    }
  }
  .submit-box {
    width: 686rpx;
    height: 96rpx;
    background-color: #1cc7be;
    border-radius: 8rpx;
    opacity: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    &.active {
      opacity: 1;
    }
    .text {
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
    }
  }
}
</style>
