<template>
  <view>
    <u-transition :show="is_login && !messageStore.isConected">
      <div class="network-alert">
        {{ text }}
      </div>
    </u-transition>
  </view>
</template>

<script lang="ts" setup>
// import { autorun } from "mobx";
import { ref, onMounted, computed, onUnmounted } from "../utils/transformVue";
import { t } from "../utils/i18n";
import { useUserStore } from "@/stores/user";
import {
  useMessageStore,
  ConectedStatus,
  NetworkStatus,
} from "@/stores/message";
import { loginIM } from "@/components/im/utils/connect";

const userStore = useUserStore();
const messageStore = useMessageStore();

const text = ref(t("connectingText"));

const is_login = computed(() => {
  return userStore.userInfo?.token;
});

// const loginToken = computed(() => {
//   return messageStore.loginCredential?.token;
// });

const listeningH5Events = () => {
  window.addEventListener("offline", function () {
    messageStore.setIsConected(ConectedStatus.NO);
    messageStore.setNetworkStatus(NetworkStatus.OFFLINE);
    messageStore.removeLoginCredential(); // 销毁
    text.value = t("offlineText");
  });

  window.addEventListener("online", function () {
    messageStore.setNetworkStatus(NetworkStatus.ONLINE);
    text.value = t("connectingText");
    loginIM();
  });
};

const listeningAppEvents = (res) => {
  if (res.isConnected) {
    messageStore.setIsConected(ConectedStatus.NO);
    messageStore.setNetworkStatus(NetworkStatus.OFFLINE);
    messageStore.removeLoginCredential(); // 销毁
    text.value = t("offlineText");
  } else {
    messageStore.setNetworkStatus(NetworkStatus.ONLINE);
    text.value = t("connectingText");
    loginIM();
  }
};

onMounted(() => {
  // #ifdef H5
  listeningH5Events();
  // #endif

  // #ifdef APP-PLUS
  uni.onNetworkStatusChange(listeningAppEvents);
  // #endif
});
onUnmounted(() => {
  // #ifdef APP-PLUS
  uni.offNetworkStatusChange(listeningAppEvents);
  // #endif
});
</script>

<style>
.network-alert {
  /* position: absolute;
	top: 0; */
  width: 100%;
  font-size: 14px;
  background: #fee3e6;
  color: #fc596a;
  text-align: center;
  padding: 8px 0;
}
</style>
