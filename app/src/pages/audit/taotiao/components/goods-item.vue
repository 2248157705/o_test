<template>
  <view
    v-if="product.product_id"
    class="account-list-item"
    :class="thatClass"
    @tap="handleGoodDetail"
  >
    <view :class="`cover ${props.type}`">
      <image
        class="icon"
        mode="aspectFill"
        :webp="true"
        :src="props.product.product_covert + '?x-oss-process=image/format,webp'"
      ></image>

      <image
        v-if="typeArr.indexOf(props.type) !== -1"
        class="compensate-img"
        :src="labelImage"
      />
    </view>
    <view :class="`goods-item ${props.type}`">
      <view class="title">
        <u--text
          :lines="3"
          size="28rpx"
          bold
          :block="true"
          :text="productTitle"
        ></u--text>
      </view>

      <slot name="price">
        <view v-if="!$slots.price" class="price">
          <view class="price-box">
            <text :style="`color: ${priceColor}`" class="mark">¥</text
            ><text :style="`color: ${priceColor}`" class="text">{{
              actualAmount || props.product.product_price
            }}</text>
          </view>
          <!-- <view
            v-if="typeof props.product.popularity != 'undefined'"
            class="popularity"
          >
            <image class="icon" src="/static/images/home/heat.png"></image>
            <text class="popularity-text">{{ props.product.popularity }}</text>
          </view> -->
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, withDefaults, ref } from "vue";
import { parseGoodsInfo } from "@/gameData";
import { ProductData } from "@/types/store";
import { throttle, isArray } from "lodash-es";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { toLogin, checkIsLogin } from "@/utils/login";
import { onLoad } from "@dcloudio/uni-app";

const userStore = useUserStore();
const gameStore = useGameStore();

const props = withDefaults(
  defineProps<{
    product: ProductData;
    type?: string;
    row?: boolean;
    bargain?: any;
    gameDetail?: any;
    labelImage?: string;
    priceColor?: string;
    actualAmount?: number; //支付价格
  }>(),
  {
    gameDetail: {},
    product: {},
    bargain: {},
    type: "goods",
    row: false,
    labelImage: "/static/images/home/compensate.png",
    priceColor: "#1a1a1a",
    actualAmount: undefined,
  }
);
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
    if (item.type !== "radio") {
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

const thatClass = computed(() => {
  return props.row ? "row " + props.type : props.type;
});
const typeArr = ["home", "goods-list"];
const productTitle = computed(() => {
  const { product_introduction } = props.product;
  return product_introduction?.trim();
});

// const comeFrom = computed(() => {
//   const { product } = props;
//   let from = "";
//   try {
//     const goods_info = product.goods_info ? JSON.parse(product.goods_info) : {};
//     if (goods_info.system) {
//       from = `${goods_info.system}`;
//     }
//   } catch (error) {
//     uni.log.info(error, product);
//   }

//   return !["home", "goods-list"].includes(props.type)
//     ? product.game_name + (from ? "/" + from : "")
//     : from;
// });

const dotList = ref([]);

const emits = defineEmits(["handleGoodDetail"]);

const handleGoodDetail = () => {
  const { type, product } = props;
  if (type != "order") {
    uni.navigateTo({
      url: `/pages/audit/taotiao/detail?product_id=${product.product_id}`,
    });
  }
  emits("handleGoodDetail", product);
};

const collection = ref(props.product.is_collection);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleCollect = throttle(async () => {
  if (!checkIsLogin()) {
    toLogin();
    return;
  }
  const api = collection.value
    ? userStore.delCollectionProduct
    : userStore.setCollectionProduct;

  await api(props.product.product_id);

  uni.$main.toast(collection.value ? "取消收藏" : "收藏成功");
  collection.value = !collection.value;
}, 300);

onLoad(async () => {
  if (!gameStore.gameDetail[props.product?.game_id]) {
    await gameStore.assembleGameForm(props.product?.game_id);
    setDot();
  } else {
    setDot();
  }
});
</script>

<style lang="scss" scoped>
$bargain-height: 165rpx;
$order-height: 180rpx;

.account-list {
  &-item {
    display: flex;
    flex-direction: column;

    .remarks {
      height: 30rpx;
      @include flex;
      .text {
        font-size: 24rpx;
        color: #afafaf;
      }
    }
    &.goods-list {
      height: 450rpx;
      border: 1px solid #f4f5f6;
      margin-bottom: 20rpx;
      border-radius: 8rpx;
      background-color: #fff;
      .goods-item {
        padding: 0 12rpx;
        width: 340rpx;
      }
    }
    &.home {
      height: 450rpx;
      /* margin-bottom: 48rpx; */
      border: 1px solid #f4f5f6;
      margin-bottom: 20rpx;
      border-radius: 8rpx;
      background-color: #fff;
      .goods-item {
        width: 340rpx;
        padding: 14rpx 12rpx 12rpx 12rpx;
        @include flex(column);
        justify-content: space-between;
        .title {
          height: 64rpx;
        }
        .price {
          margin-top: 6rpx;
        }
      }
    }
    &.row {
      flex-direction: row;
      display: flex;
      align-items: center;
      justify-content: center;
      .cover {
        .icon {
          width: 251rpx !important;
        }
      }
      .goods-item {
        // height: 188rpx !important;
        margin-left: 14rpx !important;

        @include flex(column);
        justify-content: space-between;
        &.bargain {
          height: $bargain-height;
        }
        &.order {
          height: $order-height;
        }
        .title {
          height: 30rpx;
        }

        .price {
          height: 36rpx;
          position: relative;
          top: 6rpx;
          .price-box {
            @include flex;
            align-items: flex-end;
            .mark {
              font-size: 22rpx;
              font-weight: bold;
              color: #1a1a1a;
              padding-right: 4rpx;
              position: relative;
              bottom: 4rpx;
            }
            .text {
              font-family: Barlow-Bold;
              font-weight: 500;
              font-size: 36rpx !important;
              color: #1a1a1a;
            }
          }
        }
      }
    }
    .cover {
      border-radius: 8rpx;
      display: flex;
      position: relative;
      .compensate-img {
        width: 128rpx;
        height: 44rpx;
        z-index: 9999;
        position: absolute;
      }
      .icon {
        width: 340rpx;
        height: 255rpx;
        border-radius: 8rpx;
      }

      &.order {
        .icon {
          width: 276rpx;
          height: $order-height;
        }
      }
      &.goods-list {
        width: 343rpx;
        height: 258rpx;
        .icon {
          width: 343rpx;
          height: 258rpx;
        }
      }
      &.collect {
        width: 222rpx;
        height: 160rpx;
        .icon {
          width: 222rpx;
          height: 160rpx;
        }
      }
      &.bargain {
        .icon {
          width: 190rpx !important;
          height: $bargain-height !important;
        }
      }
    }
    .goods-item {
      @include flex(column);
      flex: 1;
      .tips {
        display: flex;
        flex-direction: row;
        margin-bottom: 10rpx;
        .view {
          padding: 4rpx 12rpx;
          background-color: #e6f0f0;
          border-radius: 2rpx;
          margin-right: 8rpx;
          @include flex(row);
          align-items: center;
          justify-content: center;
          .icon {
            margin-right: 4rpx;
            width: 15rpx;
            height: 15rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .text {
            font-weight: 500;
            font-size: 18rpx;
            color: #18524e;
          }
        }
      }
      .dot {
        display: flex;
        flex-direction: row;
        height: 36rpx;

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
            // padding-left: 8rpx;
            color: #f93531;
          }
          &.end {
            margin: 0;
            /* flex: 1; */
          }
        }
        &.column-dot {
          // width: 340rpx;
          .item {
            margin-right: 8rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            &.end {
              margin: 0;
              /* flex: 1; */
              /* width: 150rpx; */
            }
            .text {
              font-weight: 500;
              font-size: 24rpx;
              color: #fd505e;
              /* flex: 1; */
            }
          }
        }
      }
      .price {
        height: 48rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .popularity {
          @include flex;
          align-items: center;
          justify-content: center;
          .icon {
            height: 32rpx;
            width: 34rpx;
            position: relative;
            top: -1rpx;
          }
          .popularity-text {
            font-size: 24rpx;
            color: #afafaf;
            font-weight: 400 !important;
            margin-left: 6rpx;
          }
        }
        .price-box {
          @include flex;
          .mark {
            font-size: 26rpx;
            font-weight: bold;
            color: #1a1a1a;
            padding-top: 13rpx;
            padding-right: 4rpx;
          }
        }
        .text {
          font-family: Barlow-Bold;
          font-weight: bold;
          font-size: 42rpx;
          color: #1a1a1a;
        }
        .icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .text {
            font-weight: 400;
            font-size: 20rpx;
            color: #afafaf;
          }
        }
      }

      .collect-icon {
        width: 35rpx;
        height: 35rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.price-box {
  @include flex(row);
  align-items: center;
  // border: 1rpx solid;

  .price-text {
    @include flex(row);
    align-items: flex-end;
    .text {
      font-weight: 400;
      font-size: 22rpx;
      border: 2rpx solid #f4f5f6;
      padding: 2rpx 12rpx;
    }
    &.original-price {
      .text {
        color: $app-main-color;
      }
    }
    &.bargain-price {
      margin-left: 8rpx;
      .text {
        color: #f42a2a;
      }
    }
  }
}
</style>
