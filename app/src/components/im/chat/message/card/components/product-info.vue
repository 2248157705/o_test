<template>
  <view class="title">{{ content?.title }}</view>
  <view class="content">
    <view v-for="(item, index) in content_labels" :key="index">
      {{ item.label }}：{{ item.value }}
    </view>
    <view v-if="content?.desc">{{ content?.desc }}</view>
  </view>
</template>

<script lang="ts" setup>
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
const props = defineProps({
  pick: {
    type: Array,
    default: () => [],
  },
  attach: {
    type: Object,
    default: () => ({
      option: {
        template: "",
        content: {
          title: "",
          desc: "",
        },
      },
    }),
  },
});

const { content, content_labels } = MessageUtil({
  attach: props.attach,
  pick: props.pick,
});
</script>

<style lang="scss" scoped>
@import "../style/common.scss";
</style>
