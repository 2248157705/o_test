<template>
  <image
    v-if="content?.card_image"
    style="width: 100%"
    :src="content?.card_image"
    @click="previewPic"
  />
</template>
<script lang="ts" setup>
import { MessageUtil } from "@/components/im/chat/message/card/js/message";

const props = defineProps({
  to: {
    type: String,
    default: "", // 会话id
  },
  idClient: {
    //  消息唯一id
    type: String,
    default: "",
  },
  attach: {
    type: Object,
    default: () => ({
      option: {
        template: "",
        content: {
          title: "",
          desc: "",
          product_id: "",
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const { content, previewPic } = MessageUtil({
  attach: props.attach,
});
</script>
<style lang="scss" scoped>
@import "./style/common.scss";
</style>
