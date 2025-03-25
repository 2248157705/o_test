<template>
  <!-- 买家确认信息 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view>
        <text>商品ID: </text>
        <text class="content-name">{{ content?.product_id }}</text>
      </view>
      <view v-if="content.desc">{{ content?.desc }} </view>
    </view>

    <view v-if="isCanClickable()" class="btn-box-row">
      <BtnPrimary v-if="checkIsAgree" text="已通过" :disabled="true" />
      <BtnPrimary v-else-if="checkIsRefund" text="不通过" :disabled="true" />
      <template v-else>
        <BtnPrimary text="通过" @click="onConfirm" />
        <BtnInfo text="不通过" @click="onRefund" />
      </template>
    </view>
  </view>
  <ReasonPopup
    ref="reasonPopupRef"
    title="原因"
    mode="center"
    showConfirmButton
    showCancelButton
    :confirmClose="false"
    @confirm="onReasonPopupConfirm"
  >
    <view class="reason-popup-content">
      <textarea
        v-model="reasonPopupData.reason"
        class="value-textarea"
        placeholder="请输入原因，便于客服处理～"
        maxlength="200"
      />
    </view>
  </ReasonPopup>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { CardBtnType } from "@/components/im/utils/enums";
import { useMessageStore, ConfirmStatus } from "@/stores/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import {
  ReasonPopupUtil,
  ProductConfirmStatus,
} from "@/components/im/chat/message/card/js/reason-popup";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { securedTransactionConfirmProduct } from "@/api/chat";
import ReasonPopup from "@/components/my-popup/index.vue";
import BtnInfo from "../components/btn-info.vue";
import BtnPrimary from "../components/btn-primary.vue";

// 只有买家才能点
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
          product_id: "",
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const messageStore = useMessageStore();

const { reasonPopupRef, reasonPopupData, openReasonPopup, closeReasonPopup } =
  ReasonPopupUtil();

const { content } = MessageUtil({
  attach: props.attach,
});

const { getKey, isCanClickable, updateOperationPermissions, validationRule } =
  useCardUtil({
    clickable_by: props.attach?.permissions?.clickable_by || [],
    idClient: props.idClient,
    to: props.to,
  });

const msgCardData = computed(() => {
  const { idClient } = props.msg;
  return messageStore.chatMsgStatus.confirm_info_buyer.find(
    (item) => item.idClient === idClient
  );
});

// 是否是拒绝
const checkIsRefund = computed(() => {
  if (msgCardData.value) {
    return msgCardData.value.status === ConfirmStatus.REFUND;
  }
  return false;
});

// 是否是同意
const checkIsAgree = computed(() => {
  if (msgCardData.value) {
    return msgCardData.value.status === ConfirmStatus.AGREE;
  }
  return false;
});

// 担保商品信息确认
const fetchSecuredTransactionConfirmProduct = async (opts) => {
  const res = await securedTransactionConfirmProduct(opts);
  if (res) {
    const key = getKey(CardBtnType.DEFAULT);
    updateOperationPermissions(key);
    uni.$main.toast("提交成功");
    closeReasonPopup();
  }
};

const onReasonPopupConfirm = () => {
  if (!reasonPopupData.reason) {
    uni.$main.toast("请输入原因");
    return;
  }
  const teamExt = messageStore.teamExt;
  fetchSecuredTransactionConfirmProduct({
    product_id: content.value?.product_id,
    ticket_id: teamExt?.ticket?.id,
    status: ProductConfirmStatus.REJECTED,
    reason: reasonPopupData.reason,
  });
};

const onConfirm = () => {
  validationRule(() => {
    const teamExt = messageStore.teamExt;
    fetchSecuredTransactionConfirmProduct({
      product_id: content.value?.product_id,
      ticket_id: teamExt?.ticket?.id,
      status: ProductConfirmStatus.ACCEPTED,
      reason: "",
    });
  });
};

const onRefund = () => {
  validationRule(() => {
    openReasonPopup();
  });
};

onMounted(() => {
  // if (isCanClickable()) {
  // }
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
