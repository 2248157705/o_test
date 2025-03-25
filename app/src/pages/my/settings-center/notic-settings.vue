<template>
  <GlobalView :showBar="false">
    <view class="privacy-settings-wrapper">
      <u-cell-group class="cell-group-wrapper" :border="false">
        <u-cell title="消息通知" :border="false">
          <template #label>
            <view class="describe">
              <text class="text">关闭消息通知后将无法收到应用的消息</text>
            </view>
          </template>
          <template #value>
            <u-switch
              v-model="messageNotification"
              space="2"
              activeColor="#34C792"
              inactiveColor="rgb(230, 230, 230)"
              @change="handleMessageNotification"
            >
            </u-switch>
          </template>
        </u-cell>
        <u-line color="#F4F5F6" />
      </u-cell-group>
    </view>
  </GlobalView>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
// import { toUserAgreement, toUserPrivacy } from "@/utils/index";
import GlobalView from "@/components/global-view/index.vue";

const userStore = useUserStore();

const messageNotification = ref(userStore.messageMotification);

const handleMessageNotification = (val) => {
  userStore.setMessageMotification(val);
  if (!val) uni.$main.toast("关闭后将不再接收应用通知");
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
