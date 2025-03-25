<template>
  <view class="goods-item">
    <view v-if="showTop" class="time">
      <text class="date text">{{ formatDate }}</text>
      <text :class="`text ${operationTitle.class}`">{{
        operationTitle.title
      }}</text>
    </view>

    <GoodsItem
      type="personal-list"
      :product="product"
      @handle-good-detail="handleDetail"
    >
      <template #cover>
        <view v-if="props.product.status_type == 0" class="state">
          <image
            class="state-icon"
            mode="aspectFill"
            src="/static/images/my/icon_status0.png"
          />
        </view>
        <view v-if="props.product.status_type == 1" class="state">
          <image
            class="state-icon"
            mode="aspectFill"
            src="/static/images/my/icon_status1.png"
          />
        </view>
        <view v-if="props.product.status_type == 3" class="state">
          <image
            class="state-icon"
            mode="aspectFill"
            src="/static/images/my/icon_status3.png"
          />
        </view>
      </template>
      <template #price>
        <u--text
          style="margin-top: -10rpx"
          bold
          color="#1A1A1A"
          size="32rpx"
          mode="price"
          align="left"
          :text="+(product.product_price || 0)"
        ></u--text>
      </template>
    </GoodsItem>
    <view
      v-if="
        showOpt &&
        showOperation &&
        props.product.product_type == ProductTypeEnum.ACCOUNT
      "
      class="operation"
    >
      <view class="btn-box">
        <view
          v-if="props.product.status_type == ProductStatus.ON_SALE"
          class="btn hollow"
          @tap="handleModifyPrice"
        >
          <text class="text">修改价格</text>
        </view>
        <view v-if="showEdit" class="btn hollow" @tap="handleEdit">
          <text class="text">编辑</text>
        </view>
        <view
          v-if="props.product.status_type == ProductStatus.ON_SALE"
          class="btn"
          @tap="handleDelist"
        >
          <text class="text">下架</text>
        </view>
        <view v-if="showPut" class="btn" @tap="handlePut">
          <text class="text">重新上架</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, computed, ref } from "vue";
import { ProductData } from "@/types/store";
import { ProductStatus, ProductTypeEnum } from "@/enums/product";
import dayjs from "dayjs";
import { parseGoodsInfo } from "@/gameData";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { getGameList } from "@/api/game";
import { isArray } from "lodash-es";
import { onLoad } from "@dcloudio/uni-app";
import GoodsItem from "@/components/goods-item-preview/index.vue";

const props = withDefaults(
  defineProps<{ product: ProductData; showTop?: boolean; showOpt?: boolean }>(),
  {
    product: {},
    showTop: true,
    showOpt: true,
  }
);

const gameStore = useGameStore();
const userStore = useUserStore();
const dotList = ref([]);
const remarks = ref("");
const setDot = () => {
  const { product } = props;
  if (dotList.value.length && remarks.value.length) return;
  const parse = parseGoodsInfo(
    product.goods_info,
    gameStore.gameDetail[product.game_id]?.gameFormData
  );
  dotList.value = [];
  remarks.value = [];
  parse.forEach((item) => {
    if (item.type == "checkbox") {
      dotList.value.push({
        label: item.label,
        value: isArray(item.value) ? item.value.length : item.value,
      });
    } else {
      remarks.value.push(item.value);
    }
  });
  dotList.value = dotList.value.slice(0, 2);
  remarks.value = remarks.value.slice(0, 3).join("  |  ");
};
onLoad(async () => {
  if (!gameStore.gameDetail[props.product?.game_id]) {
    await gameStore.assembleGameForm(props.product?.game_id);
    setDot();
  } else {
    setDot();
  }
});

const emit = defineEmits(["delist", "put", "modify"]);

const handleModifyPrice = () => {
  emit("modify");
};

const handleEdit = async () => {
  const { game_id, product_type, product_id } = props.product;
  const { data } = await getGameList({ game_ids_in: [game_id] });
  userStore.setGameHistory(data[0]);
  uni.navigateTo({
    url: `/pages/sell-account/sell-information-enter/index?type=${product_type}&edit_product_id=${product_id}`,
  });
};

const showOperation = computed(() => {
  return [
    ProductStatus.NOT_APPROVED,
    ProductStatus.ON_SALE,
    ProductStatus.OFF_SALE,
  ].includes(props.product.status_type);
});
const showPut = computed(() => {
  return [ProductStatus.NOT_APPROVED, ProductStatus.OFF_SALE].includes(
    props.product.status_type
  );
});

const showEdit = computed(() => {
  return [ProductStatus.ON_SALE, ProductStatus.NOT_APPROVED].includes(
    props.product.status_type
  );
});

const formatDate = computed(() => {
  return dayjs.unix(props.product?.created_at).format("YYYY/MM/DD");
});

const operationTitle = computed(() => {
  if (props.product.status_type == ProductStatus.ON_SALE) {
    return {
      title: "已上架出售",
      class: "green",
    };
  }
  if (props.product.status_type == ProductStatus.OFF_SALE) {
    return {
      title: "已下架",
      class: "grey",
    };
  }
  if (props.product.status_type == ProductStatus.SOLD_OUT) {
    return {
      title: "已出售",
      class: "green",
    };
  }
  if (props.product.status_type == ProductStatus.AUDITING) {
    return {
      title: "审核中",
      class: "green",
    };
  }
  if (props.product.status_type == ProductStatus.NOT_APPROVED) {
    return {
      title: "审核失败",
      class: "red",
    };
  }
  return {};
});

const handleDelist = () => {
  emit("delist");
};

const handlePut = () => {
  emit("put");
};

const handleDetail = () => {
  const { product } = props;
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${product.product_id}`,
  });
};
</script>

<style lang="scss" scoped>
:deep(.personal-list.account-list-item) {
  margin-bottom: 0 !important;
  height: 230rpx !important;
}
.state {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 98;
  flex: 1;
  padding: 8rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.6);
  .state-icon {
    width: 136rpx;
    height: 136rpx;
  }
}
.goods-item {
  @include flex(column);
  margin-top: 24rpx;
  background-color: #fff;
  padding: 24rpx;
  width: 702rpx;
  border-radius: $app-box-radius;
  // #ifndef APP-NVUE
  box-sizing: border-box;
  // #endif
  .time {
    flex: 1;
    @include flex(row);
    align-items: center;
    justify-content: space-between;
    padding-bottom: 20rpx;
    margin-bottom: 24rpx;
    border-bottom: 1.5rpx solid #f4f5f6;
    .text {
      font-weight: 400;
      font-size: 28rpx;
      &.date {
        color: #afafaf;
      }
      &.green {
        color: $app-main-color;
      }
      &.red {
        color: #f42a2a;
      }
      &.grey {
        color: #606060;
      }
    }
  }
  .operation {
    @include flex(row);
    flex: 1;
    justify-content: flex-end;
    align-items: center;
    margin-top: 24rpx;
    .btn-box {
      @include flex(row);
      .btn {
        padding: 0 40rpx;
        height: $app-small-btn-height;
        background: $app-main-color;
        border-radius: 200rpx;
        margin-left: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #fff;
        }
        &.hollow {
          background: #fff;
          border: 2rpx solid $app-main-color;
          .text {
            color: $app-main-color;
          }
        }
      }
    }
  }

  .remarks {
    height: 30rpx;
    @include flex;
    margin-bottom: 10rpx;
    .text {
      font-size: 24rpx;
      color: #afafaf;
    }
  }
  .dot {
    display: flex;
    flex-direction: row;
    margin-bottom: 10rpx;
    height: 40rpx;
    /* width: 310rpx; */
    // width: 340rpx;
    /* overflow: hidden; */
    .item {
      @include flex(row);
      align-items: center;
      justify-content: center;
      padding: 4rpx 12rpx;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      border: 1rpx solid #f93531;
      margin-right: 8rpx;
      .icon {
        width: 10rpx;
        height: 13rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .text {
        font-size: 24rpx;
        font-weight: 500;
        color: #f93531;
      }
      &.end {
        margin: 0;
        /* flex: 1; */
      }
    }
  }
}
</style>
