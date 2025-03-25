<template>
  <u-notify ref="notifyRef"></u-notify>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getCurPage } from "@/utils/login";
import { isHuawei } from "@/utils/nim-push/mobile";

const notifyRef = ref();

const show = (opts) => {
  let safeAreaInsetTop = false;
  const fullpath = getCurPage();
  if (fullpath && fullpath.toString().includes("sell-account")) {
    safeAreaInsetTop = true;
  }

  notifyRef.value?.show({
    // top,
    type: "primary",
    color: "#FFFFFF ",
    bgColor: "#2E9D97",
    message:
      "我们需要访问您的相册和相机以便您可以拍摄或选择头像，此信息仅用于更新您的个人资料图片及向客服反馈问题",
    duration: 1000 * 2,
    safeAreaInsetTop,
    ...opts,
  });
};

onMounted(() => {
  if (isHuawei()) {
    uni.addInterceptor("chooseImage", {
      invoke() {
        show();
      },
    });
    uni.addInterceptor("chooseVideo", {
      invoke() {
        show();
      },
    });
    uni.addInterceptor("previewImage", {
      invoke() {
        // show();
      },
    });
    uni.addInterceptor("chooseFile", {
      invoke() {
        show();
      },
    });
    uni.addInterceptor("chooseMedia", {
      invoke() {
        show();
      },
    });
  }
});

defineExpose({
  show,
});
</script>

<style lang="scss" scoped></style>
