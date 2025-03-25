<template>
  <!-- 商品活动 -->
  <view class="card-messsage-wrapper system-box">
    <ProductInfo :attach="attach" />
    <view class="line">
      <u-line :hairline="true" color="#F4F5F6" style="margin-top: 24rpx" />
    </view>
    <view class="btn-box-row">
      <BtnLink text="前往活动" @click="handlePrimary" />
    </view>
  </view>
</template>
<script lang="ts" setup>
import { useMainStore } from "@/stores/main";
import { getRaffleActivityDetail } from "@/api/raffle";
import ProductInfo from "@/components/im/chat/message/card/components/product-info.vue";
import BtnLink from "../components/btn-link.vue";

defineProps({
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

const mainStore = useMainStore();

// 获取活动url
const fetchRaffleActivityDetail = async () => {
  const activity_id = mainStore.homeRaffle?.activity_id;
  if (!activity_id) {
    uni.$main.toast("活动已结束");
    return;
  }
  const res = await getRaffleActivityDetail(activity_id).catch((err) => {
    console.log("fetchRaffleActivityDetail", err);
  });
  if (res) {
    let url = `/pages/web-view/index?url=${import.meta.env.VITE_H5_URL}/pages/raffle/index?activity_id=${activity_id}&noShowBar=1&title=抽奖`;
    // #ifndef H5
    url = `/pages/raffle/index?activity_id=${activity_id}&noShowBar=1&title=抽奖`;
    // #endif
    uni.navigateTo({
      url: url,
    });
  }
};

const handlePrimary = () => {
  fetchRaffleActivityDetail();
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";
</style>
