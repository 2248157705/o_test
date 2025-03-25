<template>
  <!-- 欢迎进群 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view>{{ content?.desc }}</view>
    </view>
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
    </view>
    <view class="btn-box">
      <BtnPrimary v-if="isCertified" text="已认证" :disabled="true" />
      <BtnPrimary v-else text="立即认证" @click="onConfirm" />
    </view>
  </view>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import BtnPrimary from "../components/btn-primary.vue";

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
        template: "product_recovery_wait_entered",
        content: {
          title: null,
          desc: null,
          ticket_id: null,
          game_id: 0,
          game_icon: null,
          game_name: null,
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const { content } = MessageUtil({
  attach: props.attach,
});

const { isCertified, showRealPopup } = useCardUtil({
  attach: props.attach,
  to: props.to,
  idClient: props.idClient,
});

const onConfirm = () => {
  showRealPopup();
};

onMounted(() => {
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
