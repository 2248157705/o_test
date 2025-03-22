<template>
  <div
    :id="MSG_ID_FLAG + msg.idClient"
    :key="msg.time"
    class="msg-item-wrapper"
  >
    <div
      v-if="msg.type === 'text'"
      class="msg-common"
      :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
    >
      <Avatar
        :to="to"
        :account="msg.from"
        :teamId="msg.scene === 'team' ? msg.to : ''"
        :goto-user-card="true"
      />
      <div class="msg-content">
        <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
        <MessageBubble
          :msg="msg"
          :tooltip-visible="true"
          :bg-visible="true"
          :scene="scene"
        >
          <ReplyMessage
            v-if="replyMsg.idClient"
            :replyMsg="replyMsg"
          ></ReplyMessage>
          <MessageText :msg="msg" :scene="scene"></MessageText>
        </MessageBubble>
      </div>
    </div>
    <div v-else-if="msg.type === 'tip'">
      <div class="msg-text">
        {{ msg.body }}
      </div>
    </div>
    <div
      v-else-if="msg.type === 'image'"
      class="msg-common"
      :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
    >
      <Avatar
        :to="to"
        :account="msg.from"
        :teamId="msg.scene === 'team' ? msg.to : ''"
        :goto-user-card="true"
      />
      <div class="msg-content">
        <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
        <MessageBubble
          :msg="msg"
          :tooltip-visible="true"
          :bg-visible="true"
          style="cursor: pointer"
        >
          <div
            @tap="
              () => {
                handleImageTouch(msg.attach.url);
              }
            "
          >
            <image
              class="msg-image"
              :lazy-load="true"
              mode="widthFix"
              :src="msg.attach.url"
            ></image>
          </div>
        </MessageBubble>
      </div>
    </div>
    <div
      v-else-if="msg.type === 'video'"
      class="msg-common"
      :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
    >
      <Avatar
        :to="to"
        :account="msg.from"
        :teamId="msg.scene === 'team' ? msg.to : ''"
        :goto-user-card="true"
      />
      <div class="msg-content">
        <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
        <MessageBubble
          :msg="msg"
          :tooltip-visible="true"
          :bg-visible="true"
          style="cursor: pointer"
        >
          <div class="video-msg-wrapper" @tap="() => handleVideoTouch(msg)">
            <div class="video-play-button">
              <div class="video-play-icon"></div>
            </div>
            <image
              class="msg-image"
              :lazy-load="true"
              mode="aspectFill"
              :src="videoFirstFrameDataUrl"
            >
            </image>
          </div>
        </MessageBubble>
      </div>
    </div>
    <div
      v-else-if="msg.type === 'file'"
      class="msg-common"
      :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
    >
      <Avatar
        :to="to"
        :account="msg.from"
        :teamId="msg.scene === 'team' ? msg.to : ''"
        :goto-user-card="true"
      />
      <div class="msg-content">
        <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
        <MessageBubble :msg="msg" :tooltip-visible="true" :bg-visible="false">
          <MessageFile :msg="msg" />
        </MessageBubble>
      </div>
    </div>
    <div
      v-else-if="msg.type === 'audio'"
      class="msg-common"
      :style="{
        flexDirection: !isSelf ? 'row' : 'row-reverse',
      }"
    >
      <Avatar
        :to="to"
        :account="msg.from"
        :teamId="msg.scene === 'team' ? msg.to : ''"
        :goto-user-card="true"
      />
      <div class="msg-content">
        <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
        <MessageBubble
          :msg="msg"
          :tooltip-visible="true"
          :bg-visible="true"
          style="cursor: pointer"
        >
          <MessageAudio :msg="msg" />
        </MessageBubble>
      </div>
    </div>

    <template v-else-if="msg.type === 'notification'">
      <MessageNotification :msg="msg" />
    </template>

    <template v-else-if="msg.type === 'custom'">
      <template v-if="msg.attach?.type === 'text'">
        <!-- 自定义消息文本显示 -->
        <MsgText :msg="msg" :scene="msg.scene" :to="to" />
      </template>

      <template v-else-if="msg.attach?.type === 'time'">
        <!-- 时间 -->
        <div class="msg-time">
          {{ msg.attach.value }}
        </div>
      </template>

      <template
        v-else-if="msg.attach?.type === 'reCallMsg' && msg.attach.canEdit"
      >
        <div
          class="msg-common"
          :style="{
            flexDirection: !isSelf ? 'row' : 'row-reverse',
          }"
        >
          <Avatar
            :to="to"
            :account="msg.from"
            :teamId="msg.scene === 'team' ? msg.to : ''"
            :goto-user-card="true"
          />
          <MessageBubble :msg="msg" :bg-visible="true">
            {{ t("recall2") }}
            <text
              class="msg-recall-btn"
              @tap="
                () => {
                  handleReeditMsg(msg);
                }
              "
            >
              {{ t("reeditText") }}
            </text>
          </MessageBubble>
        </div>
      </template>

      <template v-else-if="msg.attach?.type === 'beReCallMsg'">
        <div
          class="msg-common"
          :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
        >
          <Avatar
            :to="to"
            :account="msg.from"
            :teamId="msg.scene === 'team' ? msg.to : ''"
            :goto-user-card="true"
          />
          <div class="msg-content">
            <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
            <div :class="isSelf ? 'self-msg-recall' : 'msg-recall'">
              <text class="msg-recall2">
                {{ !isSelf ? t("recall2") : `${t("you") + t("recall")}` }}</text
              >
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="msg.attach?.type === 'card'">
        <!-- 自定义消息卡片显示 -->
        <div
          class="msg-common"
          :style="{ flexDirection: !isSelf ? 'row' : 'row-reverse' }"
        >
          <Avatar
            :to="to"
            :account="msg.from"
            :teamId="msg.scene === 'team' ? msg.to : ''"
            :goto-user-card="true"
          />
          <div class="msg-content">
            <MsgName v-if="!isSelf" :name="appellation" :time="msg.time" />
            <MessageBubble
              :msg="msg"
              :tooltip-visible="false"
              :bg-visible="true"
              :scene="msg.scene"
            >
              <MsgCard :msg="msg" :scene="msg.scene" :to="to" />
            </MessageBubble>
          </div>
        </div>
      </template>

      <template v-else>
        <text> [{{ t("unknowMsgText") }}] </text>
      </template>
    </template>
    <text v-else> [{{ t("unknowMsgText") }}] </text>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "@/components/im/utils/transformVue";
import Avatar from "@/components/im/components/Avatar.vue";
import MessageBubble from "./message-bubble.vue";
import MessageText from "./message-text.vue";
import { events, MSG_ID_FLAG } from "@/components/im/utils/constants";
import MessageFile from "./message-file.vue";
import ReplyMessage from "./message-reply.vue";
import { autorun } from "mobx";
import { deepClone, stopAllAudio } from "@/components/im/utils";
import { t } from "@/components/im/utils/i18n";
import type { IMMessage } from "@xkit-yx/im-store";
import MessageAudio from "./message-audio.vue";
import { customNavigateTo } from "@/components/im/utils/customNavigate";
import MessageNotification from "./message-notification.vue";
import MsgCard from "./card/msg-card.vue";
import MsgText from "./card/msg-text.vue";
import MsgName from "./card/components/msg-name.vue";

// import { MsgTemplate } from "@/components/im/utils/enums";

const props = defineProps({
  scene: {
    type: String, // Assuming TMsgScene is a custom object type
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  msg: {
    type: Object, // Assuming IMMessage is a custom object type
    default: () => ({
      idClient: undefined,
      body: undefined,
      attach: {
        type: undefined,
        value: undefined,
        url: undefined,
        canEdit: false,
        canRecall: false,
      },
      type: undefined,
      from: undefined,
      to: undefined,
      scene: undefined,
      time: undefined,
    }),
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  replyMsg: {
    type: Object,
    default: () => ({
      idClient: undefined,
      body: undefined,
      attach: {
        type: undefined,
        value: undefined,
        url: undefined,
        canEdit: false,
        canRecall: false,
      },
      type: undefined,
    }),
  },
});
const appellation = ref("");
const isSelf = ref(false);

console.log("props.msg====", props.msg);

// 获取视频首帧
const videoFirstFrameDataUrl = computed(() => {
  const url = props.msg?.attach?.url;
  return url ? `${url}${url.includes("?") ? "&" : "?"}vframe=1` : "";
});

autorun(() => {
  isSelf.value =
    props.msg.from === uni.$UIKitStore.userStore.myUserInfo.account;
});

const handleImageTouch = (url: string) => {
  if (url) {
    uni.previewImage({
      urls: [url],
    });
  }
};

const handleVideoTouch = (msg: IMMessage) => {
  stopAllAudio();
  const url = msg?.attach?.url;
  if (url) {
    customNavigateTo({
      url: `/components/im/chat/video-play?videoUrl=${encodeURIComponent(url)}`,
    });
  }
};

const handleReeditMsg = (msg: IMMessage) => {
  uni.$emit(events.ON_REEDIT_MSG, msg);
};

autorun(() => {
  if (props.scene === "team") {
    // 昵称展示顺序 群昵称 > 备注 > 个人昵称 > 帐号
    appellation.value =
      props.msg?.fromNick ||
      deepClone(
        uni.$UIKitStore.uiStore.getAppellation({
          account: props.msg.from,
          teamId: props.scene === "team" ? props.to : "",
        })
      );
  }
});

// const paymentPenaltyMsgRef = ref(null)
// const checkPenaltyH5PayStatus = () => {
// 	console.log("checkPenaltyH5PayStatus===",paymentPenaltyMsgRef.value)
// 	paymentPenaltyMsgRef.value?.checkH5PayStatus()
// }
// 	defineExpose({
// 		checkPenaltyH5PayStatus
// 	})
</script>

<style scoped lang="scss">
.msg-tip-noti {
  margin: 8px auto 0;
  text-align: center;
  font-size: 14px;
  color: #b3b7bc;
  max-width: 70%;
}

.msg-item-wrapper {
  padding: 0 15px 15px;
}

.msg-common {
  margin-top: 8px;
  display: flex;
  align-items: flex-start;
  font-size: 16px;
}

.msg-content {
  display: flex;
  flex-direction: column;
}

.msg-name {
  font-size: 28rpx;
  color: #999;
  text-align: left;
  margin-bottom: 4px;
  max-width: 400rpx;
  padding-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.msg-image {
  max-width: 100%;
}

.msg-time {
  margin-top: 8px;
  text-align: center;
  color: #b3b7bc;
  font-size: 12px;
}

.msg-text {
  margin-top: 8px;
  text-align: center;
  color: #b3b7bc;
  font-size: 12px;
}

.msg-recall-btn {
  margin-left: 5px;
  color: #1861df;
}

.msg-recall2 {
  font-size: 16px;
}

.self-msg-recall {
  max-width: 360rpx;
  overflow: hidden;
  padding: 12px 16px;
  border-radius: 8px 0px 8px 8px;
  margin-right: 8px;
  background-color: #d6e5f6;
  color: #666666;
}

.msg-recall {
  max-width: 360rpx;
  overflow: hidden;
  padding: 12px 16px;
  border-radius: 0px 8px 8px 8px;
  margin-left: 8px;
  background-color: #e8eaed;
  color: #666666;
}

.recall-text {
  color: #666666;
}

.video-play-button {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  z-index: 9;
}

.video-play-icon {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 18px solid #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-40%, -50%);
}

.video-msg-wrapper {
  position: relative;
  z-index: 0;
  box-sizing: border-box;
  max-width: 360rpx;
}
</style>
