<template>
  <global-view :showBar="false" bgColor="#F7F9FA">
    <z-paging
      :refresher-enabled="false"
      :show-scrollbar="false"
      :auto-clean-list-when-reload="false"
      :scroll-to-bottom-bounce-enabled="false"
      :show-loading-more-no-more-line="false"
    >
      <template #top>
        <u-navbar
          bgColor="#ffffff"
          title="商品详情"
          :placeholder="true"
          :autoBack="true"
          :safeAreaInsetTop="true"
        />
      </template>
      <view class="cover-view" @click="previewImage">
        <u-swiper
          :interval="2000"
          :list="
            product.product_type == ProductTypeEnum.ACCOUNT
              ? screenshotInfo
              : [product.product_covert]
          "
          :circular="true"
          keyName="url"
          height="420rpx"
          radius="4rpx"
          @change="(e) => (coverCurrent = e.current)"
        ></u-swiper>
        <view
          v-if="product.product_type == ProductTypeEnum.ACCOUNT"
          class="indicator-view"
        >
          <text class="text"
            >{{ coverCurrent + 1 }}/{{ screenshotInfo.length }}</text
          >
        </view>
      </view>

      <view class="detail-view">
        <view class="detail-title">
          <view class="price">
            <view class="price-box">
              <text class="mark">¥</text>
              <text class="text">{{ product.product_price }}</text>
            </view>
            <view class="popularity">
              <!-- <text class="text">{{ product.popularity }}人浏览</text> -->
              <image class="icon" src="/static/images/home/heat.png"></image>
              <text class="text">{{ product.popularity }}</text>
            </view>
          </view>
          <view v-if="product.product_title" style="position: relative">
            <more-text class="title" :lineHeight="24" :row="2" animation>
              <text class="title">
                {{ product.product_title }}
              </text>
            </more-text>
          </view>
          <view class="detail-info">
            <view class="goods-date">
              <u--image
                class="img"
                src="/static/images/common/icon_time.png"
                width="32rpx"
                height="32rpx"
              />
              <text class="text">{{ formatDate(product.created_at) }}</text>
            </view>
            <view class="goods-id">
              <copy-view
                :content="`编号 ${product.product_id}`"
                :text-style="{
                  fontWeight: 400,
                  fontSize: '24rpx',
                  color: '#606060',
                }"
              ></copy-view>
            </view>
          </view>
        </view>
        <goods-selling-point v-if="product.product_id" :product="product" />
      </view>
      <view class="detail-box" :style="`height: ${windowHeight}px`">
        <u-sticky>
          <view class="detail-tab">
            <z-tabs
              ref="tabs"
              barWidth="56rpx"
              barHeight="8rpx"
              :list="list"
              :current="current"
              :inactiveStyle="inactiveStyle"
              :tabsStyle="tabsStyle"
              :activeStyle="activeStyle"
              :barStyle="barStyle"
              @change="tabsChange"
            />
          </view>
        </u-sticky>
        <view class="detail-current">
          <template v-if="current == 0">
            <goods-screenshot-info :items="screenshotInfo" />
          </template>
          <template v-if="current == 1">
            <goods-game-info :product="product" />
          </template>
        </view>
      </view>
      <view
        v-if="
          product.product_type != ProductTypeEnum.SECKILL &&
          product.product_type != ProductTypeEnum.GUARANTEE
        "
        class="detail-operation"
        :style="{ paddingBottom: safeAreaPadding() }"
      >
        <view
          class="operation-content"
          :class="{
            end: !showFeatureBtn && !showPutBtn,
          }"
        >
          <template v-if="showFeatureBtn || showPutBtn">
            <view class="icon-box">
              <view class="item" @click="handleGoIm">
                <image class="icon" src="/static/images/my/icon_service.png" />
                <text class="text">客服</text>
              </view>
              <view v-if="!showPutBtn" class="item" @click="handleCollection">
                <image
                  class="icon"
                  :src="`/static/images/sell/${collection ? 'icon_collect_active' : 'icon_collect'}.png`"
                />
                <text class="text">收藏</text>
              </view>
            </view>
          </template>

          <view class="operation-box">
            <view class="buy" @click="handleGoIm">
              <text class="text">立即兑换</text>
            </view>
          </view>
        </view>
      </view>
    </z-paging>
    <bargain-popup
      ref="bargainingRef"
      :product="product"
      @reload="showBargainDetailBtn = true"
    />
    <purchase-popup ref="purchasePopupRef" />
    <put-popup ref="putPopupRef" :product="product" />
  </global-view>
</template>

<script setup>
import { ProductStatus, ProductTypeEnum } from "@/enums/product";
import { ref, reactive, computed } from "vue";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { getProductInfo } from "@/api/product";
import { consultCustomerService } from "@/components/im/conversation-list";
import GlobalView from "@/components/global-view/index.vue";
import BargainPopup from "@/pages/bargain/components/bargain-popup.vue";
import PurchasePopup from "@/pages/goods/components/purchase-popup.vue";
import PutPopup from "@/pages/goods/components/put-popup.vue";
import GoodsScreenshotInfo from "@/pages/goods/components/goods-screenshot-info.vue";
import GoodsGameInfo from "./components/goods-game-info.vue";
import GoodsSellingPoint from "@/pages/goods/components/goods-selling-point.vue";
import CopyView from "@/components/copy/copy.vue";
import MoreText from "@/components/more-text/more-text.vue";
import dayjs from "dayjs";
import { useProductStore } from "@/stores/product";
import { useUserStore } from "@/stores/user";
import { queryByProductId } from "@/api/order";
import { toLogin, checkIsLogin } from "@/utils/login";

import { throttle } from "lodash-es";
import { safeAreaPadding } from "@/utils";
import {
  tabsStyle,
  inactiveStyle,
  activeStyle,
  barStyle,
} from "@/utils/operation-style";
import Events, { report, ReportStatus } from "@/utils/report/report";

const windowHeight = uni.getSystemInfoSync().windowHeight;
const productStore = useProductStore();
const userStore = useUserStore();
const current = ref(0);
const coverCurrent = ref(0);
const bargainingRef = ref(null);
const purchasePopupRef = ref(null);
const list = reactive([
  { id: 0, name: "商品截图" },
  { id: 1, name: "商品描述" },
]);

const product = ref({});
const screenshotInfo = ref([]);
const bargain = ref(null);
const collection = ref(false);
const putPopupRef = ref(null);

const showBargainDetailBtn = ref(false);

// 上报参数
const reportOrderData = computed(() => {
  const { id, game_id, game_name, product_price, product_title } =
    product.value;
  return {
    productId: id, // 商品ID
    productTitle: product_title, // // 商品名称
    price: product_price, // 商品价格
    gameId: game_id, // 游戏ID
    game: game_name, // 游戏名称
  };
});

// 是否显示帮助按钮
const showFeatureBtn = computed(() => {
  return product.value.status_type != ProductStatus.OFF_SALE;
});

const showPutBtn = computed(() => {
  const { uid, status_type } = product.value;
  return (
    status_type == ProductStatus.OFF_SALE && uid == userStore.userInfo?.uid
  );
});

onLoad(async (params) => {
  const infoParam = { productId: params.product_id };
  if (userStore.userInfo) {
    infoParam.uid = userStore.userInfo.uid;
  }
  product.value = await getProductInfo(infoParam);

  report(Events.PRODUCT_VIEW, reportOrderData.value);

  if (product.value.screenshot_info) {
    screenshotInfo.value = JSON.parse(product.value.screenshot_info).flatMap(
      (item) => {
        if (item.url) {
          return item.url;
        } else {
          return Object.values(item);
        }
      }
    );
    console.log("screenshotInfo.value", screenshotInfo.value);
  }
  if (userStore.userInfo) {
    const data = await userStore.judgeWhetherCollectionProduct(
      product.value.product_id
    );
    collection.value = data[product.value.product_id];
    const bargainParam = await queryByProductId(product.value.product_id);
    bargain.value = bargainParam.bargain_status;
  }
  productStore.setLookingProduct(product.value);
});

onShow(() => {
  //
});
onUnload(() => {
  //
});

const handleCollection = throttle(async () => {
  if (!checkIsLogin()) {
    toLogin();
    return;
  }

  const api = collection.value
    ? userStore.delCollectionProduct
    : userStore.setCollectionProduct;

  if (collection.value) {
    report(Events.PRODUCT_COLLECT_STATUS, {
      ...reportOrderData.value,
      status: ReportStatus.FAILED,
    });
  } else {
    report(Events.PRODUCT_COLLECT_STATUS, {
      ...reportOrderData.value,
      status: ReportStatus.SUCCESS,
    });
  }

  await api(product.value.product_id);
  uni.$main.toast(collection.value ? "取消收藏" : "收藏成功");
  collection.value = !collection.value;
}, 300);
const tabsChange = (index) => {
  current.value = index;
};
const handleGoIm = async () => {
  report(Events.PRODUCT_CS, reportOrderData.value);
  await consultCustomerService(product.value);
};

const formatDate = computed(() => {
  return (item) => {
    return dayjs.unix(item).format("YYYY.MM.DD");
  };
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productMsgItem = computed(() => {
  const { goods_info } = product.value;
  const goodsInfo = JSON.parse(goods_info || "{}");
  const list = [];
  for (const k in goodsInfo) {
    if (k == "system") {
      list.push({
        label: "按系统",
        value: goodsInfo[k],
      });
    }
    if (k == "real_name") {
      list.push({
        label: "实名情况",
        value: goodsInfo[k],
      });
    }
  }
  return list;
});

const previewImage = () => {
  uni.previewImage({
    urls: screenshotInfo.value,
    current: coverCurrent.value,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleGoSecurity = () => {
  uni.navigateTo({ url: "/pages/my/security-center/index" });
};
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.cover-view {
  position: relative;
  margin-bottom: 16rpx;
  padding: 0 24rpx;
  border-radius: 12rpx;
  overflow: hidden;

  .cover-label {
    position: absolute;
    left: 24rpx;
    top: 0;
  }

  .indicator-view {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 16rpx;
    right: 40rpx;
    width: 114rpx;
    height: 44rpx;
    background: rgba(26, 26, 26, 0.8);
    border-radius: 8rpx;

    .text {
      font-weight: 400;
      font-size: 24rpx;
      color: #ffffff;
    }
  }
}

.guarantee-view {
  flex: 1;
  height: 64rpx;
  @include flex(row);
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #efffff 0%, #ceffff 100%), #ffffff;
  border-radius: 12rpx;
  padding: 0 24rpx;
  box-sizing: border-box;
  margin-bottom: 16rpx;
  .text {
    flex: 1;
    font-weight: 500;
    font-size: 24rpx;
    color: #1a1a1a;
    margin-left: 16rpx;
  }
}
.detail-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  margin-bottom: 250rpx;
  &::-webkit-scrollbar {
    display: none;
  }
  .detail-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-radius: 12rpx 12rpx 0rpx 0rpx;
    padding: 24rpx;
    margin: 0 24rpx;
    margin-bottom: 2rpx;
    box-sizing: border-box;
  }
  .detail-current {
    /* flex: 1; */
    box-sizing: border-box;
    margin: 0 24rpx;
    border-radius: 4rpx;
    padding-bottom: 150rpx;
    @include flex(column);
    .cover {
      flex: 1;
      @include flex(column);
      width: 654rpx;
      margin-bottom: 24rpx;
      .image {
        width: 100%;
      }
    }
  }
}
.detail-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 24rpx;
  box-sizing: border-box;
  &::-webkit-scrollbar {
    display: none;
  }
  .detail-title {
    @include flex(column);
    flex: 1;
    margin-bottom: 16rpx;
    padding: 24rpx;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 12rpx;
    .title {
      font-family: Barlow-SemiBold;
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .price {
      flex: 1;
      margin-bottom: 10rpx;
      @include flex(row);
      align-items: center;
      justify-content: space-between;
      .price-box {
        .mark {
          font-weight: 800;
          font-size: 28rpx;
          color: #1a1a1a;
          margin-right: 4rpx;
          position: relative;
          top: -2rpx;
        }
        .text {
          font-weight: 800;
          font-size: 56rpx;
          color: #1a1a1a;
        }
      }
      .popularity {
        @include flex(row);
        align-items: center;
        justify-content: center;
        .icon {
          height: 34rpx;
          width: 34rpx;
          margin-right: 8rpx;
        }
        .text {
          font-weight: 400;
          font-size: 22rpx;
          color: #afafaf;
        }
      }
    }
    .detail-info {
      @include flex(row);
      margin-top: 12rpx;
      padding: 14rpx 24rpx;
      align-items: center;
      justify-content: space-between;
      height: 56rpx;
      background: #f4f5f6;
      border-radius: 8rpx 8rpx 8rpx 8rpx;

      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #606060;
      }

      .goods-date {
        @include flex(row);
        align-items: center;

        .img {
          margin-right: 12rpx;
        }
      }
    }
  }
  .detail-msg {
    @include flex(column);
    flex: 1;
    background: #fff;
    border-radius: 4rpx;
    padding: 24rpx;
    margin-bottom: 16rpx;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 24rpx;
      .text {
        font-weight: bold;
        font-size: 32rpx;
        color: #1a1a1a;
      }
    }
    .msg-item {
      @include flex(row);
      justify-content: space-between;
      margin-bottom: 16rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf;
      }
      .right-text {
        color: #1a1a1a;
      }
    }
  }
}
.detail-operation {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  .operation-content {
    display: flex;
    flex: 1;
    padding: 24rpx;
    box-sizing: border-box;
    background-color: #fff;
    flex-direction: row;
    justify-content: space-between;
    box-shadow: 0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
    &.end {
      justify-content: flex-end;
    }

    .icon-box {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      flex: 1;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        margin-right: 12rpx;
        border: none;
        .icon {
          width: 48rpx;
          height: 48rpx;
        }
        .text {
          font-weight: 400;
          font-size: 28rpx;
          color: #1a1a1a;
        }
      }
    }
    .operation-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      flex: 1;

      .bargaining-btn {
        width: 120rpx;
        height: 96rpx;
        border-radius: 8rpx;
        border: 2rpx solid #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16rpx;
        box-sizing: border-box;
        background-color: #fff;
        &.check {
          width: 140rpx;
        }
        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #1a1a1a;
          line-height: 34rp;
        }
      }
      .buy {
        width: 256rpx;
        height: $app-max-btn-height;
        background-color: #1cc7be;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: $app-box-radius;
        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #fff;
          line-height: 34rp;
        }
      }
    }
  }
}

::v-deep .detail-title .u-read-more__toggle {
  position: absolute;
  right: 0;
  bottom: 8rpx;
  padding-left: 20rpx;
  background-color: #fff;

  .u-text__value {
    font-weight: 400;
    font-size: 28rpx;
    color: #2e9e98;
  }
}
</style>
