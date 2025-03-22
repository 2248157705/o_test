<template>
  <popup
    ref="popupRef"
    :title="showDetail ? '价格明细' : ''"
    :closeable="false"
    :closeOnClickOverlay="true"
    :operation="false"
    :overlay="showDetail"
    :popupStyle="popupStyle"
    :duration="0"
    :zIndex="showDetail ? 10075 : 10000"
    @close="handleClose"
  >
    <view v-if="showDetail" class="close" @click="handleClose">
      <u--image
        width="48rpx"
        height="48rpx"
        src="/static/images/common/icon_close_2.png"
      />
    </view>

    <view class="operation">
      <view v-if="showDetail" style="margin-bottom: 140rpx">
        <order-detail
          :productPrice="productPrice"
          :bargainPrice="bargainPrice"
          :insuranceActivePrice="insuranceActivePrice"
          :guaranteePrice="guaranteePrice"
          :coinPrice="coinPrice"
          :totalPrice="payPrice"
        />
      </view>

      <u-checkbox-group
        v-model="checkedAgree"
        :size="15"
        activeColor="#539f9a"
        @change="handleAgreement"
      >
        <view class="read-box" @click="handleAgreement">
          <u-checkbox class="checkbox" shape="circle" activeColor="#1CC7BE" />
          <view class="link-text">
            <text class="text"
              >我已阅读并同意
              <text class="text tips" @click.stop="toTradingRules"
                >《虚拟物品交易规则》、</text
              >
              <text class="text tips" @click.stop="toUserAgreement"
                >《用户服务协议及规则》</text
              >
            </text>
          </view>
        </view>
      </u-checkbox-group>
      <view class="operation-box" :style="{ paddingBottom: safeAreaPadding() }">
        <view class="icon-box">
          <text class="text">合计:</text>
          <u--text
            color="#1A1A1A"
            size="28rpx"
            mode="price"
            :bold="true"
            :text="+(payPrice || 0)"
            align="right"
          ></u--text>
        </view>
        <view class="btn-box">
          <view class="bargaining" @click="handleShowDetail">
            <text class="text">明细&nbsp;</text>
            <u-icon :name="showDetail ? 'arrow-down' : 'arrow-up'"></u-icon>
          </view>

          <view class="buy" @click="handleBuy"
            ><text class="text">立即支付</text></view
          >
        </view>
      </view>
    </view>
  </popup>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { debounce } from "lodash-es";
import { safeAreaPadding } from "@/utils";
import { toUserAgreement, toTradingRules } from "@/utils/index";
import Popup from "@/components/popup/index.vue";
import OrderDetail from "@/pages/goods/components/goods-order/order-detail.vue";
import { useUserStore } from "@/stores/user";
import { evaluate } from "mathjs";

const props = defineProps({
  product: {
    type: Object,
    default: () => {},
  },
  bargain: {
    type: Object,
    default: () => {},
  },
  insuranceActive: {
    type: Object,
    default: () => {},
  },
  guaranteeRateFormula: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", "close"]);

const userStore = useUserStore();

const popupStyle = {
  backgroundColor: "#fff", // 修改背景色
  borderTopLeftRadius: "24rpx", // 修改圆角
  borderTopRightRadius: "24rpx", // 修改圆角
  padding: "32rpx", // 修改内边距
  boxSizing: "border-box", // 修改内边距
  boxShadow: "0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04)",
};

const popupRef = ref();
const checkedAgree = ref([]);
const agreement = ref(false);
const showDetail = ref(false);

const guaranteePrice = computed(() => {
  if (!props.guaranteeRateFormula) {
    return "";
  }
  const str = props.guaranteeRateFormula.replace(
    /#amount/g,
    props.bargain?.price || 0
  );
  return evaluate(str);
});

// 总价格
const totalPrice = computed(() => {
  const { bargain, product } = props;
  const price = bargain.price || product.product_price;
  const g_price = guaranteePrice.value || 0;
  const total = price + insuranceActivePrice.value + g_price;
  return total;
});

// 扣除余额
const coinPrice = computed(() => {
  const { payMethod } = userStore.selectedPayMethod.coinCharge;
  if (payMethod) {
    if (userStore.platformCurrency >= totalPrice.value) {
      return totalPrice.value;
    } else {
      return userStore.platformCurrency;
    }
  }
  return 0;
});

// 实际支付价格
const payPrice = computed(() => {
  const { payMethod } = userStore.selectedPayMethod.coinCharge;
  if (payMethod) {
    if (userStore.platformCurrency >= totalPrice.value) {
      return 0;
    } else {
      return totalPrice.value - userStore.platformCurrency;
    }
  }
  return totalPrice.value;
});

const bargainPrice = computed(() => {
  return props.bargain?.price || 0;
});

const productPrice = computed(() => {
  return props.product?.product_price || 0;
});

const insuranceActivePrice = computed(() => {
  return props.insuranceActive?.price || 0;
});

onMounted(() => {
  popupRef.value?.open();
});

const handleAgreement = () => {
  agreement.value = !agreement.value;
  checkedAgree.value = agreement.value ? [""] : [];
};

const handleShowDetail = () => {
  showDetail.value = !showDetail.value;
};

const handleClose = () => {
  showDetail.value = false;
  popupRef.value?.open();
};

const handleBuy = debounce(async () => {
  if (agreement.value) {
    const { way3Charge, coinCharge } = userStore.selectedPayMethod;
    if (way3Charge.payMethod || coinCharge.payMethod) {
      emit("submit");
    } else {
      uni.$main.toast("请选择支付方式");
    }
  } else {
    // uni.$main.toast(
    //   "请选择阅读并同意《虚拟物品交易规则》、《用户服务协议及规则》"
    // );
    uni.$main.toast("请选择阅读并同意协议");
  }
}, 300);

defineExpose({
  totalPrice,
  coinPrice,
});
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";

.close {
  position: absolute;
  right: 32rpx;
  top: 32rpx;
}
.operation {
  flex: 1;
  @include flex(column);
  // position: fixed;
  // left: 0;
  // right: 0;
  // bottom: 0;
  // padding: 32rpx;
  // box-sizing: border-box;
  // z-index: 50;
  // background: #ffffff;
  // box-shadow: 0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
  // border-radius: 24rpx 24rpx 0rpx 0rpx;

  .read-box {
    @include flex(row);
    margin-bottom: 24rpx;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .checkbox {
      margin-top: 5rpx;
    }
    .link-text {
      @include flex(row);
      display: flex;
      flex-wrap: wrap;
      line-height: 44rpx;
      margin-left: 5rpx;
      flex: 1;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: rgba(0, 0, 0, 0.56);
        display: inline;
        &.tips {
          color: $app-main-color;
        }
      }
    }
  }
  .operation-box {
    @include flex(row);
    justify-content: space-between;
    box-sizing: border-box;
    .icon-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #2b2b2b;
      }
    }
    .btn-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .buy {
        width: 284rpx;
        height: 96rpx;
        background: $app-main-color;
        border-radius: $app-box-radius;
        display: flex;
        align-items: center;
        justify-content: center;
        .text {
          font-weight: 500;
          font-size: 32rpx;
          color: #ffffff;
        }
      }
    }
  }
  .bargaining {
    display: flex;
    align-items: center;
    margin-right: 40rpx;
    .text {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
    }
  }
}
</style>
