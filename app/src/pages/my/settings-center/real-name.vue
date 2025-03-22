<template>
  <global-view
    bgColor="linear-gradient(to bottom, #ffffff, #F7F9FA)"
    :showBar="false"
  >
    <view style="padding: 20rpx">
      <real-verification />
    </view>
  </global-view>
</template>

<script setup>
import GlobalView from "@/components/global-view/index.vue";
import RealVerification from "@/components/real-verification/index.vue";
</script>
