<template>
  <z-paging
    ref="pagingRef"
    nvue-list-id="z-paging-nlist"
    refresher-only
    hide-nvue-bottom-tag
    :style="{ height: `${height}px` }"
    :enable-back-to-top="true"
    :show-scrollbar="false"
    :fixed="false"
    lower-threshold="200px"
    @on-refresh="onRefresh"
    @scrolltolower="onScroll"
  >
    <template #refresher="{ refresherStatus }">
      <custom-refresher :status="refresherStatus" />
    </template>
    <view class="conversation-wrapper">
      <NetworkAlert />

      <view
        v-if="messageStore?.serviceSessionRes.sessionList.length > 0"
        class="conversation-list-wrapper"
      >
        <ConversationItem
          v-for="(session, index) in userStore.userInfo?.uid
            ? messageStore?.serviceSessionRes.sessionList
            : defaultSessionList"
          :key="getSessionKey(session)"
          :showMoreActions="currentMoveSessionId === session.sessionId"
          :session="session"
          :is-touch-start="!isPopup && session.sessionId !== 'customer_service'"
          @delete="handleSessionItemDeleteClick"
          @sticky-to-top="handleSessionItemStickTopChange"
          @click="handleSession(session)"
          @left-slide="handleSessionItemLeftSlide"
        />
        <view v-if="sessionState.loading" class="session-loading">
          <!-- <u-loading-icon></u-loading-icon> -->
        </view>
      </view>
      <view v-else style="display: flex; justify-content: center">
        <Empty text="暂无数据" />
      </view>
    </view>
  </z-paging>
</template>

<script lang="ts" setup>
import type { NimKitCoreTypes } from "@xkit-yx/core-kit";
import { ref, watch } from "vue";
import { autorun } from "mobx";
import { debounce } from "lodash-es";
import { onHide, onLoad, onShow } from "@dcloudio/uni-app";
import { t } from "../utils/i18n";
import { navigateToChat, consultCustomerService } from "./index";
import { loginIM } from "../utils/connect";
import { fetchSelfConsultationTid } from "./index";
import { useUserStore } from "@/stores/user";
import { useMessageStore, NetworkStatus } from "@/stores/message";
import { toLogin, checkIsLogin } from "@/utils/login";
import { SessionListUitl } from "@/components/im/chat/message/card/js/session-list";
import NetworkAlert from "../components/NetworkAlert.vue";
import ConversationItem from "./conversation-item.vue";
import Empty from "@/components/im/components/Empty.vue";
import CustomRefresher from "@/components/custom-refresher/custom-refresher.vue";

const {
  sessionState,
  defaultSessionList,
  searchSessionList,
  querySessionList,
  queryCloudSessionList,
} = SessionListUitl();
const userStore = useUserStore();
const messageStore = useMessageStore();

defineProps({
  isPopup: {
    type: Boolean,
    default: false,
  },
});

const currentMoveSessionId = ref("");
const pagingRef = ref(null);

const height = uni.getSystemInfoSync().windowHeight - 125;

// 获取会话的 key
const getSessionKey = (session) => {
  if (session.lastMsg) {
    return session?.lastMsg?.idClient;
  } else {
    return `${session.sessionId}|${session.teamId}|${session.updateTime}|${session.time}`;
  }
};

// 左滑事件
const handleSessionItemLeftSlide = (
  session: NimKitCoreTypes.ISession | null
) => {
  // 微信小程序点击也会触发左滑事件，但此时 session 为 null
  if (session) {
    currentMoveSessionId.value = session.id;
  } else {
    currentMoveSessionId.value = "";
  }
};

// 删除会话
const handleSessionItemDeleteClick = async (
  session: NimKitCoreTypes.ISession
) => {
  try {
    await uni.$UIKitStore.sessionStore.deleteSessionActive(session.id);
  } catch (e) {
    uni.showToast({
      title: t("deleteSessionFailText"),
      icon: "error",
    });
  }
  fetchList();
};
// 置顶会话
const handleSessionItemStickTopChange = async (
  session: NimKitCoreTypes.ISession
) => {
  console.log("handleSessionItemStickTopChange", session);
  if (session.stickTopInfo?.isStickOnTop) {
    try {
      await uni.$UIKitStore.sessionStore.deleteStickTopSessionActive(
        session.id
      );
    } catch (e) {
      console.warn("取消置顶=====》", e);
      uni.showToast({
        title: t("deleteStickTopFailText"),
        icon: "error",
      });
    }
  } else {
    try {
      await uni.$UIKitStore.sessionStore.addStickTopSessionActive(session.id);
    } catch (e) {
      console.warn("置顶=====》", e);
      uni.showToast({
        title: t("addStickTopFailText"),
        icon: "error",
      });
    }
  }
  fetchList();
};

const fetchList = () => {
  if (messageStore.isConected) {
    querySessionList();
  } else {
    loginIM();
  }
};

const onRefresh = () => {
  console.log("onScroll-refresh");
  querySessionList();
  pagingRef.value?.endRefresh();
};

const onScroll = () => {
  if (!sessionState.loading) {
    queryCloudSessionList();
  }
};

// 搜索会话
const searchSession = debounce((val) => {
  console.log("searchSession", val);
  searchSessionList(val);
}, 500);

// 跳转到会话
const handleSession = (session) => {
  console.log("handleSession", session);
  if (!checkIsLogin()) {
    toLogin();
  } else if (messageStore.networkStatus === NetworkStatus.OFFLINE) {
    uni.$main.toast(t("offlineText"));
  } else if (messageStore.isConected) {
    const { lastMsg, id, empty, sessionId } = session;
    if (id === "customer_service") {
      consultCustomerService();
    } else if (empty) {
      uni.navigateTo({
        url: "/pages/message/empty?title=" + lastMsg?.fromNick,
      });
    } else {
      navigateToChat(id || sessionId, session);
    }
  } else {
    loginIM();
  }
};

autorun(
  () => {
    console.log("sessionUnread:", uni.$UIKitStore?.sysMsgStore?.sessionUnread);
    console.log(
      "unreadSysMsgCount:",
      uni.$UIKitStore?.sysMsgStore?.unreadSysMsgCount
    );

    fetchList();
  },
  {
    delay: 1000,
  }
);

watch(
  () => userStore?.userInfo?.token,
  (val) => {
    if (val) {
      fetchSelfConsultationTid();
    }
  },
  {
    immediate: true,
    flush: "post",
  }
);

onHide(() => {
  //
});

onLoad(() => {
  //
});

onShow(() => {
  fetchList();
});

defineExpose({
  searchSession,
});
</script>

<style lang="scss" scoped>
// @import "../styles/common.scss";
.conversation-wrapper {
  position: relative;
  padding-bottom: 50rpx;
}

.block {
  height: 60px;
  width: 100%;
  // display: block;
  // padding-top: var(--status-bar-height);
}

.session-loading {
  display: flex;
  justify-content: center;
}

// .conversation-list-wrapper {
// height: calc(100% - 60px - var(--status-bar-height));
// box-sizing: border-box;
// width: 100%;
// overflow-y: auto;
// overflow-x: hidden;
// border: 1px solid;

//height: calc(100vh - 100px - var(--status-bar-height));
//overflow: scroll;
// }

.logo-box {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;

  .logo-img {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
}

.button-icon-add {
  position: relative;
  right: 20px;
}

.dropdown-mark {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.add-menu-list {
  padding: 15px 10px;

  .add-menu-item {
    // white-space: nowrap;
    font-size: 16px;
    padding-left: 5px;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.conversation-block {
  width: 100%;
  height: 72px;
}
</style>
