<template>
  <div>
    <div v-if="replyMsg.idClient" class="reply-msg-wrapper">
      <!-- replyMsg 不存在 说明回复的消息被删除或者撤回 -->
      <div v-if="!isReplyMsgExist">
        <span>{{ t("replyNotFindText") }}</span>
      </div>
      <div v-else class="reply-msg" @tap="showFullReplyMsg">
        <div class="reply-msg-name">|{{ repliedTo }}:</div>
        <div v-if="replyMsg.type === 'text'" class="reply-msg-content">
          <message-one-line
            :text="replyMsg.body"
            :maxWidth="260"
          ></message-one-line>
        </div>
        <div v-else-if="replyMsg.type === 'file'" class="other-msg-wrapper">
          <uni-link :href="downloadUrl" :download="name" :showUnderLine="false">
            [文件消息]
          </uni-link>
        </div>
        <div v-else class="other-msg-wrapper">
          {{ "[" + REPLY_MSG_TYPE_MAP[replyMsg.type] + "]" }}
        </div>
      </div>
    </div>
    <!-- 点击被回复的消息需要全屏显示 -->
    <div v-if="isFullScreen" class="reply-full-screen" @tap="closeFullReplyMsg">
      <!-- #ifdef MP -->
      <div class="reply-message-close-mp" @tap="closeFullReplyMsg">
        <Icon
          color="#929299"
          :iconStyle="{ fontWeight: '200' }"
          :size="18"
          type="icon-guanbi"
        />
      </div>
      <!-- #endif -->
      <!-- #ifndef MP -->
      <div class="reply-message-close" @tap="closeFullReplyMsg">
        <Icon
          color="#929299"
          :iconStyle="{ fontWeight: '200' }"
          :size="18"
          type="icon-guanbi"
        />
      </div>
      <!-- #endif -->
      <div v-if="replyMsg.type == 'text'" class="reply-message-content">
        <message-text :msg="replyMsg" :fontSize="22"></message-text>
      </div>
      <div
        v-else-if="replyMsg.type == 'audio'"
        class="msg-common"
        :style="{
          flexDirection: isSelf ? 'row-reverse' : 'row',
          backgroundColor: isSelf ? '#d6e5f6' : '#e8eaed',
          borderRadius: isSelf ? '8px 0px 8px 8px' : '0 8px 8px',
        }"
        @click.stop="() => {}"
      >
        <MessageAudio :msg="replyMsg" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { t } from "@/components/im/utils/i18n";
import MessageOneLine from "@/components/im/components/MessageOneLine.vue";
import { ref, onMounted, computed } from "@/components/im/utils/transformVue";
import MessageText from "./message-text.vue";

import UniLink from "@/components/im/components/uni-link/components/uni-link/uni-link.vue";
import { REPLY_MSG_TYPE_MAP } from "@/components/im/utils/constants";
import { events } from "@/components/im/utils/constants";
import { deepClone, stopAllAudio } from "@/components/im/utils";
import { autorun } from "mobx";
import Icon from "@/components/im/components/Icon.vue";
import { customNavigateTo } from "@/components/im/utils/customNavigate";
import MessageAudio from "./message-audio.vue";
const props = defineProps({
  replyMsg: {
    type: Object,
    default: () => ({
      idClient: undefined,
      body: undefined,
      type: undefined,
      attach: {
        type: undefined,
        value: undefined,
        url: undefined,
        canEdit: false,
        canRecall: false,
      },
    }),
  },
});

const isFullScreen = ref(false);
const repliedTo = ref("");

const isSelf = ref(false);

const { name = "", url = "" } = props?.replyMsg?.attach || {};
const downloadUrl =
  url + ((url as string).includes("?") ? "&" : "?") + `download=${name}`;

const isReplyMsgExist = computed(() => {
  return props.replyMsg?.idClient !== "noFind";
});

autorun(() => {
  isSelf.value =
    props.replyMsg?.from === uni.$UIKitStore.userStore.myUserInfo.account;
});

onMounted(() => {
  repliedTo.value = deepClone(
    uni.$UIKitStore.uiStore.getAppellation({
      account: props.replyMsg?.from,
      teamId: props.replyMsg?.to,
    })
  );
});

autorun(() => {
  repliedTo.value = deepClone(
    uni.$UIKitStore.uiStore.getAppellation({
      account: props.replyMsg?.from,
      teamId: props.replyMsg?.to,
    })
  );
});

const showFullReplyMsg = () => {
  if (props.replyMsg?.type === "image") {
    uni.previewImage({
      urls: [props.replyMsg?.attach?.url as string],
    });
  } else if (props.replyMsg?.type === "text") {
    isFullScreen.value = true;
    uni.$emit(events.HANDLE_MOVE_THROUGH, true);
  } else if (props.replyMsg?.type === "video") {
    const url = props.replyMsg?.attach?.url;
    stopAllAudio();
    if (url) {
      customNavigateTo({
        url: `/pages/Chat/video-play?videoUrl=${encodeURIComponent(url)}`,
      });
    }
  } else if (props.replyMsg?.type === "audio") {
    isFullScreen.value = true;
  }
};

// 点击全屏的回复消息，关闭全屏
const closeFullReplyMsg = () => {
  isFullScreen.value = false;
  stopAllAudio();
  uni.$emit(events.HANDLE_MOVE_THROUGH, false);
};
</script>

<style lang="scss" scoped>
.reply-msg-wrapper {
  display: flex;
  align-items: center;
  color: #929299;
  font-size: 13px;
  white-space: nowrap;

  .reply-msg {
    display: flex;
    align-items: center;
  }

  .reply-msg-name {
    margin-right: 5px;
  }

  .reply-msg-content {
    display: flex;
    align-items: center;
  }
}

.reply-full-screen {
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  height: 100vh;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 24px;
  justify-content: center;
  touch-action: none;
  z-index: 999999999;
  box-sizing: border-box;
}

.reply-message-content {
  height: 85vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 30px 30px 100px 30px;
  touch-action: none;
  display: flex;
  align-items: center;
}

.other-msg-wrapper {
  flex-wrap: nowrap;
}

.reply-message-close {
  position: fixed;
  right: 20px;
  z-index: 999999;
  top: 40px;
}

.reply-message-close-mp {
  position: fixed;
  right: 20px;
  top: 100px;
  z-index: 999999;
}

.msg-common {
  display: flex;
  align-items: flex-start;
  font-size: 16px;
  max-width: 360rpx;
  overflow: hidden;
  padding: 16px 20px;
}
</style>
