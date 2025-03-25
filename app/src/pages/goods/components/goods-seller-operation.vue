<template>
  <view v-if="ProductStatus.TRADING !== product.status_type" class="operation">
    <template v-if="ProductStatus.AUDITING == product.status_type">
      <view class="btn auditing" @tap="handleToast"
        ><text class="text">审核中</text></view
      >
    </template>

    <template
      v-else-if="ProductStatus.OFF_SALE == product.status_type || offSale"
    >
      <view class="btn auditing"><text class="text">已下架</text></view>
    </template>

    <template v-else-if="ProductStatus.ON_SALE == product.status_type">
      <view class="btn" @tap="delistPopupRef.open()"
        ><text class="text">下架</text></view
      >
      <view class="btn" @tap="handleEdit"><text class="text">编辑</text></view>
      <view class="btn price" @tap="modifyPriceRef.open()"
        ><text class="text">修改价格</text></view
      >
    </template>
    <template v-else>
      <view class="btn" @tap="handleEdit"><text class="text">编辑</text></view>
      <view class="btn price" @tap="handlePut"
        ><text class="text">重新上架</text></view
      >
    </template>
    <slot />
  </view>

  <delist-popup ref="delistPopupRef" :closeOnClickOverlay="false">
    <view class="delist-popup">
      <view class="content">
        <text class="text">确认要下架吗？</text>
      </view>
      <view class="btn-box">
        <view class="btn cancel" @tap="delistPopupRef.close()">
          <text class="text">再看看</text>
        </view>
        <view class="btn confirm" @tap="handleConfirm">
          <text class="text">确认</text>
        </view>
      </view>
    </view>
  </delist-popup>

  <modify-price
    ref="modifyPriceRef"
    :product="product"
    @reload="handleReload"
  />
</template>

<script setup lang="ts">
import type { ProductItem } from "@/types/product";
import { ProductStatus } from "@/enums/product";
import { ref, computed } from "vue";
import { getGameList } from "@/api/game";
import { offShelfProduct } from "@/api/product";
import DelistPopup from "@/components/my-popup/index.vue";
import ModifyPrice from "@/pages/my/posted-center/components/modify-price.vue";
import Events, { report, ReportStatus } from "@/utils/report/report";
import { throttle } from "lodash-es";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const modifyPriceRef = ref(null);
const delistPopupRef = ref(null);
const offSale = ref(false);

const props = withDefaults(
  defineProps<{
    product: ProductItem;
  }>(),
  {
    product: {},
  }
);

const emit = defineEmits(["onModifyPrice", "put"]);

const reportOrderData = computed(() => {
  const { product_id, game_id, game_name, product_price, product_title } =
    props.product;
  return {
    productId: product_id, // 商品ID
    productTitle: product_title, // // 商品名称
    price: product_price, // 商品价格
    gameId: game_id, // 游戏ID
    game: game_name, // 游戏名称
  };
});

const handlePut = () => {
  emit("put");
};

const handleConfirm = throttle(async () => {
  const { product_id } = props.product;
  const data = await offShelfProduct(product_id).catch((err) => {
    report(Events.PRODUCT_DOWN_STATUS, {
      ...reportOrderData.value,
      status: ReportStatus.FAILED,
      errMsg: err,
    });
  });
  report(Events.PRODUCT_DOWN_STATUS, {
    ...reportOrderData.value,
    status: ReportStatus.SUCCESS,
  });
  if (data) {
    delistPopupRef.value.close();
    offSale.value = true;
  }
}, 500);

const handleEdit = async () => {
  const { game_id, product_type, product_id } = props.product;
  const { data } = await getGameList({ game_ids_in: [game_id] });
  userStore.setGameHistory(data[0]);
  uni.navigateTo({
    url: `/pages/sell-account/sell-information-enter/index?type=${product_type}&edit_product_id=${product_id}`,
  });
};

const handleReload = (price) => {
  modifyPriceRef.value.close();
  emit("onModifyPrice", price);
};

const handleToast = () => {
  uni.$main.toast("请耐心等待，客服正在审核中");
};
</script>

<style lang="scss" scoped>
.operation {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 24rpx;
  gap: 24rpx;
  .btn {
    width: 175rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $app-max-btn-height;
    border-radius: $app-box-radius;
    border: 2rpx solid $app-main-color;
    .text {
      color: $app-main-color;
      font-weight: 500;
      font-size: 32rpx;
    }
    &.price {
      width: 304rpx;
      background-color: $app-main-color;
      .text {
        color: #fff;
      }
    }
    &.auditing {
      flex: 1;
      background-color: #4a4c5a;
      border-color: #4a4c5a;
      .text {
        color: #fff;
      }
    }
  }
}
.delist-popup {
  flex: 1;
  @include flex(column);
  /* max-height: max-content; */
  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 32rpx;
    .text {
      color: #1a1a1a;
      font-size: 32rpx;
      font-weight: 400;
    }
  }
  .btn-box {
    @include flex(row);
    justify-content: space-between;
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 236rpx;
      height: $app-middle-btn-height;
      border-radius: $app-box-radius;
      .text {
        font-weight: 500;
        font-size: 32rpx;
        color: #ffffff;
      }
      &.cancel {
        background-color: #f4f5f6;
        .text {
          color: #606060;
        }
      }
      &.confirm {
        background-color: #1cc7be;
      }
    }
  }
}
</style>
