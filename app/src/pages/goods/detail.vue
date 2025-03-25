<template>
  <global-view ref="global" bgColor="#F7F9FA" @scroll="handleScroll">
    <template #bar>
      <view v-if="scrollTop > currentTop[0]" class="z-tabBox">
        <u-status-bar bgColor="#fff" />
        <div class="box-top">
          <image
            class="back-icon"
            src="/static/images/common/icon_left.png"
            @click="back"
          />
          <z-tabs
            ref="tabs"
            barWidth="56rpx"
            barHeight="8rpx"
            tabWidth="72rpx"
            :list="list"
            :current="current"
            :inactiveStyle="inactiveStyle"
            :tabsStyle="tabsStyle"
            :activeStyle="activeStyle"
            :barStyle="barStyle"
            @change="tabsChange"
          />
        </div>
      </view>
      <u-navbar
        v-else
        bgColor="#ffffff"
        title="商品"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      >
        <template #left>
          <image
            style="width: 48rpx; height: 48rpx"
            src="/static/images/common/icon_left.png"
          />
        </template>
      </u-navbar>
    </template>
    <u-back-top :scrollTop="scrollTop" mode="circle">
      <template #default>
        <image
          style="width: 96rpx; height: 96rpx"
          src="/static/images/common/icon_to_top.png"
          @click="handleBackTop"
        />
      </template>
    </u-back-top>
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
            <view
              class="popularity"
              :class="{
                flex: !isSelf,
              }"
            >
              <text class="text">{{ product.popularity || 0 }}</text>
              <text class="text">人浏览</text>
            </view>
          </view>
          <view v-if="showBargainSwitch" class="bargain-box">
            <template v-if="product.bargain_status == 1">
              <view class="bargain-status" @tap="handleBargainStatus">
                <image
                  class="icon"
                  src="/static/images/sell/icon_bargain_open.png"
                ></image>
                <text class="text">可议价</text>
              </view>
            </template>
            <template v-else>
              <view class="bargain-status" @tap="handleBargainStatus">
                <image
                  class="icon"
                  src="/static/images/sell/icon_bargain_close.png"
                ></image>
                <text class="text">已锁价</text>
              </view>
            </template>
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
            <text class="text">{{ formatDate(product.saleable_time) }}</text>
          </view>
          <view class="goods-id">
            <text class="text">编号 </text>
            <copy-view
              :content="`${product.product_id}`"
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

      <goods-server :product="product" />
    </view>
    <view class="detail-box" :style="`height: ${windowHeight}px`">
      <view class="detail-current">
        <view id="current1">
          <goods-screenshot-info
            v-if="screenshotInfo.length"
            :items="screenshotInfo"
          />
        </view>
        <view id="current2">
          <goods-game-info v-if="product.product_id" :product="product" />
        </view>
        <view id="current3">
          <goods-compensation-info
            v-if="product.product_id"
            :type="product.type"
          />
        </view>
        <!-- <template v-if="current == 0">
            <goods-screenshot-info :items="screenshotInfo" />
          </template>
          <template v-if="current == 1">
            <goods-game-info :product="product" />
          </template>
          <template v-if="current == 2">
            <goods-compensation-info />
          </template> -->
      </view>
    </view>
    <view
      v-if="
        product.product_type != ProductTypeEnum.SECKILL &&
        product.product_type != ProductTypeEnum.GUARANTEE &&
        product.product_type != ProductTypeEnum.RECYCLE &&
        product.product_id
      "
      class="detail-operation"
    >
      <!-- 卖家按钮-->
      <template v-if="product.uid == userStore.userInfo?.uid">
        <GoodsSellerOperation
          :product="product"
          @on-modify-price="handleModifyPrice"
          @put="putPopupRef.open"
        />
      </template>

      <template v-else>
        <view
          class="operation-content"
          :class="{
            end: !showFeatureBtn && !showPutBtn,
          }"
        >
          <template v-if="showFeatureBtn || showPutBtn">
            <view class="icon-box">
              <view
                v-if="!isSelf && product.merchant_type"
                class="item"
                @click="handleGoMerchant"
              >
                <image class="icon" src="/static/images/my/icon_service.png" />
                <text class="text">咨询</text>
              </view>
              <view v-if="!showPutBtn" class="item" @click="handleCollection">
                <image
                  class="icon"
                  :src="`/static/images/sell/${collection ? 'icon_collect_active' : 'icon_collect'}.png`"
                />
                <text class="text">收藏</text>
              </view>
              <template v-if="!isSelf && product.bargain_status == 1">
                <view
                  v-if="showBargainBtn"
                  class="item"
                  :style="{
                    opacity: userStore.userInfo?.remainingCount <= 0 ? 0.4 : 1,
                  }"
                  @click="handleCheckAuth('bargain')"
                >
                  <image
                    class="icon"
                    src="/static/images/sell/icon_yijia.png"
                  />
                  <text class="text">议价</text>
                </view>
                <view v-else class="item" @click="handleCheckBargain">
                  <image
                    class="icon"
                    src="/static/images/sell/icon_yijia.png"
                  />
                  <text class="text">议价</text>
                </view>
              </template>
            </view>
          </template>
          <!-- 已下架和是自己发布的可重新上架 -->
          <template v-if="showPutBtn">
            <view class="operation-box">
              <view class="buy" @click="putPopupRef.open"
                ><text class="text">重新上架</text></view
              >
            </view>
          </template>
          <template v-else>
            <view
              class="operation-box"
              :style="{ paddingBottom: safeAreaPadding() }"
            >
              <template v-if="showFeatureBtn">
                <view class="buy" @click="handleCheckAuth('buy')">
                  <text class="text">{{
                    product.stock_count ? "立即购买" : "暂无库存"
                  }}</text>
                </view>
              </template>
              <template v-else>
                <view class="buy" style="opacity: 0.6"
                  ><text class="text">已下架</text></view
                >
              </template>
            </view>
          </template>
        </view>
      </template>
    </view>
    <bargain-popup
      ref="bargainingRef"
      :product="product"
      @reload="handleCreateBargain"
    />
    <purchase-popup ref="purchasePopupRef" />
    <put-popup ref="putPopupRef" :product="product" />
  </global-view>
</template>

<script setup>
import {
  ProductStatus,
  ProductTypeEnum,
  ProductLabelTypeEnum,
} from "@/enums/product";
import { PurchaseStatus, BargainStatus } from "@/enums/order";
import { ref, reactive, computed, nextTick } from "vue";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { getProductInfo, editProductBargainStatus } from "@/api/product";
import {
  // consultCustomerService,
  navigateToPMerchantContact,
} from "@/components/im/conversation-list";
import GlobalView from "@/components/global-view/index.vue";
import BargainPopup from "@/pages/bargain/components/bargain-popup.vue";
import PurchasePopup from "./components/purchase-popup.vue";
import PutPopup from "./components/put-popup.vue";
import GoodsServer from "./components/goods-server.vue";
import GoodsCompensationInfo from "./components/goods-compensation-info.vue";
import GoodsScreenshotInfo from "./components/goods-screenshot-info.vue";
import GoodsGameInfo from "./components/goods-game-info.vue";
import GoodsSellingPoint from "./components/goods-selling-point.vue";
import GoodsSellerOperation from "./components/goods-seller-operation.vue";
import CopyView from "@/components/copy/copy.vue";
import MoreText from "@/components/more-text/more-text.vue";
import dayjs from "dayjs";
import { useProductStore } from "@/stores/product";
import { useUserStore } from "@/stores/user";
import { useMainStore } from "@/stores/main";
import { queryByProductId, getOrderPurchasePreview } from "@/api/order";
import { toLogin, checkIsLogin } from "@/utils/login";
import { throttle } from "lodash-es";
import { activeStyle, barStyle } from "@/utils/operation-style";
import Events, { report, ReportStatus } from "@/utils/report/report";
import { MerchantContactEnter } from "@/enums/common";
import { safeAreaPadding } from "@/utils";

const tabsStyle = reactive({
  width: "320rpx",
});

const inactiveStyle = reactive({
  color: "#606060",
  width: "70rpx",
  textAlign: "center",
  fontSize: "32rpx",
  fontWeight: "400",
});

const windowHeight = uni.getSystemInfoSync().windowHeight;
const productStore = useProductStore();
const userStore = useUserStore();
const mainStore = useMainStore();
const current = ref(0);
const currentTop = ref([]);
const scrollTop = ref(0);
const coverCurrent = ref(0);
const bargainingRef = ref(null);
const global = ref(null);
const purchasePopupRef = ref(null);
const list = reactive([
  { id: 0, name: "商品" },
  { id: 1, name: "详情" },
  { id: 2, name: "说明" },
]);

const product = ref({});
const screenshotInfo = ref([]);
const bargain = ref(null);
const collection = ref(false);
const putPopupRef = ref(null);

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

// 是否登录
const isLogin = computed(() => {
  return checkIsLogin();
});

// 是否实名认证
const isCertified = computed(() => {
  return userStore.userInfo?.identifyNum;
});

// 是否显示议价开关
const showBargainSwitch = computed(() => {
  // 不是自己发布的商品，不是捡漏商品，没有存在议价单 可进行议价
  const { product_label = [], status_type } = product.value;
  return (
    isSelf.value &&
    !product_label.includes(ProductLabelTypeEnum.LEAK) &&
    [ProductStatus.ON_SALE].includes(status_type)
  );
});

// 是否是自己发布的商品
const isSelf = computed(() => {
  return product.value.uid === userStore.userInfo?.uid;
});

// 是否显示议价按钮
const showBargainBtn = computed(() => {
  // 不是自己发布的商品，不是捡漏商品，没有存在议价单 可进行议价
  const { product_label = [] } = product.value;
  const isLeaks = product_label.includes(ProductLabelTypeEnum.LEAK); // 是否是捡漏商品
  const isBargain =
    bargain.value &&
    [
      BargainStatus.WAIT_SELLER,
      BargainStatus.WAIT_BUYER,
      BargainStatus.BUY_AGREE,
      BargainStatus.SELLER_AGREE,
    ].includes(bargain.value); // 有议价单且不是已完成状态
  if (isLeaks || isBargain) {
    return false;
  }
  return true;
});

// 是否显示帮助按钮
const showFeatureBtn = computed(() => {
  return product.value.status_type != ProductStatus.OFF_SALE;
});

const showPutBtn = computed(() => {
  const { status_type } = product.value;
  return (
    [ProductStatus.OFF_SALE, ProductStatus.NOT_APPROVED].includes(
      status_type
    ) && isSelf.value
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
  }
  if (userStore.userInfo) {
    getProductCollection();
    getProductBargain();
  }
  productStore.setLookingProduct(product.value);
});

const handleModifyPrice = (price) => {
  product.value.product_price = price;
};

onShow(() => {
  //
});
onUnload(() => {
  //
});

// 获取收藏状态
const getProductCollection = async () => {
  const res = await userStore.judgeWhetherCollectionProduct(
    product.value.product_id
  );
  if (res) {
    collection.value = res[product.value.product_id];
  }
};

// 获取议价状态
const getProductBargain = async () => {
  const res = await queryByProductId(product.value.product_id);
  if (res) {
    bargain.value = res.bargain_status;
  }
};

const handleCreateBargain = () => {
  getProductBargain();
};

const handleCheckAuth = async (type) => {
  if (!isLogin.value) {
    toLogin();
    return;
  }

  if (!isCertified.value) {
    mainStore.toggleRealPopup(true);
    return;
  }

  if (type == "buy") {
    if (userStore.userInfo.uid == product.value.uid) {
      uni.$main.toast("不能购买自己的商品");
      return;
    }
  }

  uni.$main.showLoading();
  await getOrderPurchasePreview({ product_id: product.value.product_id })
    .then((res) => {
      // uni.$main.hideLoading();
      if (type == "bargain") {
        report(Events.PRODUCT_NEGOTIATE_PRICE, reportOrderData.value);
        handleBargain();
      }
      if (type == "buy") {
        report(Events.PRODUCT_BUY, reportOrderData.value);
        handleBuy(res);
      }
    })
    .catch(({ code }) => {
      // uni.$main.hideLoading();
      // 重复下单
      if (code && code == PurchaseStatus.ORDER_DUPLICATE) {
        if (type == "bargain") {
          uni.$main.toast("存在待支付订单，待订单失效后再议价");
        }
        if (type == "buy") {
          purchasePopupRef.value.open();
        }
      }
    });
};

const handleBargain = async () => {
  const { userInfo } = userStore;
  if (userInfo?.remainingCount <= 0) {
    uni.$main.toast(
      `议价已达上限${userInfo?.globalRemainingCount}次，请明日再试~`
    );
    return;
  }
  await userStore.getMyInfoV2({
    order_bargain_resp: true,
    order_unread_resp: true,
  });
  bargainingRef.value.open();
};

const handleCheckBargain = () => {
  if (!isLogin.value) {
    toLogin();
    return;
  }

  if (!isCertified.value) {
    mainStore.toggleRealPopup(true);
    return;
  }

  const bidder =
    product.value.uid != userStore?.userInfo?.uid ? "buyer" : "seller";

  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 2];
  if (currentPage?.route?.includes("bargain")) {
    uni.navigateBack();
  } else {
    uni.navigateTo({
      url: `/pages/bargain/list?bidder=${bidder}`,
    });
  }
};

const handleCollection = throttle(async () => {
  if (!isLogin.value) {
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

async function getPageScrollTop(item) {
  const query = uni.createSelectorQuery().in(this);

  return new Promise((resolve) => {
    nextTick(() => {
      query
        .select("#" + item)
        .boundingClientRect((data) => {
          console.log(data);
          resolve(Math.round(data?.top));
        })
        .exec();
    });
  });
}

nextTick(async () => {
  // const query = uni.createSelectorQuery().in(this);

  setTimeout(async () => {
    for (let i = 0; i < list.length; i++) {
      const top = await getPageScrollTop(`current${i + 1}`);
      currentTop.value.push(top);
    }
  }, 2000);
});

const tabsChangeActive = ref(false);

const tabsChange = async (index) => {
  current.value = index;
  tabsChangeActive.value = true;
  setTimeout(() => {
    tabsChangeActive.value = false;
  }, 1000);
  global.value.pageScrollToTop(currentTop.value[index] + 5);
};
// const handleGoIm = async () => {
//   report(Events.PRODUCT_CS, reportOrderData.value);
//   await consultCustomerService(product.value);
// };
const handleGoMerchant = () => {
  if (!isLogin.value) {
    toLogin();
    return;
  }
  if (isSelf.value) {
    uni.$main.toast("不能联系自己");
  } else {
    report(Events.SELL_RECYCLE_CS, { uid: product.value.uid });
    navigateToPMerchantContact(
      { uid: product.value.uid },
      MerchantContactEnter.PRODUCT_DETAILS,
      product.value
    );
  }
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

const handleBuy = (data) => {
  console.log(data);
  const { product_id } = product.value;
  if (product_id) {
    const params = uni.$u.queryParams({
      product_id,
    });
    uni.navigateTo({ url: "/pages/goods/front-buy" + params });
  }
};

const previewImage = () => {
  const { product_type, product_covert } = product.value;
  const list =
    product_type == ProductTypeEnum.ACCOUNT
      ? screenshotInfo.value
      : [product_covert];
  uni.previewImage({
    urls: list,
    current: coverCurrent.value,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleGoSecurity = () => {
  uni.navigateTo({ url: "/pages/my/security-center/index" });
};

const handleBargainStatus = async () => {
  const { product_id, bargain_status } = product.value;
  if (!isSelf.value) return;
  const bargainStatus = bargain_status == 1 ? 2 : 1;
  const msg = bargain_status == 1 ? "价格已锁定" : "议价已开启";
  await editProductBargainStatus({
    productId: product_id,
    bargainStatus,
  });
  product.value.bargain_status = bargainStatus;
  uni.$main.toast(msg);
};

const handleScroll = (e) => {
  if (tabsChangeActive.value) return;

  scrollTop.value = e.detail.scrollTop;
  if (scrollTop.value >= currentTop.value[0]) {
    current.value = 0;
  }
  if (scrollTop.value >= currentTop.value[1]) {
    current.value = 1;
  }
  if (scrollTop.value >= currentTop.value[2]) {
    current.value = 2;
  }
};

const handleBackTop = () => {
  console.log("进入");
  global.value.pageScrollToTop(0);
};

const back = () => {
  uni.navigateBack();
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
.z-tabBox {
  background: #fff;
  padding: 24rpx;
  padding-top: 0;
  padding-bottom: 0rpx;
  .box-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    .back-icon {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      left: 2rpx;
      top: 16rpx;
      z-index: 2;
    }
  }
}

/* .detail-tab {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: 24rpx;
  margin-bottom: 2rpx;
  box-sizing: border-box;
} */
.detail-box {
  display: flex;
  flex-direction: column;
  flex: 1;
  box-sizing: border-box;
  margin-bottom: 250rpx;
  &::-webkit-scrollbar {
    display: none;
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
      margin-bottom: 24rpx;
      .price-box {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        flex: 1;
        .mark {
          font-weight: 800;
          font-size: 28rpx;
          color: #1a1a1a;
          margin-right: 4rpx;
          position: relative;
          top: -12rpx;
        }
        .text {
          font-weight: 800;
          font-size: 56rpx;
          color: #1a1a1a;
        }
        .popularity {
          @include flex(row);
          align-items: center;
          justify-content: flex-end;
          margin-left: 16rpx;
          .text {
            margin-top: -40rpx;
            font-weight: 400;
            font-size: 22rpx;
            color: #afafaf;
          }
          &.flex {
            flex: 1;
          }
        }
        .bargain-box {
          @include flex(row);
          align-items: center;
          justify-content: flex-end;
          flex: 1;
        }
      }
      .bargain-status {
        width: 176rpx;
        height: 64rpx;
        background: #f4f5f6;
        border-radius: 114rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          height: 36rpx;
          width: 36rpx;
          margin-right: 8rpx;
        }
        .text {
          font-weight: 500;
          font-size: 28rpx;
          color: #606060;
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
      background: linear-gradient(to right, #f5f5f7, #fff);
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      .goods-id {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
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
    box-shadow: 0rpx -8rpx 32rpx 0rpx rgba(0, 0, 0, 0.04);
    &.end {
      justify-content: flex-end;
    }

    .icon-box {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-right: 24rpx;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        margin-right: 12rpx;
        border: none;
        .icon {
          width: 52rpx;
          height: 52rpx;
        }
        .text {
          font-weight: 400;
          font-size: 28rpx;
          color: #afafaf;
        }
      }
    }
    .operation-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: 1;

      .buy {
        flex: 1;
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
