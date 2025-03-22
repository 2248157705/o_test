<template>
  <popup-view ref="modifyPopupRef" title="修改价格">
    <view class="put-popup">
      <view class="price-inp">
        <text class="sup">商品价格</text>
        <u--input
          v-model="price"
          placeholder="请输入价格"
          :customStyle="customStyle"
          type="digit"
          bold
          border="none"
          color="#1A1A1A"
          fontSize="40rpx"
          clearable
          :adjustPosition="true"
          :placeholderStyle="placeholderStyle"
          :password="false"
          @change="errTips = ''"
        />
        <!-- </view> -->
        <text class="sub">元</text>
      </view>
      <view class="price-msg">
        <view class="service">
          <text class="text">预估服务费：</text>
          <text
            class="text"
            :class="{
              original: showCost,
            }"
            >{{ serviceFee }}元</text
          >
          <text v-if="showCost" class="text current"
            >{{ getToFixed(serviceFee * costData.discount) }}元</text
          >
        </view>
        <view class="service">
          <text class="text">预估到手：</text>
          <text
            class="text"
            :class="{
              original: showCost,
            }"
            >{{ actualPrice }}元</text
          >
          <text v-if="showCost" class="text current"
            >{{ getToFixed(price - serviceFee * costData.discount) }}元</text
          >
        </view>

        <view class="cost">
          <text class="text orange"
            >服务费=成交金额*{{ costData.fee_rate * 100 }}%，上限{{
              costData.max_fee
            }}元，最低{{ costData.min_fee }}元</text
          >
          <text v-if="showCost" class="text hong"
            >享{{ costData.discount * 10 }}折</text
          >
        </view>
      </view>
      <view v-if="errTips" class="err-tips">
        <u--image
          width="28rpx"
          height="28rpx"
          src="/static/images/common/icon_slices.png"
        />
        <text class="text">{{ errTips }}</text>
      </view>
      <view class="submit-box" @click="handleModify">
        <text class="text">确认修改</text>
      </view>
    </view>
  </popup-view>
</template>
<script setup lang="ts">
import type { ProductData } from "@/types/store";
import { RateConfigStatus } from "@/enums/order";
import { ref, computed } from "vue";
import { verifyPrice } from "@/components/enter-form/test";
import popupView from "@/components/popup/index.vue";
import { editProductPrices, getCurProductRule } from "@/api/product";
// import { useUserStore } from "@/stores/user";
// import * as math from "mathjs";
import { Parser } from "expr-eval";
// const userStore = useUserStore();
const errTips = ref<string>("");
const price = ref<number>();
const costData = ref({});

const props = withDefaults(
  defineProps<{
    product: ProductData;
  }>(),
  {
    product: {},
  }
);

const placeholderStyle = ref<any>({
  fontWeight: 400,
  fontSize: "32rpx",
  color: "#AFAFAF",
});

const showCost = computed(() => {
  return costData.value.discount < 1;
});

const getToFixed = computed(() => {
  return (value) => {
    if (!value) return 0;
    return value.toFixed(2);
  };
});

const serviceFee = computed(() => {
  if (!price.value) return 0;
  const context = {
    amount: price.value,
  };
  // 替换 #符号变量为实际变量
  const variables = Object.keys(context);
  const { min_fee, max_fee, rate_formula } = costData.value;
  let test = null;
  for (const variable of variables) {
    const regex = new RegExp(`#${variable}`, "g");
    test = rate_formula.replace(regex, context[variable]);
  }
  // const comPrice = math.evaluate(test);
  const parser = new Parser();
  const comPrice = parser.evaluate(test);
  if (comPrice < min_fee) return min_fee;
  if (comPrice > max_fee) return max_fee;
  return comPrice.toFixed(2);
});
const actualPrice = computed(() => {
  if (!price.value || !serviceFee.value) return 0;
  if (serviceFee.value - 0 > price.value - 0) return 0;
  return (price.value - serviceFee.value).toFixed(2);
});

const customStyle = ref<any>({
  fontWeight: "bold",
});
const modifyPopupRef = ref(null);
const close = () => {
  modifyPopupRef.value.close();
};

const open = () => {
  getCurProductRule({
    product_id: props.product.product_id,
    biz_type: RateConfigStatus.SERVICE_CHARGE,
  }).then((res) => {
    costData.value = res;
  });
  modifyPopupRef.value.open();
};
const emits = defineEmits(["reload"]);

const handleModify = async () => {
  if (!verifyPrice(price.value)) {
    uni.$main.toast("价格应在50～999999元之间，最多保留两位小数");
    return;
  }
  const { product_id } = props.product;
  await editProductPrices({ productId: product_id, price: price.value });
  uni.$main.toast("修改成功");
  emits("reload", price.value);
};

defineExpose({
  close,
  open,
});
</script>

<style lang="scss" scoped>
.put-popup {
  flex: 1;
  display: flex;
  flex-direction: column;
  .title {
    flex: 1;
    margin-bottom: 24rpx;
    display: flex;
    justify-content: flex-start;
    .text {
      font-weight: 600;
      color: #1a1a1a;
      font-size: 32rpx;
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
    .sup {
      width: 150rpx;
      font-weight: 600;
      font-size: 32rpx;
      text-align: center;
      color: #1a1a1a;
    }
    .sub {
      width: 30rpx;
      margin-left: 10rpx;
    }
  }
  .price-msg {
    padding: 24rpx;
    background-color: #fafbfc;
    border-radius: $app-box-radius;
    margin-top: 24rpx;
    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #606060;
      line-height: 28rpx;
      // display: block;
      margin-bottom: 16rpx;
      &.orange {
        color: #f4872a;
      }
      &.hong {
        margin-left: 15rpx;
        color: #f87d6f;
      }
    }
    .cost {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .service {
      display: flex;
      flex-direction: row;
      align-items: center;
      .original {
        text-decoration: line-through;
      }
      .current {
        margin-left: 15rpx;
      }
    }
  }
  .err-tips {
    flex: 1;
    @include flex(row);
    align-items: center;
    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #f42a2a;
      margin-left: 4rpx;
    }
  }
  .submit-box {
    width: 686rpx;
    height: 96rpx;
    background-color: #1cc7be;
    border-radius: $app-box-radius;
    opacity: 1;
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
