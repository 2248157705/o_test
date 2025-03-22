<template>
  <global-view :scroll="false">
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
    </template>
  </global-view>
</template>

<script setup>
import { ref } from "vue";
import GlobalView from "@/components/global-view/index.vue";

// 在你的页面中，你可能先定义一个元素：
// <view id="elementId">Hello World</view>
// const height = ref(0);
const src = ref(
  import.meta.env.VITE_APP_CDN_HOST +
    "/taogehao/resource/images/announcement/fraud_prevention_guide.png"
);
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 3811rpx;
  position: absolute;
}
.icon-back {
  width: 48rpx;
  height: 48rpx;
}
</style>
