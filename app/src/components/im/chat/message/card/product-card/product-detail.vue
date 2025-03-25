<template>
  <!-- 商品详情 -->
  <view class="card-messsage-wrapper">
    <view class="title">{{ content?.title }}</view>
    <view class="content">
      <view v-for="(item, index) in content_labels" :key="index">
        <text class="content-title">{{ item.label }}：</text> {{ item.value }}
      </view>
    </view>
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
    </view>

    <BtnLink :text="btnTextData.defaultText" @click="handleDefault" />
    <BtnLink
      v-if="isSeller"
      :text="btnTextData.primaryText"
      @click="handlePrimary"
    />
  </view>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { MessageUtil } from "@/components/im/chat/message/card/js/message";
import { ProductInfoUtil } from "@/components/im/chat/message/card/js/product-info";
import BtnLink from "@/components/im/chat/message/card/components/btn-link.vue";

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
          game_name: "",
          product_id: "",
          product_account: "",
          product_price: "",
          account_source: "",
          account_details: "",
          account_source_key: "",
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
});

const btnTextMap = {
  self: {
    real_name: "二次实名截图",
    contract: "网购或外卖订单截图",
  },
  platform: {
    real_name: "二次实名截图",
    contract: "合同截图",
  },
  other: {
    real_name: "二次实名截图",
    contract: "网购或外卖订单截图",
  },
};

const { content, content_labels } = MessageUtil({
  attach: props.attach,
});

const { isSeller, userScreenshotInfo, fetchIMProductInfo } = ProductInfoUtil();

const btnTextData = computed(() => {
  const { account_source_key } = content.value;
  if (account_source_key && btnTextMap[account_source_key]) {
    return {
      defaultText: `查看${btnTextMap[account_source_key].real_name}`,
      primaryText: `查看${btnTextMap[account_source_key].contract}`,
    };
  } else {
    return {
      defaultText: `查看${btnTextMap.platform.real_name}`,
      primaryText: `查看${btnTextMap.platform.contract}`,
    };
  }
});

const handleDefault = () => {
  if (userScreenshotInfo.value.real_name_pic) {
    uni.previewImage({
      urls: [userScreenshotInfo.value.real_name_pic],
      current: 0,
    });
  } else {
    uni.$main.toast("当前用户无法查看");
  }
};

const handlePrimary = () => {
  if (userScreenshotInfo.value.contract_pic) {
    uni.previewImage({
      urls: [userScreenshotInfo.value.contract_pic],
      current: 0,
    });
  } else {
    uni.$main.toast("当前用户无法查看");
  }
};

onMounted(() => {
  fetchIMProductInfo({
    productId: content.value?.product_id,
  });
});
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
