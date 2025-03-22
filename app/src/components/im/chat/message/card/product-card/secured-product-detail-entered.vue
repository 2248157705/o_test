<template>
  <!-- 买家确认信息 不同意 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view>{{ content?.desc }}</view>
    </view>

    <image
      style="width: 100%"
      mode="heightFix"
      :src="content.card_image"
      @click="previewPic"
    />
  </view>
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
@import "../style/common.scss";
</style>
