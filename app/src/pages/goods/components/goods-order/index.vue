<template>
  <view>
    <u-popup
      v-model:show="visible"
      :custom-style="popupStyle"
      :overlay="true"
      @close="close"
    >
      <view class="title">
        <text class="txt">确认订单</text>
        <view class="close" @click="close">
          <u--image
            width="48rpx"
            height="48rpx"
            src="/static/images/im/close.png"
          />
        </view>
      </view>
      <scroll-view scroll-y="true" class="scroll-Y" @touchmove.stop>
        <view class="good-buy-view">
          <view class="popup-content">
            <goods-buy-view
              :product="product"
              :bargain="product?.order_bargain"
            />
            <view
              style="
                padding: 18rpx 24rpx;
                background: #ffffff;
                border-radius: 0 0 12rpx 12rpx;
                box-sizing: border-box;
              "
            >
              <platform-guarantee />
            </view>

            <pay-method />

            <purchase-notes />
            <PlccInfo :list="insuranceList" :price="product?.product_price" />

            <!-- <view class="contract-box">
              <view class="hand">
                <view class="title">
                  <text class="text">选择包赔</text>
                  <image
                    class="img"
                    src="/static/images/common/icon_help.png"
                  />
                </view>
                <text class="right">选择包赔</text>
              </view>
            </view> -->
            <InsuranceList
              :list="insuranceList"
              :productPrice="product?.product_price"
              :active="insuranceActive.id"
              @change="handleChangeInsurance"
            />
          </view>
        </view>
      </scroll-view>

      <view class="operation-box">
        <view v-if="showOrderDetail">
          <order-detail-popup
            ref="orderDetailRef"
            :productPrice="product?.product_price"
            :bargainPrice="product?.order_bargain?.price"
            :insuranceActivePrice="insuranceActive?.price"
            :totalPrice="totalPrice"
          />
        </view>
        <u-checkbox-group
          v-model="checkedAgree"
          style="width: 702rpx"
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
        <view class="flex detail">
          <view class="flex bargaining" @click="handleBar">
            <text class="text">明细</text>
            <u-icon v-if="showOrderDetail" name="arrow-up"></u-icon>
            <u-icon v-else name="arrow-down"></u-icon>
            <!-- <u--image
              width="36rpx"
              height="36rpx"
              src="/static/images/common/icon_bottom.png"
            /> -->
          </view>
          <view class="flex">
            <text>合计:</text>
            <u--text
              bold
              color="#1A1A1A"
              size="16"
              mode="price"
              :text="+(totalPrice || 0)"
              align="right"
            ></u--text>
          </view>
        </view>
        <view class="btn-box">
          <view class="buy" @click="handleBuy">
            <text class="text">立即支付</text>
          </view>
        </view>
      </view>
    </u-popup>
    <!-- <order-detail-popup
      ref="orderDetailRef"
      :productPrice="product?.product_price"
      :bargainPrice="product?.order_bargain?.price"
      :insuranceActivePrice="insuranceActive?.price"
      :totalPrice="totalPrice"
    /> -->
    <purchase-popup ref="purchasePopupRef" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { debounce } from "lodash-es";
import { GoodsPurchase } from "@/pages/order/js/purchase";
import { useUserStore } from "@/stores/user";
// import { getOrderPurchasePreview } from "@/api/order";
import GoodsBuyView from "../goods-buy-view.vue";
import InsuranceList from "../insurance-list.vue";
import PurchasePopup from "../purchase-popup.vue";
import OrderDetailPopup from "./order-detail.vue";
import PayMethod from "./pay-method.vue";
import PurchaseNotes from "./purchase-notes.vue";
import PlatformGuarantee from "./platform-guarantee.vue";
import PlccInfo from "./plcc-info.vue";
import { toUserAgreement, toTradingRules } from "@/utils/index";

const props = defineProps({
  product: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const userStore = useUserStore();
const {
  purchasePopupRef,
  product_id,
  insuranceId,
  fetchOrderPurchasePreview,
  checkH5PayStatus,
  clearCheckPayStatus,
  closeWebview,
} = GoodsPurchase();

const orderDetailRef = ref();
const showOrderDetail = ref(false);

const popupStyle = {
  backgroundColor: "#f7f9fa", // 修改背景色
  borderRadius: "20rpx", // 修改圆角
  padding: 0,
};

// const emit = defineEmits(["change"]);
// const ddd = () => {}

const visible = ref(false);
const insuranceActive = ref(0);

const totalPrice = computed(() => {
  const { order_bargain } = props.product;
  const price = order_bargain?.price || props.product.product_price;
  return Number(price) + (insuranceActive.value.price || 0);
});

watch(
  () => props.product,
  async (values) => {
    if (values && values.product_id) {
      product_id.value = values.product_id;
      // initOrderPurchasePreview();
    } else {
      product_id.value = "";
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

const insuranceList = ref([]);
const open = (data) => {
  visible.value = true;
  insuranceList.value = data?.insurance_list || [];
};

const close = () => {
  visible.value = false;
};

const handleBar = () => {
  showOrderDetail.value = !showOrderDetail.value;
  // orderDetailRef.value.open();
};

const handleChangeInsurance = (item) => {
  insuranceId.value = item.id;
  insuranceActive.value = {
    id: item.id,
    price: item.price || 0,
  };
};

const agreement = ref(false);
const checkedAgree = ref([]);
const handleAgreement = () => {
  agreement.value = !agreement.value;
  checkedAgree.value = agreement.value ? [""] : [];
};

const handleBuy = debounce(async () => {
  if (agreement.value) {
    const { code, payMethod } = userStore.selectedPayMethod.way3Charge;
    if (code && payMethod) {
      fetchOrderPurchasePreview();
    } else {
      uni.$main.toast("请选择支付方式");
    }
  } else {
    uni.$main.toast(
      "请选择阅读并同意《虚拟物品交易规则》、《用户服务协议及规则》"
    );
  }
}, 300);

defineExpose({
  open,
  close,
  checkH5PayStatus,
  closeWebview,
  clearCheckPayStatus,
});
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";

:deep(.contract-box) {
  .hand {
    .img {
      position: relative;
      top: -21rpx;
    }
  }
}
.title {
  padding: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 24rpx 24rpx 0rpx 0rpx;

  .txt {
    font-weight: 600;
    font-size: 32rpx;
    color: #1a1a1a;
  }

  .close {
    position: absolute;
    right: 30rpx;
  }
}

.scroll-Y {
  height: 900rpx;
}

.popup-content {
  padding: 24rpx;
  background: #f7f9fa;
}

.good-buy-view {
  .form-box {
    padding: 18rpx 24rpx;
    margin-top: 16rpx;
    background: #ffffff;
    border-radius: 12rpx;
    box-sizing: border-box;
  }
}

.operation-box {
  padding: 24rpx;
  background: #ffffff;
  border-top: 4rpx solid #f0f0ff;
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
  .flex {
    @include flex(row);
    justify-content: space-between;
    align-items: center;
  }

  .detail {
    margin-bottom: 30rpx;
  }

  .buy {
    height: 96rpx;
    background-color: $app-main-color;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;

    .text {
      font-weight: 500;
      font-size: 32rpx;
      color: #fff;
    }
  }
}
</style>
