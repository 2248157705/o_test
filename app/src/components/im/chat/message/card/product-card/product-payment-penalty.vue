<template>
  <view :class="classList">
    <view class="title">违约金支付</view>
    <view class="content">
      <view
        ><text class="content-title">违约金：</text>
        {{ content?.penalty_amount }}</view
      >
      <view
        ><text class="content-title">计算公式：</text> ￥{{
          content?.calculation_formula
        }}</view
      >
      <template v-if="content?.tips && content.tips.length > 0">
        <view><text class="content-title">提示：</text></view>
        <view v-for="(item, index) in content?.tips" :key="index">
          {{ item }}
        </view>
      </template>
    </view>
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" />
    </view>
    <view class="btn-box">
      <BtnInvalid v-if="isInvalid" />
      <BtnInfo v-else-if="isPayed" text="已支付" />
      <BtnPrimary v-else text="支付" @click="handlePay" />
    </view>

    <pay-way ref="payWayRef" />
  </view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { orderPenaltyStatus } from "@/api/order";
import { OrderStatus } from "@/enums/order";
import { useCardUtil } from "../js/common";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import PayWay from "../components/pay-way.vue";
import BtnInvalid from "../components/btn-invalid.vue";
import BtnInfo from "../components/btn-info.vue";
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
    default: () => {
      return {
        template: "payment_penalty",
        content: {
          product_price: null,
          order_id: null,
          penalty_order_id: null,
          penalty_amount: null,
          calculation_formula: null,
          tips: [],
        },
      };
    },
  },
});

const { content } = MessageUtil({
  attach: props.attach,
});

const { validationRule, setOperationKey, classList, isInvalid } = useCardUtil({
  clickable_by: [],
  to: props.to,
  idClient: props.idClient,
  time: props.msg?.time,
  from: props.msg.from,
});

const payWayRef = ref(null);
const isPayed = ref(false);

const handlePay = () => {
  if (!isPayed.value) {
    validationRule(() => {
      setOperationKey();
      payWayRef.value?.open();
    });
  }
};

const checkPenaltyStatus = async () => {
  const { order_id, penalty_order_id } = content.value;
  const data = await orderPenaltyStatus({
    order_id: order_id,
    id: penalty_order_id,
    ignoreError: true,
  }).catch((err) => {
    console.log("checkPenaltyStatus", err);
  });
  if (data && data.order_id) {
    if (data.penalty_status === OrderStatus.FINISHED) {
      // 已完成支付
      isPayed.value = true;
      payWayRef.value?.close();
    } else {
      // 未完成支付
      payWayRef.value?.updatePenaltyAmount({
        penalty_order_id: data.id,
        actual_amount: data.actual_amount,
        order_id: data.order_id,
        origin_amount: data.origin_amount,
        penalty_amount: data.penalty_amount,
        penalty_channel: data.penalty_channel,
        penalty_status: data.penalty_status,
        rate_formula: data.rate_formula,
        uid: data.uid,
        user_type: data.user_type,
        pay_info_value: data?.pay_info_value,
      });
    }
  }
};

onShow(() => {
  if (!isInvalid.value) {
    checkPenaltyStatus();
  }
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
