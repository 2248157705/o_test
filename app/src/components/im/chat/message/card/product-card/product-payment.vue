<template>
  <!-- 商品下单 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content.title }}</view>
    <view class="content">{{ content.desc }} </view>
    <template v-if="isCanClickable()">
      <BtnInvalid v-if="isInvalid" />
      <BtnPrimary v-else-if="checkIsPayed" text="已下单" :disabled="true" />
      <BtnPrimary v-else text="去下单" @click="onConfirm" />
    </template>
  </view>
  <ExistOrderPopup
    ref="existOrderPopupRef"
    title="温馨提示"
    text="已存在待支付订单，请前往订单详情！"
    showConfirmButton
    showCancelButton
    @confirm="handleOrderDetail"
  />
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { getOrderPurchasePreview } from "@/api/order";
import { PurchaseStatus } from "@/enums/order";
import { OpenType } from "@/enums/button";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { useMessageStore } from "@/stores/message";
import ExistOrderPopup from "@/components/my-popup/index.vue";
import BtnInvalid from "../components/btn-invalid.vue";
import BtnPrimary from "../components/btn-primary.vue";

// 先查询是否有存在订单，有-》订单详情，没有-》预下单页面
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

const { content } = MessageUtil({
  attach: props.attach,
});

const { navigateTo, isCanClickable, validationRule, isInvalid } = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by,
  to: props.to,
  idClient: props.idClient,
  time: props.msg?.time,
});

const existOrderPopupRef = ref(null);
const orderId = ref("");

// 是否已下单
const checkIsPayed = computed(() => {
  return messageStore.chatMsgStatus.payment;
});

// 去下单
const handlePlaceOrder = () => {
  const params = { product_id: content.value.product_id };
  getOrderPurchasePreview(params)
    .then((res) => {
      if (res) {
        const params = uni.$u.queryParams({
          product_id: content.value.product_id,
          transaction_type: OpenType.GUARANTEE,
        });
        navigateTo("/pages/goods/front-buy" + params);
      } else {
        uni.$main.toast("下单失败");
      }
    })
    .catch(({ code, data, msg }) => {
      // 重复下单
      if (code && code == PurchaseStatus.ORDER_DUPLICATE) {
        orderId.value = data.order_id;
        existOrderPopupRef.value?.open();
      } else {
        uni.$main.toast(msg || "下单失败");
      }
    });
};
const handleOrderDetail = () => {
  if (orderId.value) {
    uni.navigateTo({
      url: `/pages/order/detail?orderId=${orderId.value}`,
    });
  } else {
    uni.$main.toast("订单不存在");
  }
};

const onConfirm = () => {
  validationRule(() => {
    handlePlaceOrder();
  });
};

onMounted(() => {
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
