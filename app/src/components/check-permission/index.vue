<template>
  <CheckPermissionPopup
    ref="checkPermissionPopupRef"
    title="温馨提示"
    mode="center"
    showConfirmButton
    showCancelButton
    :text="text"
    @confirm="onConfirm"
  >
  </CheckPermissionPopup>
</template>
<script lang="ts" setup>
import CheckPermissionPopup from "@/components/my-popup/index.vue";
import permission from "@/utils/permission";
import { useMainStore } from "@/stores/main";
const mainStore = useMainStore();

import { ref, watch } from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  text: {
    type: String,
    default: "请打开手机相机功能（点击确定后在权限中授权相机功能）",
  },
});
watch(
  () => mainStore.cameraPermissionPopupVisible,
  () => {}
);
permission.checkCameraPermission("camera");

const checkPermissionPopupRef = ref(null);
const onConfirm = () => {};
</script>
