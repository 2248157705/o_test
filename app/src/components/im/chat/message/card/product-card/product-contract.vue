<template>
  <!-- 签署合同 -->
  <view class="card-messsage-wrapper">
    <ProductInfo :attach="attach" />

    <template v-if="isCanClickable()">
      <view class="line">
        <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
      </view>
      <view class="btn-box-row">
        <BtnPrimary v-if="checkIsContract" text="已签署" :disabled="true" />
        <template v-else>
          <BtnPrimary
            text="网页签署"
            @click="handlePrimary(ContractUrlType.H5)"
          />
          <BtnPrimary
            text="小程序签署"
            @click="handlePrimary(ContractUrlType.MP)"
          />
        </template>
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { onMounted, computed } from "vue";
import { MsgTemplate } from "@/components/im/utils/enums";
import { useMessageStore } from "@/stores/message";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import {
  openContractUrl,
  ContractUrlType,
} from "@/components/im/chat/message/card/js/nim";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
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

const messageStore = useMessageStore();

const { content, template } = MessageUtil({
  attach: props.attach,
});

const { isCanClickable, validationRule } = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by,
  to: props.to,
  idClient: props.idClient,
});

// 是否已下单
const checkIsContract = computed(() => {
  if (
    [
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_BUYER,
      MsgTemplate.PRODUCT_RECOVERY_CONTRACT_FOR_BUYER,
    ].includes(template.value)
  ) {
    return messageStore.chatMsgStatus.contract_buyer;
  } else if (
    [
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_SELLER,
      MsgTemplate.PRODUCT_RECOVERY_CONTRACT_FOR_SELLE,
    ].includes(template.value)
  ) {
    return messageStore.chatMsgStatus.contract_seller;
  }
  return false;
});

const handlePrimary = (type: ContractUrlType) => {
  validationRule(async () => {
    if (content.value.sign_task_id) {
      openContractUrl(type, content.value.sign_task_id);
    }
  });
};

onMounted(() => {
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
