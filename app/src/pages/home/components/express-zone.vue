<template>
  <view v-if="activityList.length" class="activity-container">
    <u-swiper
      :list="activityList"
      radius="0"
      height="240rpx"
      keyName="icon"
      indicator
      indicatorMode="line"
      circular
      @tap="handleClickSwiper"
      @change="(e) => (swiperCurrent = e.current)"
    >
      <template #indicator>
        <view class="indicator">
          <view
            v-for="(item, index) in activityList"
            :key="index"
            class="indicator__dot"
            :class="[index === swiperCurrent && 'indicator__dot--active']"
          >
          </view>
        </view>
      </template>
    </u-swiper>
  </view>
  <view class="quick-container">
    <view
      v-for="(item, index) in quickList"
      :key="index"
      class="quick-item"
      @tap="item.click"
    >
      <image
        class="icon"
        :src="`/static/images/home/${item.icon}.png`"
        style="width: 84rpx; height: 84rpx; filter: brightness(50%)"
      ></image>
      <text class="name">{{ item.name }}</text>
    </view>
  </view>
  <view class="express-zone">
    <view class="first-child" @tap="handleGoLeader">
      <view class="msg">
        <view class="msg-title">
          <!-- <text class="msg-first">昨日成交</text> -->
          <image
            class="title-img"
            src="/static/images/home/yesterday-transaction-title.png"
          />
          <text class="msg-num">{{
            mainStore.yesterdaySum || "暂无数据"
          }}</text>
        </view>
        <view class="ranking">
          <u-skeleton
            rows="3"
            :loading="!ranking.length"
            :title="false"
            rowsWidth="280rpx"
            rowsHeight="35rpx"
          >
            <template v-for="(item, index) in ranking" :key="index">
              <view class="ranking-item">
                <image class="icon" :src="item.icon" />
                <view class="game-msg">
                  <text class="num" :style="`color:${turnoverColor[index]}`"
                    >NO.{{ index + 1 }}</text
                  >
                  <view class="name">
                    <u--text
                      :lines="1"
                      lineHeight="34rpx"
                      size="28rpx"
                      :block="false"
                      color="#675757"
                      :text="item.game_name"
                    ></u--text>

                    <text
                      class="msg-num"
                      :class="{
                        default: item.order_num == '暂无数据',
                      }"
                      :style="`color:${turnoverColor[index]}`"
                      >{{ item.order_num }}</text
                    >
                  </view>
                </view>
              </view>
            </template>
          </u-skeleton>
        </view>
        <view class="more">
          <text class="text">更多排行</text>
          <u-icon name="arrow-right" color="#AFAFAF" size="10"></u-icon>
          <!-- <image class="icon" src="/static/images/common/icon_right_bold.png" /> -->
        </view>
      </view>
    </view>
    <view class="last-child">
      <view class="child child-top" @tap="handleSnapUp">
        <view class="msg">
          <!-- <text class="msg-first">一元抢购</text> -->
          <image
            class="title-img"
            src="/static/images/home/anchor-benefits-title.png"
          />
          <text class="msg-last margin">宝藏好货</text>
          <text class="msg-last">等你来抢</text>
        </view>
        <view class="icon-item">
          <image
            class="icon"
            src="/static/images/home/zone_leak.png"
            style="width: 148rpx; height: 148rpx"
          ></image>
        </view>
      </view>
      <view class="child child-bottom" @tap="handleSafety">
        <view class="msg">
          <!-- <text class="msg-first">捡漏专区</text> -->
          <image
            class="title-img"
            src="/static/images/home/detect-leakage-title.png"
          />
          <text class="msg-last margin">好物挑选</text>
          <text class="msg-last">超高性价比</text>
        </view>
        <view class="icon-item">
          <image
            class="icon"
            src="/static/images/home/zone_recommend.png"
            style="width: 168rpx; height: 148rpx"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useMainStore } from "@/stores/main";
import { useUserStore } from "@/stores/user";
import { toLogin, checkIsLogin } from "@/utils/login";
import { ProductTypeEnum } from "@/enums/product";
import { getBannerList } from "@/api/common";
import Events, { report } from "@/utils/report/report";
import { routerPush } from "@/utils/login";
// import { getRaffleActivityDetail } from "@/api/raffle";
const mainStore = useMainStore();
const userStore = useUserStore();
const ranking = ref([]);
const swiperCurrent = ref(0);
const turnoverColor = ["#F93F33", "#FF8833", "#FFC633"];
const activityList = ref([]);
const quickList = reactive([
  // {
  //   name: "游戏交易",
  //   icon: "quick_deal",
  //   url: "/components/quick-certification/index",
  //   click: () => handleMoreAccount(),
  // },
  {
    name: "一键估价",
    icon: "quick_valuation",
    url: "/components/quick-certification/index",
    click: () => {
      report(Events.HOME_APPRAISE);
      // uni.navigateTo({
      //   url: `/pages/sell-account/sell-game-enter/index?title=一键估价&type=${ProductTypeEnum.VALUATION}`,
      // });
      uni.navigateTo({
        url: `/pages/web-view/index?url=${import.meta.env.VITE_H5_URL}/pages/valuation/index&noShowBar=1&title=估价`,
        // url: `/pages/web-view/index?url=http://192.168.104.5:5186/pages/valuation/index&noShowBar=1&title=估价`,
      });
    },
  },
  {
    name: "闪电回收",
    icon: "quick_recycle",
    url: "/components/quick-certification/index",
    click: () => {
      // uni.$main.toast("该功能还未上线");
      report(Events.HOME_RECYCLE);
      uni.navigateTo({
        url: `/pages/sell-account/sell-game-enter/index?title=闪电回收&type=${ProductTypeEnum.RECYCLE}`,
      });
    },
  },
  {
    name: "中介担保",
    icon: "icon_guarantee",
    url: "/components/quick-certification/index",
    click: () => {
      report(Events.HOME_GUARANTEE);
      uni.navigateTo({
        url: `/pages/sell-account/sell-game-enter/index?type=${ProductTypeEnum.GUARANTEE}&title=中介担保`,
      });
    },
  },
  {
    name: "安全中心",
    icon: "icon_security",
    url: "/components/quick-certification/index",
    click: () => {
      uni.navigateTo({
        url: "/pages/my/security-center/index",
      });
    },
  },
]);

const handleClickSwiper = () => {
  const item = activityList.value[swiperCurrent.value];
  if (item.page_path.includes("checkLogin") && !checkIsLogin()) {
    toLogin();
    return;
  }
  if (item.redirect_type == "1") {
    const path = item.keyword
      ? item.page_path + `?keyword=${item.keyword}`
      : item.page_path;

    routerPush(path);
  }
  if (item.redirect_type == "2") {
    uni.navigateTo({
      url: `/pages/web-view/index?url=${item.page_path}&title=${item.title}`,
    });
  }
};

onLoad(async () => {
  getBannerList("2").then((data) => {
    activityList.value = data.list.map((item) => {
      return {
        icon: item.image_url,
        redirect_type: item.redirect_type,
        page_path: item.page_path,
        title: item.banner_name,
        keyword: item.keyword,
      };
    });
  });
  await mainStore.getRanking();
  if (mainStore.ranking.length) {
    ranking.value = mainStore.ranking.slice(0, 3);
  } else {
    for (let i = 0; i < 3; i++) {
      ranking.value.push({
        game_name: "待排位",
        order_num: "暂无数据",
        icon: "/static/images/empty/icon_default_icon.png",
      });
    }
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleMoreAccount = () => {
  uni.switchTab({
    url: "/pages/buy-account/index",
  });
};

const handleGoLeader = () => {
  report(Events.HOME_RANKING);
  uni.navigateTo({
    url: "/pages/leader-board/index",
  });
};
const handleSnapUp = async () => {
  try {
    if (!checkIsLogin()) {
      toLogin();
      return;
    }

    report(Events.HOME_BONUS);

    await userStore.getPayConfig();

    // const { timeList, nowTimeId } = await getRaffleActivityDetail(
    //   mainStore.homeRaffle?.activity_id
    // );

    if (!mainStore.homeRaffle || !mainStore.homeRaffle.enable) {
      uni.$main.toast("敬请期待！");
      return;
    }

    // uni.navigateTo({
    //   url: `/pages/raffle/index?timeList=${JSON.stringify(timeList)}&nowTimeId=${nowTimeId}`,
    // });
    uni.navigateTo({
      url: `/pages/web-view/index?url=${import.meta.env.VITE_H5_URL}/pages/raffle/index?activity_id=${mainStore.homeRaffle?.activity_id}&noShowBar=1&title=抽奖`,
      // url: `/pages/web-view/index?url=http://192.168.104.8:5184/pages/raffle/index?activity_id=${mainStore.homeRaffle?.activity_id}&noShowBar=1&title=抽奖`,
    });
  } catch (error) {
    console.log(error);
  }
};
const handleSafety = () => {
  report(Events.HOME_PICKLEAK);
  uni.navigateTo({
    url: "/pages/pick-leaks/index",
  });
};
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.title-img {
  width: 150rpx;
  height: 32rpx;
  margin-bottom: 10rpx;
}

.activity-container {
  width: 702rpx;
  height: 240rpx;
  background-color: #fff;
  border-top-left-radius: 12rpx;
  border-top-right-radius: 12rpx;
  overflow: hidden;
  .indicator {
    @include flex(row);
    justify-content: center;
    &__dot {
      height: 6rpx;
      width: 24rpx;
      border-radius: 12rpx;
      background-color: rgba(255, 255, 255, 0.35);
      margin: 0 4rpx;
      transition: background-color 0.3s;

      &--active {
        background-color: #ffffff;
      }
    }
  }
}
.quick-container {
  width: 702rpx;
  padding: 24rpx;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  background-color: #fff;
  border-bottom-left-radius: 12rpx;
  border-bottom-right-radius: 12rpx;
  .quick-item {
    display: flex;
    align-items: center;
    justify-content: center;
    .name {
      font-size: 28rpx;
      font-weight: 600;
      margin-top: 10rpx;
    }
  }
}
.express-zone {
  width: 702rpx;
  height: 412rpx;
  margin-top: 16rpx;
  display: flex;
  flex-direction: row;
  border-radius: 4rpx;
  .first-child {
    width: 360rpx;
    height: 412rpx;
    margin-right: 16rpx;
    background: linear-gradient(to bottom, #ffebeb, #fff);
    overflow: hidden;
    border-radius: 12rpx;
    border: 2rpx solid #fff;
    padding: 24rpx;
    .msg {
      &-first {
        font-size: 32rpx;
        font-weight: 600;
        color: #1a1a1a;
      }
      &-last {
        font-size: 28rpx;
        color: #606060;
      }
      &-num {
        font-family: Barlow-SemiBold;
        color: #f00;
        font-size: 34rpx;
      }
      &-title {
        display: flex;
        flex: 1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
    }
    .ranking {
      margin-top: 10rpx;

      &-item {
        display: flex;
        flex-direction: row;
        // align-items: flex-end;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
        .icon {
          width: 72rpx;
          height: 72rpx;
          border-radius: 50%;
          margin-right: 24rpx;
        }
        .game-msg {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-bottom: 5rpx;

          .num {
            font-family: Barlow-Bold;
            font-weight: bold;
            font-size: 32rpx;
          }
          .name {
            margin-top: 4rpx;
            // width: 120rpx;
            @include flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
          }
        }
        .msg-num {
          font-family: Barlow-Medium;
          text-align: right;
          font-weight: 500;
          font-size: 28rpx;
          padding-left: 20rpx;

          &.default {
            font-size: 20rpx;
          }
        }
      }
    }
    .more {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      // margin-top: 20rpx;
      flex: 1;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #afafaf;
      }
      .icon {
        width: 24rpx;
        height: 24rpx;
        margin-left: 8rpx;
      }
    }
  }
  .last-child {
    width: 326rpx;
    .child {
      flex: 1;
      height: 198rpx;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-radius: 12rpx;
      border: 2rpx solid #fff;
      padding: 24rpx;

      .msg {
        &-first {
          font-size: 32rpx;
          font-weight: 600;
          color: #1a1a1a;
        }
        .margin {
          margin: 8rpx 0 10rpx 0;
        }
        &-last {
          font-size: 28rpx;
          color: #606060;
        }
      }
      .icon-item {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        .icon {
          margin-top: 10rpx;
        }
      }
    }
    .child-top {
      margin-bottom: 16rpx;
      padding-right: 0;
      background: linear-gradient(to bottom, #fdffe3, #ffffff);
    }
    .child-bottom {
      padding-right: 0;
      background: linear-gradient(to bottom, #ffebf4, #ffffff);
    }
  }
}
</style>
