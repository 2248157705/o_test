<template>
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
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useMainStore } from "@/stores/main";
const mainStore = useMainStore();
const ranking = ref([]);
const quickList = reactive([
  {
    name: "订单中心",
    icon: "quick_valuation",
    click: () => {
      uni.switchTab({
        url: `/pages/audit/appstore/order`,
      });
    },
  },
  {
    name: "安全中心",
    icon: "icon_security",
    click: () => {
      uni.switchTab({
        url: "/pages/audit/appstore/security-center",
      });
    },
  },
  {
    name: "我的消息",
    icon: "quick_recycle",
    click: () => {
      uni.switchTab({ url: "/pages/message/index" });
    },
  },
  {
    name: "个人中心",
    icon: "icon_guarantee",
    click: () => {
      uni.switchTab({ url: "/pages/audit/appstore/my" });
    },
  },
]);

onLoad(async () => {
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
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.title-img {
  width: 150rpx;
  height: 32rpx;
  margin-bottom: 10rpx;
}
.quick-container {
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
      height: 300rpx;

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
    .empty-view {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding-top: 40rpx;
      .text {
        font-weight: 400;
        font-size: 26rpx;
        color: #afafaf;
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
