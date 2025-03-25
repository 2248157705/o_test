<style lang="scss" scoped>
.toggle-preview {
  display: flex;
  flex-direction: row;
  align-items: center;
  .icon {
    width: 40rpx;
    height: 40rpx;
  }
  .line {
    width: 20rpx;
    height: 40rpx;
    margin-left: 12rpx;
  }
}
</style>

<template>
  <view class="toggle-preview" @tap="handleChange">
    <image
      v-if="line"
      class="line"
      src="/static/images/common/preview-line.png"
    />
    <view v-else style="width: 20rpx"></view>
    <template v-if="userStore.togglePreview">
      <image class="icon" src="/static/images/common/preview-big.png" />
    </template>
    <template v-else>
      <image class="icon" src="/static/images/common/preview-small.png" />
    </template>
  </view>
</template>
<script setup>
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
defineProps({
  line: {
    type: Boolean,
    default: true,
  },
});
const handleChange = () => {
  userStore.togglePreview = !userStore.togglePreview;
};
</script>
