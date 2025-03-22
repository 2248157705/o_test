<template>
  <view :class="classList">
    <ProductInfo :attach="attach" />
    <template v-if="content.card_image">
      <MsgImage :to="to" :idClient="idClient" :attach="attach" />
    </template>
    <!-- <template v-else>
      <text> [{{ t("unknowMsgText") }}] </text>
    </template> -->
  </view>
</template>
<script lang="ts" setup>
// import { t } from "@/components/im/utils/i18n";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import MsgImage from "./msg-image.vue";

const props = defineProps({
  msg: {
    type: Object,
    default: () => {
      return {};
    },
  },
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
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
  btnText: {
    type: String,
    default: "",
  },
});

const { content, classList } = MessageUtil({
  attach: props.attach,
  from: props.msg.from,
});
</script>
<style lang="scss" scoped>
@import "./style/common.scss";
</style>
