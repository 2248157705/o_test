<template>
  <!-- 号商商品退款 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view>
        <text>商品ID: </text>
        <text class="content-name">{{ content?.product_id }}</text>
      </view>
      <view>
        <text>退款原因: </text>
        <text class="content-name">{{ content?.reason }}</text>
      </view>
    </view>

    <view v-if="isCanClickable()" class="btn-box-row">
      <BtnPrimary v-if="checkIsRefund" text="不同意" :disabled="true" />
      <BtnPrimary v-else-if="checkIsAgree" text="已同意" :disabled="true" />
      <template v-else>
        <BtnPrimary text="同意" @click="onConfirm" />
        <BtnInfo text="不同意" @click="onRefund" />
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
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { useMessageStore, ConfirmStatus } from "@/stores/message";
import {
  ReasonPopupUtil,
  ProductConfirmStatus,
} from "@/components/im/chat/message/card/js/reason-popup";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { productRecoveryRefund } from "@/api/chat";
import ReasonPopup from "@/components/my-popup/index.vue";
import BtnInfo from "../components/btn-info.vue";
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

const checkIsRefund = computed(() => {
  return messageStore.chatMsgStatus.order_refund === ConfirmStatus.REFUND;
});

const checkIsAgree = computed(() => {
  return messageStore.chatMsgStatus.order_refund === ConfirmStatus.AGREE;
});

const updateProductRecovery = async (opts) => {
  const res = await productRecoveryRefund(opts);
  if (res) {
    const key = getKey(
      opts.status === ProductConfirmStatus.REJECTED
        ? CardBtnType.DEFAULT
        : CardBtnType.PRIMARY
    );
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
  updateProductRecovery({
    ticket_id: content.value.ticket_id,
    status: ProductConfirmStatus.REJECTED,
    reason: reasonPopupData.reason,
  });
};

const onConfirm = () => {
  validationRule(() => {
    updateProductRecovery({
      ticket_id: content.value.ticket_id,
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
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
