<template>
  <component
    :is="activeTab"
    :to="to"
    :msg="msg"
    :idClient="msg.idClient"
    :attach="msg.attach"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MsgTemplate } from "@/components/im/utils/enums";

import ProductPaymentPenalty from "./product-card/product-payment-penalty.vue";
import ProductDetail from "./product-card/product-detail.vue";
import ProductDetailEnter from "./product-card/product-detail-enter.vue";
import ProductRecoveryConfirm from "./product-card/product-recovery-confirm.vue";
import ProductRecoveryRefund from "./product-card/product-recovery-refund.vue";
import ProductContract from "./product-card/product-contract.vue";
import ProductMessage from "./product-card/product-message.vue";
import ProductActivity from "./product-card/product-activity.vue";
import ProductBargain from "./product-card/product-bargain.vue";
import ProductValuation from "./product-card/product-valuation.vue";
import ProductCustomerService from "./product-card/product-customer-service.vue";
import ProductRecoveryOrderRefund from "./product-card/product-recovery-order-refund.vue";
import ProductRecoveryConfirmReceipt from "./product-card/product-recovery-confirm-receipt.vue";

import SecuredWelcome from "./product-card/secured-welcome.vue";
import SecuredProductDetailEnter from "./product-card/secured-product-detail-enter.vue";
import SecuredProductDetailEntered from "./product-card/secured-product-detail-entered.vue";
import SecuredProductConfirm from "./product-card/secured-product-confirm.vue";
import SecuredTransactionPaymentOrder from "./product-card/product-payment.vue";

import RobotMessage from "./product-card/robot-message.vue";
import AppMessage from "./product-card/app-message.vue";
import MsgOther from "./msg-other.vue";

const props = defineProps({
  scene: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  msg: {
    type: Object,
    default: () => ({
      idClient: undefined,
      body: undefined,
      attach: {
        option: {
          template: undefined,
          content: undefined,
        },
      },
      type: undefined,
      from: undefined,
      to: undefined,
      scene: undefined,
      time: undefined,
    }),
    required: true,
  },
});

const template = computed(() => props.msg.attach?.option?.template);

const activeTab = computed(() => {
  const msgTemp = template.value;
  if ([MsgTemplate.PRODUCT_DETAIL].includes(msgTemp)) {
    return ProductMessage; // 商品卡片链接显示
  } else if ([MsgTemplate.PAYMENT_PENALTY].includes(msgTemp)) {
    return ProductPaymentPenalty; // 违约金支付
  } else if (
    [MsgTemplate.SECURED_TRANSACTION_PAYMENT_ORDER].includes(msgTemp)
  ) {
    return SecuredTransactionPaymentOrder; // 去下单
  } else if (
    [
      MsgTemplate.SECURED_TRANSACTION_DESC,
      MsgTemplate.PRODUCT_RECOVERY_DESC,
    ].includes(msgTemp)
  ) {
    return SecuredWelcome; // 欢迎进群
  } else if (
    [MsgTemplate.SECURED_TRANSACTION_PRODUCT_WAIT_ENTERED].includes(msgTemp)
  ) {
    return SecuredProductDetailEnter; // 担保商品录入信息
  } else if (
    [
      MsgTemplate.SECURED_TRANSACTION_PRODUCT_ENTERED,
      MsgTemplate.SECURED_TRANSACTION_PRODUCT_BUYER_AGREED,
      MsgTemplate.SECURED_TRANSACTION_BUYER_PAYMENT_COMPLETED,
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_BUYER_SIGN_COMPLETED,
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_SELLER_SIGN_COMPLETED,
      MsgTemplate.PRODUCT_RECOVERY_BUYER_PAYMENT_COMPLETED,
      MsgTemplate.PRODUCT_RECOVERY_CONTRACT_BUYER_SIGN_COMPLETED,
      MsgTemplate.SECURED_TRANSACTION_PRODUCT_BUYER_DISAGREED,
    ].includes(msgTemp)
  ) {
    return SecuredProductDetailEntered; // 担保商品已录入
  } else if (
    [MsgTemplate.SECURED_TRANSACTION_PRODUCT_CONFIRM].includes(msgTemp)
  ) {
    return SecuredProductConfirm; // 担保商品确定
  } else if ([MsgTemplate.PRODUCT_RECOVERY_WAIT_ENTERED].includes(msgTemp)) {
    return ProductDetailEnter; // 商品录入信息
  } else if (
    [
      MsgTemplate.SECURED_TRANSACTION_PRODUCT_DETAIL,
      MsgTemplate.PRODUCT_RECOVERY_PRODUCT_DETAIL,
    ].includes(msgTemp)
  ) {
    return ProductDetail; // 商品信息
  } else if ([MsgTemplate.PRODUCT_RECOVERY_PRODUCT_CONFIRM].includes(msgTemp)) {
    return ProductRecoveryConfirm; // 商家确认信息
  } else if (
    [MsgTemplate.PRODUCT_RECOVERY_PRODUCT_BUYER_DISAGREED].includes(msgTemp)
  ) {
    return ProductRecoveryRefund; // 商家确认信息 不同意
  } else if ([MsgTemplate.ROBOT_QA_LIST].includes(msgTemp)) {
    return RobotMessage; // QA
  } else if (
    [
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_BUYER,
      MsgTemplate.SECURED_TRANSACTION_CONTRACT_FOR_SELLER,
      MsgTemplate.PRODUCT_RECOVERY_CONTRACT_FOR_BUYER,
    ].includes(msgTemp)
  ) {
    return ProductContract; // 合同
  } else if (
    [
      MsgTemplate.PRODUCT_COUNTER_OFFER,
      MsgTemplate.PRODUCT_COUNTER_OFFER_ACCEPTED,
      MsgTemplate.PRODUCT_COUNTER_OFFER_REJECTED,
      MsgTemplate.PRODUCT_PRICE_REDUCE_ACCEPTED,
    ].includes(msgTemp)
  ) {
    return ProductBargain; // 议价
  } else if ([MsgTemplate.ACTIVITY_PARTICIPATION].includes(msgTemp)) {
    return ProductActivity; // 商品活动
  } else if (
    [MsgTemplate.ACTIVITY_WINNER, MsgTemplate.ACTIVITY_NON_WINNER].includes(
      msgTemp
    )
  ) {
    return ProductCustomerService; // 咨询客服
  } else if ([MsgTemplate.VALUATION_RESULT].includes(msgTemp)) {
    return ProductValuation; // 商品估价
  } else if ([MsgTemplate.PRODUCT_RECOVERY_ORDER_REFUND].includes(msgTemp)) {
    return ProductRecoveryOrderRefund; // 号商商品退款
  } else if ([MsgTemplate.APP_MESSAGE].includes(msgTemp)) {
    return AppMessage; // 站内信
  } else if (
    [MsgTemplate.PRODUCT_RECOVERY_REQUEST_CONFIRM_RECEIPT].includes(msgTemp)
  ) {
    return ProductRecoveryConfirmReceipt; // 请商家确认收货
  } else {
    return MsgOther;
  }
});
</script>
