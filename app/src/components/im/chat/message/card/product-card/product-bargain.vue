<template>
  <!-- 议价详情 -->
  <view :class="classList">
    <ProductInfo :attach="attach" />

    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" />
    </view>

    <BtnText text="查看详情" @click="handlePrimary">
      <view v-if="!isRead" class="unread"></view>
    </BtnText>
  </view>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { orderBargainDetail } from "@/api/order";
import { BargainStatus } from "@/enums/order";
import { useUserStore } from "@/stores/user";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import BtnText from "@/components/im/chat/message/card/components/btn-text.vue";

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
          title: null,
          product_id: null,
          desc: null,
          bargain_no: null,
          bargain_status: null,
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const userStore = useUserStore();

const { content } = MessageUtil({
  attach: props.attach,
});

const { validationRule, classList } = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by,
  to: props.to,
  idClient: props.idClient,
  from: props.msg.from,
});

const isRead = computed(() => {
  return props.msg.status === "read";
});

const fetchOrderBargainDetail = async () => {
  const res = await orderBargainDetail({
    bargain_no: content.value?.bargain_no,
  });
  if (res) {
    const { bargain_status, bidder, buyer_id } = res;
    let forwardBargainStatus = bargain_status;
    const uid = userStore?.userInfo?.uid;
    let realBidder = bidder;
    if (bidder === "buyer" && buyer_id != uid) {
      realBidder = "seller";
    }
    if (bidder === "seller" && buyer_id == uid) {
      realBidder = "buyer";
    }

    if (bargain_status === BargainStatus.SELLER_REFUSE) {
      forwardBargainStatus = BargainStatus.LAPSE;
    }
    const url = `/pages/bargain/list?bidder=${realBidder}&bargainNo=${content.value?.bargain_no}&bargainStatus=${forwardBargainStatus}`;
    uni.navigateTo({
      url: url,
    });
  }
};

const handlePrimary = () => {
  validationRule(() => {
    fetchOrderBargainDetail();
  });
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
