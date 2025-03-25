<template>
  <!-- 号商买家确认收货 -->
  <view class="card-messsage-wrapper">
    <ProductInfo :attach="attach" />
    <template v-if="isCanClickable()">
      <view class="line">
        <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
      </view>
      <view class="btn-box">
        <BtnInfo v-if="isOperated()" text="已收货" />
        <BtnPrimary v-else text="确认收货" @click="handlePrimary" />
      </view>
    </template>
  </view>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { OrderStatus } from "@/enums/order";
import { updatePurchaseStatus } from "@/api/order";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
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
        template: "product_recovery_request_confirm_receipt",
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

const { option, permissions } = props.attach;

const {
  isCanClickable,
  isOperated,
  validationRule,
  updateOperationPermissions,
} = useCardUtil({
  clickable_by: permissions?.clickable_by || option?.permissions?.clickable_by, // 兼容旧数据
  to: props.to,
  idClient: props.idClient,
});

// 号商买家确认收货
const fetchUpdatePurchaseStatus = async () => {
  const res = await updatePurchaseStatus({
    order_id: content.value.order_id,
    to_order_status: OrderStatus.FINISHED,
  });
  if (res) {
    uni.$main.toast("收货成功");
    updateOperationPermissions();
  }
};

const handlePrimary = () => {
  validationRule(() => {
    fetchUpdatePurchaseStatus();
  });
};

onMounted(() => {
  //
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
