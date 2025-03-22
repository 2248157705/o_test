<template>
  <GlobalView :showBar="false">
    <view class="privacy-settings-wrapper">
      <u-cell-group class="cell-group-wrapper" :border="false">
        <u-cell
          title="实名认证"
          :border="false"
          @click="navigatorToRealVerification"
        >
          <template #value>
            <view v-if="userInfo?.identifyNum" class="real-name">
              <text class="right-text no-text" :style="{ color: '#606060' }"
                >已实名</text
              >
              <u-icon name="arrow-right" color="#AFAFAF"></u-icon>
            </view>

            <view v-else class="real-name">
              <text class="right-text no-text" :style="{ color: '#606060' }"
                >未实名</text
              >
              <u-icon name="arrow-right" color="#AFAFAF"></u-icon>
            </view>
          </template>
        </u-cell>
        <u-line color="#F4F5F6" />
        <u-cell
          title="绑定手机号"
          :border="false"
          @click="navigatorToAssociatePhone"
        >
          <template #value>
            <view class="real-name">
              <text class="right-text phone"> {{ phoneVal }}</text>
              <u-icon name="arrow-right" color="#000"></u-icon>
            </view>
          </template>
        </u-cell>
        <u-line color="#F4F5F6" />
      </u-cell-group>
    </view>
  </GlobalView>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import GlobalView from "@/components/global-view/index.vue";

const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);

const phoneVal = computed(() => {
  if (userInfo.value?.is_bind_phone === 1) {
    if (userInfo.value.phone)
      return userInfo.value.phone.replace(/(?<=\d{3})\d+(?=\d{4})/, "***");
    else return userInfo.value?.phone;
  } else {
    return "去绑定";
  }
});

onShow(() => {
  userInfo.value = userStore.userInfo;
});

const navigatorToRealVerification = () => {
  if (userInfo.value?.identifyNum) {
    return;
  }
  uni.navigateTo({
    url: "/pages/my/settings-center/real-name",
  });
};

const navigatorToAssociatePhone = () => {
  uni.navigateTo({
    url: "/pages/my/settings-center/associate-phone",
  });
};
</script>
<style lang="scss" scoped>
.privacy-settings-wrapper {
  .cell-group-wrapper {
    padding: 0 20rpx 0rpx 20rpx;
  }
  .text {
    color: #606060;
    font-size: 26rpx;
  }
  .real-name {
    @include flex;
    align-items: center;
    justify-content: center;
    .no-text {
      color: #afafaf !important;
    }
    .phone {
      color: #000;
    }
  }
  .cell-value {
    @include flex;
    align-items: center;
    justify-content: center;
    .no-text {
      color: #606060 !important;
    }
  }
}
</style>
