<template>
  <!-- 商品录入 -->
  <view class="card-messsage-wrapper">
    <ProductInfo :attach="attach" />

    <template v-if="isCanClickable()">
      <view class="line">
        <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
      </view>
      <view class="btn-box">
        <BtnInvalid v-if="isInvalid" />
        <BtnPrimary v-else-if="checkIsEnter" text="已录入" :disabled="true" />
        <BtnPrimary v-else text="立即录入" @click="handlePrimary" />
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { ProductTypeEnum } from "@/enums/product";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import BtnInvalid from "../components/btn-invalid.vue";
import BtnPrimary from "../components/btn-primary.vue";

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

const userStore = useUserStore();
const messageStore = useMessageStore();

const { content } = MessageUtil({
  attach: props.attach,
});

const { navigateTo, isCanClickable, validationRule, isInvalid } = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by,
  to: props.to,
  idClient: props.idClient,
  time: props.msg?.time,
});

const msgCardData = computed(() => {
  const { idClient } = props.msg;
  return messageStore.chatMsgStatus.enter.find(
    (item) => item.idClient === idClient
  );
});

// 是否已录入
const checkIsEnter = computed(() => {
  if (msgCardData.value) {
    return msgCardData.value?.status;
  }
  return false;
});

const handlePrimary = () => {
  validationRule(() => {
    userStore.setGameHistory({
      id: content.value?.game_id,
      game_name: content.value?.game_name,
      icon: content.value?.game_icon,
    });
    const url = `/pages/sell-account/sell-information-enter/index?ticketId=${content.value?.ticket_id}&title=${content.value?.title}&type=${ProductTypeEnum.RECYCLE}`;
    navigateTo(url);
  });
};

onMounted(() => {
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
