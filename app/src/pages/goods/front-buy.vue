<template>
  <global-view
    bgColor="linear-gradient(to bottom, #ffffff, #FAFAFA)"
    :showBgImage="true"
    bgImage="/static/images/common/global_bg@x2.png"
  >
    <template #bar>
      <u-navbar
        bgColor="transparent"
        title="确认订单"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      />
    </template>
    <view class="front-view">
      <view
        style="
          padding: 12rpx;
          background-color: #fff;
          border-radius: 12rpx 12rpx 0 0;
        "
      >
        <goods-buy-view
          type="personal-list"
          :row="true"
          :product="product"
          :bargain="bargain"
          :flexShrink="true"
        >
          <template #price>
            <u--text
              bold
              color="#1A1A1A"
              size="32rpx"
              mode="price"
              align="left"
              :text="+product.product_price"
            />
          </template>
        </goods-buy-view>
      </view>

      <view
        style="
          margin-top: -12rpx;
          padding-bottom: 24rpx;
          background: #ffffff;
          border-radius: 0 0 12rpx 12rpx;
          box-sizing: border-box;
        "
      >
        <platform-guarantee />
      </view>

      <pay-method :totalPrice="totalPrice" :type="payType" />

      <template v-if="insuranceList.length > 0">
        <view style="margin-top: 40rpx">
          <PlccInfo :list="insuranceList" :price="bargain?.price" />
        </view>

        <InsuranceList
          :list="insuranceList"
          :productPrice="productPrice"
          :active="insuranceActive.id"
          @change="handleChangeInsurance"
        />
      </template>
    </view>

    <good-buy-operation
      ref="operationRef"
      :product="product"
      :bargain="bargain"
      :insuranceActive="insuranceActive"
      :guaranteeRateFormula="guaranteeRateFormula"
      @submit="handleSubmitBuy"
    />

    <purchase-popup ref="purchasePopupRef" />
  </global-view>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { onLoad, onShow, onUnload, onHide } from "@dcloudio/uni-app";
import { BargainStatus } from "@/enums/order";
import { GoodsPurchase } from "@/pages/order/js/purchase";
import GlobalView from "@/components/global-view/index.vue";
import GoodsBuyView from "@/components/goods-item-preview/index.vue";
import InsuranceList from "./components/insurance-list.vue";
import PurchasePopup from "./components/purchase-popup.vue";
import PayMethod from "./components/goods-order/pay-method.vue";
import PlatformGuarantee from "./components/goods-order/platform-guarantee.vue";
import { queryByProductId, getOrderPurchasePreview } from "@/api/order";
import PlccInfo from "./components/goods-order/plcc-info.vue";
import GoodBuyOperation from "./components/good-buy-operation.vue";
import { useUserStore } from "@/stores/user";
import Events, { report } from "@/utils/report/report";
import { PayPanel } from "@/enums/common";
import { OpenType } from "@/enums/button";
import { productPecoveryConfirmProduct } from "@/api/chat";
// import { useMessageStore } from "@/stores/message";

const userStore = useUserStore();
// const messageStore = useMessageStore();
const {
  product,
  purchasePopupRef,
  product_id,
  transaction_type,
  insuranceId,
  reportOrderData,
  fetchOrderPurchasePreview,
  checkH5PayStatus,
  clearCheckPayStatus,
  closeWebview,
} = GoodsPurchase();
const operationRef = ref();

const bargain = ref({});
const insuranceActive = ref({});
const insuranceList = ref([]);
const guaranteeRateFormula = ref("");
const payType = ref(PayPanel.Other_PAY);

onLoad(async (options) => {
  uni.log.info("options", options);
  if (options?.transaction_type === OpenType.MERCHANT) {
    payType.value = PayPanel.MERCHANT_PAY;
  }
  if (options.product_id) {
    transaction_type.value = options?.transaction_type;
    product_id.value = options.product_id;
    userStore.getUserWalletInfo();
    getProductData(options.product_id);
    getBargainData(options.product_id);
  } else {
    uni.navigateTo({ url: "/pages/home/index" });
  }
});
onShow(() => {
  checkH5PayStatus();
});
onUnload(() => {
  closeWebview();
  clearCheckPayStatus();
});

onHide(() => {
  //
});

const productPrice = computed(() => {
  const price = bargain.value?.price || product.value?.product_price;
  return price || 0;
});

// const coinPrice = computed(() => {
//   return operationRef.value?.coinPrice;
// });

const totalPrice = computed(() => {
  return operationRef.value?.totalPrice;
});

//获取议价详情
const getBargainData = async (product_id: string) => {
  const data = await queryByProductId(product_id);
  const status = data?.bid_history?.now_record.status;
  if (
    [
      BargainStatus.FINISH,
      BargainStatus.BUY_AGREE,
      BargainStatus.SELLER_AGREE,
    ].includes(status)
  ) {
    bargain.value = data?.bid_history?.now_record || {};
  }
};
//获取商品详情
const getProductData = async (product_id: string) => {
  const data = await getOrderPurchasePreview({
    product_id: product_id,
  });
  product.value = data.product || {};
  insuranceList.value = data?.insurance_list || [];
  guaranteeRateFormula.value =
    data?.product?.guarantee_payer === "BUYER"
      ? data.guarantee_rate_formula
      : "";

  report(Events.ORDER_VIEW, {
    ...reportOrderData.value,
  });
};

const handleSubmitBuy = () => {
  if (transaction_type.value === OpenType.MERCHANT) {
    // const { coinCharge, way3Charge } = userStore.selectedPayMethod;
    console.log("号商支付", userStore.selectedPayMethod, insuranceActive.value);
    userStore.merchantPayInfo.requestParam = userStore.setMerchantPayInfo({
      ...userStore.merchantPayInfo,
      requestParam: {
        ...userStore.merchantPayInfo.requestParam,
        ...insuranceActive.value,
        insurance_id: insuranceActive.value.id,
      },
    });
    if (totalPrice.value > userStore.platformCurrency) {
      uni.$main.toast("余额不足，请充值!");
      return;
    }
    console.log("cccaaassd:支付参数:", userStore.merchantPayInfo);
    productPecoveryConfirmProduct(userStore.merchantPayInfo.requestParam).then(
      () => {
        uni.$main.toast("提交成功");
        console.log("11111");
        if (userStore.merchantPayInfo.cb) {
          userStore.merchantPayInfo.cb();
        }
        uni.navigateBack({
          delta: 1,
        });
      }
    );

    return;
  }

  fetchOrderPurchasePreview({
    transaction_type: transaction_type.value,
  });
};

const handleChangeInsurance = (item) => {
  insuranceId.value = item.id;
  insuranceActive.value = {
    id: item.id,
    price: item.price || 0,
  };
};
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.front-view {
  @include flex(column);
  padding: 24rpx;
  padding-bottom: 350rpx;

  .insurance-box {
    width: 702rpx;
    background: #ebf5f4;
    border-radius: 4rpx;
    padding: 14rpx 24rpx;
    margin: 40rpx 0;
    box-sizing: border-box;
    .tile {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .msg {
      @include flex(row);
      margin-top: 8rpx;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #606060;
        &.tips {
          color: $app-main-color;
        }
      }
    }
  }
}
</style>
