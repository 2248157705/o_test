<template>
  <put-popup-view ref="putPopupRef" title="重新上架">
    <view class="put-popup">
      <view class="title">
        <text class="text">申请重新上架说明</text>
      </view>
      <view class="value-textarea-position">
        <view>
          <textarea
            v-model="reason"
            class="value-textarea"
            placeholder="请输入原因，便于客服处理～"
            maxlength="300"
            :placeholder-style="placeholderStyle"
          />
        </view>

        <view class="textarea-word">
          <text class="text">
            {{ `${reasonLength}/300` }}
          </text>
        </view>
      </view>
      <view class="submit-box" @click="handlePut">
        <text class="text">提交</text>
      </view>
    </view>
  </put-popup-view>
</template>
<script setup lang="ts">
import type { ProductData } from "@/types/store";
import { ref, computed, reactive, watch } from "vue";
import { toCamelCase } from "@/utils";
import { throttle } from "lodash-es";
import { editProduct } from "@/api/product";
import PutPopupView from "@/components/popup/index.vue";
import Events, { report, ReportStatus } from "@/utils/report/report";

const putPopupRef = ref<any>(null);
const reason = ref<string>(null);
const props = withDefaults(
  defineProps<{
    product: ProductData;
  }>(),
  {
    product: {},
  }
);

const product = ref<ProductData>(props.product);

watch(
  () => props.product,
  (val) => {
    product.value = val;
  },
  {
    immediate: true,
    deep: true,
  }
);

const emits = defineEmits(["reload"]);
const placeholderStyle = reactive({
  fontSize: "24rpx",
  color: "#AFAFAF",
});
const reasonLength = computed(() => {
  if (!reason.value) return 0;
  return reason.value.length;
});

const reportData = computed(() => {
  return {
    productId: product.value.product_id, // 商品ID
    productTitle: product.value.product_title, // 商品ID
    price: product.value.product_price, // 商品价格
    gameId: product.value.game_id, // 游戏ID
    game: product.value.game_name, // 游戏名称
  };
});

const handlePut = throttle(async () => {
  const productParam = {
    ...product.value,
    reason: reason.value,
    product_title: product.value.product_title.replace(/^.*?\s.*?\s/, ""),
    userQQ: product.value.user_qq,
    screenshotType: 1,
  };

  const data = await editProduct(toCamelCase(productParam)).catch((err) => {
    report(Events.PRODUCT_UP_STATUS, {
      ...reportData.value,
      status: ReportStatus.FAILED,
      errMsg: err,
    });
  });
  if (data) {
    report(Events.PRODUCT_UP_STATUS, {
      ...reportData.value,
      status: ReportStatus.SUCCESS,
    });
    uni.$main.toast("上架申请已提交");
    putPopupRef.value.close();
    emits("reload");
  }
}, 500);

const close = () => {
  putPopupRef.value.close();
};

const open = () => {
  report(Events.PRODUCT_UP, {
    ...reportData.value,
  });
  putPopupRef.value.open();
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
  .value-textarea-position {
    position: relative;
    flex: 1;
    background-color: #f4f5f6;
    .value-textarea {
      display: flex;
      margin-top: 16rpx;
      height: 144rpx;
      padding: 24rpx;
      flex: 1;
      font-weight: 400;
      font-size: 24rpx;
      color: #1a1a1a;
      line-height: 50rpx;
      background-color: #f4f5f6;
    }

    .textarea-word {
      position: absolute;
      right: 16rpx;
      bottom: 16rpx;
      background-color: #f4f5f6;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #afafaf;
      }
    }
  }
  .submit-box {
    width: 686rpx;
    height: 96rpx;
    background-color: #1cc7be;
    border-radius: 8rpx;
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
