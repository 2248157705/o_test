<template>
  <u-modal
    @cancel="cancel"
    @confirm="reConnect"
    :showCancelButton="true"
    confirmText="立即连接"
    :show="connectDialog"
  >
    <view class="slot-content">
      <view>当前IM连接已断开</view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import { ref } from "@/components/im/utils/transformVue";
import { login } from "@/components/im/utils/connect";

const connectDialog = ref(false);
const reConnect = () => {
  console.log("-----重连-----");
  connectDialog.value = false;
  // login()
  console.log("--------------销毁IM-----------");
  uni.$UIKitNIM?.destroy();
  uni.$UIKitNIM?.disconnect();
  uni.$UIKitStore?.destroy();
  location.reload();
};

const open = () => {
  connectDialog.value = true;
};

const cancel = () => {
  connectDialog.value = false;
};

defineExpose({
  open,
});
</script>

<style scoped lang="scss"></style>
