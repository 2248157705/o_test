<template>
  <view
    v-if="product.product_id"
    :class="`account-list-item ${classNameType}`"
    :style="accountStyle"
    @tap="handleGoodDetail"
  >
    <view :class="`cover ${classNameType}`">
      <image
        mode="aspectFill"
        :style="iconStyle"
        :webp="true"
        :src="productCovert"
      ></image>
      <image
        v-if="typeArr.indexOf(props.type) !== -1"
        class="compensate-img"
        :style="compensateStyle"
        :src="labelImage"
      />
      <slot name="cover" />
    </view>
    <view :class="`goods-item ${classNameType}`" :style="goodsItemStyle">
      <view>
        <view class="dot-box column-dot">
          <view
            class="dot-item"
            style="background-color: #ffb422; border-color: #ffb422"
            :style="flexShrinkStyle"
          >
            <text class="text" style="color: #fff">已验号</text>
          </view>
          <template
            v-for="(item, index) in dotList.slice(0, togglePreview ? 2 : 3)"
            :key="index"
          >
            <view
              class="dot-item"
              :style="flexShrinkStyle"
              :class="{
                end: index == dotList.length - 1 && dotList.length == 2,
              }"
            >
              <text class="text">{{ item.label + item.value }}</text>
            </view>
          </template>
        </view>
        <view class="title">
          <u--text
            size="28rpx"
            bold
            block
            :lineHeight="togglePreview ? '40rpx' : '44rpx'"
            :lines="2"
            :text="product.product_title"
          ></u--text>
        </view>
        <view class="remarks">
          <template
            v-for="(item, index) in remarks.slice(0, togglePreview ? 3 : 5)"
            :key="index"
          >
            <view
              class="item"
              :class="{
                end: index == remarks.length - 1 && remarks.length == 2,
              }"
              :style="flexShrinkStyle"
            >
              <text class="text">{{ item }}</text>
            </view>
          </template>
        </view>
      </view>
      <template v-if="bargain && bargain.price">
        <view class="price-box">
          <view class="bargain-price price-text">
            <u--text
              bold
              color="#1A1A1A"
              size="32rpx"
              mode="price"
              align="left"
              :text="+(bargain.price || 0)"
            ></u--text>
          </view>
          <view class="original-price price-text">
            <u--text
              bold
              color="#AFAFAF"
              size="28rpx"
              mode="price"
              align="left"
              decoration="line-through"
              :text="+(product.product_price || 0)"
            ></u--text>
          </view>
        </view>
      </template>
      <slot v-else name="price">
        <view class="price">
          <view class="price-box">
            <text :style="`color: ${priceColor}`" class="mark">¥</text
            ><text :style="`color: ${priceColor}`" class="text">{{
              actualAmount || props.product.product_price
            }}</text>
          </view>
          <text class="time">{{ saleableTime }}</text>
        </view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, withDefaults, ref, watch } from "vue";
import { parseGoodsInfo } from "@/gameData";
import { ProductData } from "@/types/store";
import { throttle, isArray } from "lodash-es";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import { toLogin, checkIsLogin } from "@/utils/login";
import { ProductTypeEnum } from "@/enums/product";
import dayjs from "dayjs";
const userStore = useUserStore();
const gameStore = useGameStore();

const accountStyle = computed(() => {
  const { type } = props;
  if (!typeArr.includes(type)) {
    return { height: "235rpx" };
  }
  return {};
});

const flexShrinkStyle = computed(() => {
  const { flexShrink } = props;
  if (flexShrink) {
    return {
      flexShrink: 0,
    };
  }
  return {};
});

const iconStyle = computed(() => {
  const { type } = props;
  if (!typeArr.includes(type)) {
    return {
      width: "230rpx",
      height: "230rpx",
      borderBottomLeftRadius: "16rpx",
      borderBottomRightRadius: "16rpx",
      borderTopLeftRadius: "16rpx",
      borderTopRightRadius: "16rpx",
    };
  }
  if (userStore.togglePreview) {
    return {
      width: "276rpx",
      height: "276rpx",
      borderBottomLeftRadius: "16rpx",
      borderBottomRightRadius: "16rpx",
      borderTopLeftRadius: "16rpx",
      borderTopRightRadius: "16rpx",
    };
  } else {
    return {
      width: "702rpx",
      height: "456rpx",
      borderBottomLeftRadius: "0",
      borderBottomRightRadius: "0",
      borderTopLeftRadius: "16rpx",
      borderTopRightRadius: "16rpx",
    };
  }
});
const goodsItemStyle = computed(() => {
  const { type } = props;
  if (!typeArr.includes(type)) {
    return {
      borderBottomLeftRadius: "0",
      borderBottomRightRadius: "0",
      borderTopLeftRadius: "0",
      borderTopRightRadius: "0",
      padding: "0",
      paddingLeft: "16rpx",
      height: "235rpx",
    };
  }
  if (userStore.togglePreview) {
    return {
      borderTopRightRadius: "16rpx",
      borderBottomRightRadius: "16rpx",
      borderLeftWidth: "0",
      padding: "16rpx",
    };
  } else {
    return {
      borderBottomLeftRadius: "16rpx",
      borderBottomRightRadius: "16rpx",
      padding: "24rpx",
      borderLeftWidth: "1rpx",
    };
  }
});
const classNameType = computed(() => {
  const { type } = props;
  return togglePreview.value ? `row ${type}` : type;
});

const compensateStyle = computed(() => {
  if (userStore.togglePreview) {
    return {
      width: "128rpx",
      height: "44rpx",
    };
  } else {
    return {
      width: "184rpx",
      height: "56rpx",
    };
  }
});
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
    audit?: boolean;
    flexShrink?: boolean;
  }>(),
  {
    gameDetail: {},
    product: {},
    bargain: {},
    type: "goods",
    row: false,
    labelImage: "/static/images/home/compensate.png",
    priceColor: "#FD505E",
    actualAmount: undefined,
    audit: false,
    flexShrink: false,
  }
);

const togglePreview = computed(() => {
  const { type } = props;
  if (!typeArr.includes(type)) {
    return true;
  } else {
    return userStore.togglePreview;
  }
});

const remarks = ref("");
const setDot = () => {
  const { product } = props;
  // if (dotList.value.length && remarks.value.length) return;
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
};

const typeArr = ["home", "goods-list"];

const saleableTime = computed(() => {
  const { saleable_time } = props.product;

  const now = dayjs();
  const published = dayjs.unix(saleable_time);

  // Calculate the difference in hours
  const diffInHours = now.diff(published, "hour");

  if (diffInHours < 24) {
    // If the difference is less than 24 hours, display "XX小时前发布"
    if (diffInHours == 0) return "刚刚发布";
    return `${diffInHours}小时前发布`;
  } else {
    // Otherwise, display the date as "YYYY年MM月DD日"
    return published.format("YYYY.MM.DD");
  }
});

const dotList = ref([]);

const emits = defineEmits(["handleGoodDetail"]);

const handleGoodDetail = () => {
  const { type, product, audit } = props;
  if (audit) {
    emits("handleGoodDetail", product);
    return;
  }
  if (typeArr.includes(type)) {
    uni.navigateTo({
      url: `/pages/goods/detail?product_id=${product.product_id}`,
    });
    return;
  }
  emits("handleGoodDetail", product);
};

const collection = ref(props.product.is_collection);

const productCovert = computed(() => {
  const { product, type } = props;
  const { product_covert, product_type } = product;
  if (!typeArr.includes(type)) {
    if (product_type == ProductTypeEnum.GUARANTEE) {
      return (
        import.meta.env.VITE_APP_CDN_HOST +
        "/taogehao/resource/images/common_guarantee_cover_small.png"
      );
    }
    if (product_type == ProductTypeEnum.RECYCLE)
      return (
        import.meta.env.VITE_APP_CDN_HOST +
        "/taogehao/resource/images/common_recycle_cover_small.png"
      );
  }
  return product_covert + "?imageMogr2/format/webp";
});

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

watch(
  () => gameStore.detailLoad,
  (val) => {
    if (!val[props.product.game_id]) {
      setDot();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => props.product,
  async (val, old) => {
    if (
      val?.goods_info != old?.goods_info &&
      !gameStore.gameDetail[val.game_id]
    ) {
      await gameStore.assembleGameForm(val.game_id);
    }
    setDot();
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
$bargain-height: 165rpx;
$order-height: 180rpx;

.account-list {
  &-item {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    margin-top: 4rpx;
    .compensate-img {
      z-index: 9999;
      position: absolute;
    }
    .cover {
      position: relative;
    }

    .goods-item {
      @include flex(column);
      flex: 1;
      padding: 24rpx;
      border: 1rpx solid #f4f5f6;
      overflow: hidden;
      justify-content: space-between;
      .price-box {
        @include flex;
        flex-direction: row;
        .bargain-price {
          margin-right: 16rpx;
        }
        .mark {
          font-size: 26rpx;
          font-weight: bold;
          color: #1a1a1a;
          padding-top: 10rpx;
          padding-right: 4rpx;
        }
      }
      .title {
        margin-bottom: 16rpx;
      }
      .remarks {
        @include flex;
        .item {
          @include flex(row);
          align-items: center;
          justify-content: center;
          padding: 4rpx 10rpx;
          border-radius: 8rpx;
          border: 1rpx solid #f5f7fa;
          margin-right: 8rpx;
          background-color: #f5f7fa;
          .text {
            font-size: 24rpx;
            font-weight: 400;
            color: #4a4c5a;
          }
          &.end {
            margin: 0;
          }
        }
      }
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
      .dot-box {
        display: flex;
        flex-direction: row;
        margin-bottom: 16rpx;
        flex: 1;
        .dot-item {
          @include flex(row);
          align-items: center;
          justify-content: center;
          padding: 6rpx 12rpx;
          border-radius: 8rpx;
          border: 1rpx solid #16c373;
          margin-right: 8rpx;
          .text {
            font-size: 24rpx;
            font-weight: 500;
            color: #16c373;
          }
          &.end {
            margin: 0;
          }
        }
      }
      .price {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

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
        .time {
          color: #afafaf;
          font-size: 24rpx;
        }
        .text {
          font-family: Barlow-Bold;
          font-weight: bold;
          font-size: 40rpx;
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
    }
    &.row {
      flex-direction: row;
      .goods-item {
        .dot-box {
          margin-bottom: 6rpx;
        }
        .title {
          margin-bottom: 6rpx;
        }
        .bot {
          margin-bottom: 6rpx;
        }
      }
    }
  }
}
:deep(.personal-list .icon) {
  width: 230rpx !important;
  height: 230rpx !important;
}
:deep(.personal-list.cover) {
  width: 230rpx !important;
  height: 230rpx !important;
}
:deep(.personal-list.goods-item) {
  border: 0 !important;
  padding: 0 16rpx !important;
  border-radius: 0 !important;
}
</style>
