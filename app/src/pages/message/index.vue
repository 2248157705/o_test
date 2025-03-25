<template>
  <global-view>
    <template #bar>
      <u-navbar
        title=""
        :placeholder="true"
        :safeAreaInsetTop="true"
        :autoBack="false"
        bgColor="transparent"
      >
        <template #left>
          <!-- <text class="u -nav-title"> 消息!999 </text> -->
          <u--image
            src="/static/images/im/my/message-page-title.png"
            width="148rpx"
            height="36rpx"
          />
        </template>
        <template #right>
          <view class="i-right" @click="resetMessage">
            <text class="title">清除未读</text>
            <u--image
              src="/static/images/im/list/5.png"
              width="48rpx"
              height="48rpx"
            />
          </view>
        </template>
      </u-navbar>
    </template>
    <search
      :disabled="false"
      :boxStyle="boxStyle"
      @search="searchSession"
      @change="searchSession"
    />
    <ConversationList ref="sessionRef" />
    <message-modal ref="msgModalRef"></message-modal>
  </global-view>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ConversationList from "@/components/im/conversation-list/index.vue";
import { trackInit } from "@/components/im/utils/reporter";
import GlobalView from "@/components/global-view/index.vue";
import Search from "@/components/search/index.vue";

import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import MessageModal from "@/pages/message/components/message-modal.vue";
import { toLogin } from "@/utils/login";

const userStore = useUserStore();
const messageStore = useMessageStore();
const msgModalRef = ref(null);
const sessionRef = ref(null);

trackInit("ConversationUIKit");
onShow(() => {
  // 重置选中会话
  if (messageStore.isConected) {
    console.log("uni.$UIKitStore", uni.$UIKitStore);
    uni.$UIKitStore?.uiStore.selectSession("");
  }
});
const searchSession = (val) => {
  sessionRef.value && sessionRef.value.searchSession(val);
};
const boxStyle = { flex: 1 };
const resetMessage = () => {
  if (userStore?.userInfo?.token && messageStore.isConected) {
    const unread = uni.$UIKitStore?.uiStore?.sessionUnread || 0;
    if (unread) {
      msgModalRef.value?.open();
    } else {
      uni.$u.toast("当前无新消息提示，无需清除");
    }
  } else {
    toLogin("/pages/message/index");
  }
};
</script>

<style lang="scss" scoped>
.u-nav-title {
  font-style: italic;
  font-weight: 800;
  color: #1a1a1a;
  font-size: 38rpx;
}
.i-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .title {
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
    margin: 0rpx 10rpx;
  }
}
</style>
