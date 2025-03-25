<template>
  <!-- 站内信 -->
  <view class="card-messsage-wrapper system-box">
    <ProductInfo :attach="attach" />
    <view class="content-img">
      <image
        v-if="content.card_image"
        mode="widthFix"
        style="width: 100%"
        :src="content.card_image"
        @click="previewPic"
      />
    </view>

    <template v-if="content?.redirect?.button_text">
      <view class="line">
        <u-line :hairline="true" color="#F4F5F6" style="margin-top: 12rpx" />
      </view>
      <BtnText :text="content?.redirect?.button_text" @click="handlePrimary" />
    </template>
  </view>
</template>
<script lang="ts" setup>
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import BtnText from "@/components/im/chat/message/card/components/btn-link.vue";

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
        content: {},
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const { content, previewPic } = MessageUtil({
  attach: props.attach,
  from: props.msg.from,
});

const isHttpUrl = (url) => {
  const regex = /^(https?:\/\/)/i;
  return regex.test(url);
};

const handlePrimary = () => {
  const url = content.value?.redirect?.page_path?.app;
  if (url) {
    if (isHttpUrl(url)) {
      // #ifdef H5
      window.open(url);
      // #endif

      // #ifdef APP-PLUS
      uni.navigateTo({
        url: `/pages/web-view/index?url=${url}`,
      });
      // #endif
    } else {
      uni.navigateTo({
        url,
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
