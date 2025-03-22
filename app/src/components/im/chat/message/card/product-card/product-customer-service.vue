<template>
  <!-- 商品活动 -->
  <view class="card-messsage-wrapper system-box">
    <ProductInfo :attach="attach" />
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
    </view>
    <view class="btn-box-row">
      <my-button
        style="margin-top: 12rpx"
        height="40"
        width="180"
        size="28"
        color="#1cc7be"
        :open-type="OpenType.CUSTOMER_SERVICE"
        :params="{
          order_id: content?.order_id,
        }"
        text="联系客服"
        type="link"
      />
    </view>
  </view>
</template>
<script lang="ts" setup>
import { OpenType } from "@/enums/button";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import MyButton from "@/components/my-button/my-button.vue";

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
        content: {},
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
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
