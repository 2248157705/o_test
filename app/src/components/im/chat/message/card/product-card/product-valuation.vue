<template>
  <!-- 商品估价 -->
  <view :class="classList">
    <ProductInfo :attach="attach" />
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
    </view>

    <BtnText text="查看详情" @click="handlePrimary"> </BtnText>
  </view>
</template>
<script lang="ts" setup>
import { useCardUtil } from "@/components/im/chat/message/card/js/common";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { getEstimateProductInfo } from "@/api/product";
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
          title: "",
          desc: "",
          estimate_id: "",
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

const { validationRule, classList } = useCardUtil({
  clickable_by: props.attach?.permissions?.clickable_by,
  to: props.to,
  idClient: props.idClient,
  from: props.msg.from,
});

const fetchEstimateProductInfo = async () => {
  const res = await getEstimateProductInfo(content.value.estimate_id);
  if (res && res.data) {
    let url = `/pages/valuation/detail?id=${res.data?.estimate_id}`;
    if (res.data?.estimate_type == 2) {
      url = `/pages/valuation/result?id=${res.data?.estimate_id}&gameId=${res.data?.game_id}`;
    }
    uni.navigateTo({
      url: url,
    });
  }
};

const handlePrimary = () => {
  validationRule(() => {
    fetchEstimateProductInfo();
  });
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
