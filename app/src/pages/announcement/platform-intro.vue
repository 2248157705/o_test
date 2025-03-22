<template>
  <global-view :scroll="false" style="overflow: hidden">
    <template #bar>
      <view id="header">
        <u-navbar
          bgColor="transparent"
          title=""
          :placeholder="true"
          :autoBack="true"
          :safeAreaInsetTop="true"
        >
          <template #left>
            <image
              src="/static/images/guarantee/Icon_back_right.png"
              class="icon-back"
            />
          </template>
        </u-navbar>
      </view>
    </template>
    <template #bgImage>
      <image class="bg" :src="src" />
      <view class="btnView">
        <image class="buyBtn btn" :src="buyBtn" @tap="goBuy" />
        <image class="sellBtn btn" :src="sellBtn" @tap="goSell" />
      </view>
    </template>
  </global-view>
</template>

<script setup>
import { ref } from "vue";
import GlobalView from "@/components/global-view/index.vue";

// 在你的页面中，你可能先定义一个元素：
// <view id="elementId">Hello World</view>
// const height = ref(0);
const path =
  import.meta.env.VITE_APP_CDN_HOST + "/taogehao/resource/images/announcement/";
const src = ref(path + "platform_intro.png");
const buyBtn = ref(path + "go-buy.png");
const sellBtn = ref(path + "go-sell.png");

const goBuy = () => {
  uni.switchTab({
    url: "/pages/buy-account/index",
  });
};

const goSell = () => {
  uni.switchTab({
    url: "/pages/sell-account/index",
  });
};
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100vh;
  position: absolute;
}
.icon-back {
  width: 48rpx;
  height: 48rpx;
}
.btnView {
  position: absolute;
  bottom: 6vh;
  left: 0;
  right: 0;
  padding: 0 51rpx;
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn {
    width: 292rpx;
    height: 83rpx;
  }
}
</style>
