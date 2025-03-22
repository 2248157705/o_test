<template>
  <my-empty style="padding-top: 200rpx" :tip="'暂无新通知哦~'" />
</template>
<script setup>
import { onLoad } from "@dcloudio/uni-app";

onLoad((options) => {
  const { title } = options;
  uni.setNavigationBarTitle({
    title: title,
  });
});
</script>
