<template>
  <div class="card-messsage-wrapper" @click="onClick">
    <u--image
      class="image"
      width="100rpx"
      height="90rpx"
      radius="6rpx"
      :src="content?.product_covert"
      mode="scaleToFill"
    />
    <view class="info">
      <u-text
        bold
        color="#1A1A1A"
        size="28rpx"
        :lines="1"
        :text="content?.product_title"
      ></u-text>
      <u-text
        bold
        color="#1A1A1A"
        size="28rpx"
        mode="price"
        :text="+(content?.product_price || 0)"
      ></u-text>
    </view>
  </div>
</template>

<script lang="ts" setup>
import { MessageUtil } from "@/components/im/chat/message/card/js/message";

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
        template: "product_detail",
        content: {
          product_id: null,
          product_covert: null,
          product_title: null,
          product_price: null,
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

const onClick = () => {
  uni.navigateTo({
    url: `/pages/goods/detail?product_id=${content.value?.product_id}`,
  });
};
</script>
<style lang="scss" scoped>
.card-messsage-wrapper {
  @include flex;

  .info {
    margin-left: 14rpx;
    flex: 1;
    @include flex(column);
    width: 200rpx;
  }
}
</style>
