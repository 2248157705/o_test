<template>
  <GlobalView :showBar="false">
    <view class="privacy-settings-wrapper">
      <u-cell-group class="cell-group-wrapper" :border="false">
        <u-cell title="个性化内容推荐" :border="false">
          <template #label>
            <view class="describe">
              <text class="text"
                >开启后将展示推荐内容，提升你浏览和购买体验</text
              >
            </view>
          </template>
          <template #value>
            <u-switch
              v-model="personalized"
              space="2"
              activeColor="#34C792"
              inactiveColor="rgb(230, 230, 230)"
              @change="handlePersonalized"
            >
            </u-switch>
          </template>
        </u-cell>
        <u-line color="#F4F5F6" />
        <u-cell title="用户协议" :border="false" @click="toUserAgreement">
          <template #value>
            <u-icon name="arrow-right" color="#AFAFAF" />
          </template>
        </u-cell>
        <u-line color="#F4F5F6" />
        <u-cell title="隐私政策" :border="false" @click="toUserPrivacy">
          <template #value>
            <u-icon name="arrow-right" color="#AFAFAF" />
          </template>
        </u-cell>
      </u-cell-group>
    </view>
  </GlobalView>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { toUserAgreement, toUserPrivacy } from "@/utils/index";
import GlobalView from "@/components/global-view/index.vue";

const userStore = useUserStore();

const personalized = ref(userStore.personalized);
const handlePersonalized = (val) => {
  userStore.setPersonalized(val);
};
</script>
<style lang="scss" scoped>
.privacy-settings-wrapper {
  padding: 0 20rpx;
  .describe {
    .text {
      font-size: 26rpx;
      color: #afafaf;
    }
  }
}
</style>
