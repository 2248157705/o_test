<template>
  <div
    :class="[
      'conversation-item-container',
      { 'show-action-list': showMoreActions, 'stick-on-top': isStickOnTop },
    ]"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @click="handleConversationItemClick()"
  >
    <div class="conversation-item-content">
      <div class="conversation-item-left">
        <!-- v-if="avatarId" -->
        <Avatar
          :account="avatarId"
          :avatar="teamAvatar"
          size="52"
          :unread="unread"
          :isMute="isMute"
        />
      </div>
      <div class="conversation-item-right">
        <div class="conversation-item-top">
          <div class="conversation-item-title">
            <Appellation v-if="!sessionName" :account="session.to" />
            <template v-else>
              <text class="text">{{ sessionName }}</text>
              <div
                v-if="serverExt?.team?.type === GroupType.CONSULT"
                class="tag official-icon"
              >
                <text class="text">官方</text>
              </div>
            </template>
          </div>
          <text class="conversation-item-time">{{ date }}</text>
        </div>
        <div class="conversation-item-desc">
          <text v-if="beMentioned" class="beMentioned">{{
            "[" + t("someoneText") + "@" + t("meText") + "]"
          }}</text>

          <u--text
            color="#AFAFAF"
            size="28rpx"
            :lines="1"
            :text="content"
          ></u--text>
          <Icon
            v-if="isMute"
            iconClassName="conversation-item-desc-state"
            type="icon-xiaoximiandarao"
            color="#ccc"
          />
        </div>
      </div>
    </div>
    <div class="right-action-list">
      <div
        v-for="action in moreActions"
        :key="action.type"
        :class="['right-action-item', action.class]"
        @click="() => handleClick(action.type)"
      >
        {{ action.name }}
      </div>
    </div>
    <div v-if="0 === 1" class="start">立即开启</div>
    <u-line color="#F4F5F6" :hairline="false" length="95%" margin="0 20rpx" />
  </div>
</template>

<script lang="ts" setup>
import Avatar from "../components/Avatar.vue";
import Appellation from "../components/Appellation.vue";
import Icon from "../components/Icon.vue";
import { getMsgContentTipByType } from "../utils/msg";
import { computed, onUpdated } from "../utils/transformVue";
import type { NimKitCoreTypes } from "@xkit-yx/core-kit";
import dayjs from "dayjs";
import { t } from "../utils/i18n";
import {
  getSessionName,
  getServerExt,
  // includeNotification,
} from "@/components/im/conversation-list";
import { GroupType } from "@/components/im/utils/enums";
// import { useMessageStore } from "@/stores/message";
import { getChatContent } from "@/components/im/chat/message/card/js/nim";

const props = defineProps({
  session: {
    type: Object,
    default: () => {
      return {
        ack: 0,
        scene: "",
        id: "",
        to: "",
        lastMsg: {
          time: 0,
          type: "",
          body: "",
          status: "",
        },
        unread: 0,
        isMute: false,
        beMentioned: false,
      };
    },
  },
  showMoreActions: {
    type: Boolean,
    default: () => false,
  },
  isTouchStart: {
    type: Boolean,
    default: () => true,
  },
});

const emit = defineEmits(["click", "delete", "stickyToTop", "leftSlide"]);

const isStickOnTop = computed(() => {
  return props.session.stickTopInfo?.isStickOnTop;
});

const moreActions = computed(() => {
  return [
    {
      name: props.session.stickTopInfo?.isStickOnTop
        ? t("deleteStickTopText")
        : t("addStickTopText"),
      class: "action-top",
      type: "action-top",
    },
    // {
    // 	name: t('deleteSessionText'),
    // 	class: 'action-delete',
    // 	type: 'action-delete',
    // },
  ];
});

const handleClick = (type: string) => {
  if (type === "action-top") {
    emit("stickyToTop", props.session);
  } else {
    emit("delete", props.session);
  }
};

const serverExt = computed(() => {
  return getServerExt(props.session?.serverExt);
});

const teamAvatar = computed(() => {
  // const { session } = props
  // if (session.scene === 'team') {
  const { avatar } = props.session as NimKitCoreTypes.TeamSession;
  return avatar;
  // }
});
// 获取扩展参数

const sessionName = computed(() => {
  const { session } = props;
  // console.log("session===============================",session)
  return getSessionName(session);
});

const avatarId = computed(() => {
  const { session } = props;
  if (session.scene === "p2p") {
    const { to } = props.session as NimKitCoreTypes.P2PSession;
    return to;
  }
  const { teamId } = props.session as NimKitCoreTypes.TeamSession;
  return teamId;
});

const content = computed(() => {
  const lastMsg = props.session.lastMsg;
  if (lastMsg) {
    const { status } = lastMsg;
    if (status === "sending" || lastMsg.type === "notification") {
      return getChatContent(lastMsg);
    } else if (status === "sendFailed" || status === "refused") {
      return "[发送失败]";
    } else {
      // 已发送成功的消息
      if (lastMsg.type === "custom") {
        return getChatContent(lastMsg);
      } else {
        return getMsgContentTipByType(lastMsg);
      }
    }
  }
  return "";
});

const date = computed(() => {
  const time = props.session.lastMsg?.time || props.session.updateTime;
  // 如果最后一条消息时间戳不存在，则会话列表不显示
  if (!time) {
    return "";
  }
  const _d = dayjs(time);
  const isCurrentDay = _d.isSame(dayjs(), "day");
  const isCurrentYear = _d.isSame(dayjs(), "year");
  return _d.format(
    isCurrentDay ? "HH:mm" : isCurrentYear ? "MM-DD HH:mm" : "YYYY-MM-DD HH:mm"
  );
});

const max = 99;

const unread = computed(() => {
  return props.session.unread > 0
    ? props.session.unread > max
      ? `${max}+`
      : props.session.unread + ""
    : "";
});

const isMute = computed(() => {
  return props.session.isMute;
});

const beMentioned = computed(() => {
  return props.session.beMentioned;
});

// 左滑显示 action 动画
let startX = 0,
  startY = 0;
// 开始左滑
function handleTouchStart(event: TouchEvent) {
  if (!props.isTouchStart) {
    return;
  }
  startX = event.changedTouches[0].pageX;
  startY = event.changedTouches[0].pageY;
}

function handleTouchMove(event: TouchEvent) {
  const moveEndX = event.changedTouches[0].pageX;
  const moveEndY = event.changedTouches[0].pageY;
  const X = moveEndX - startX + 20;
  const Y = moveEndY - startY;
  if (Math.abs(X) > Math.abs(Y) && X > 0) {
    emit("leftSlide", null);
  } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
    emit("leftSlide", props.session);
  }
}

function handleConversationItemClick() {
  console.log("props.showMoreActions", props.showMoreActions);
  if (props.showMoreActions) {
    emit("leftSlide", null);
    return;
  }
  emit("click", props.session);
}

onUpdated(() => {
  // console.log('onUpdated', props.session.unread)
});
</script>

<style lang="scss" scoped>
$cellHeight: 80px;

.conversation-item-container {
  position: relative;
  // left: -200px;
  transition: transform 0.3s;
  padding: 0px 24rpx;

  &.show-action-list {
    transform: translateX(-100px);
  }

  &.stick-on-top {
    background-color: #f3f5f7;
  }

  .beMentioned {
    color: #ff4d4f !important;
    font-size: 24rpx;
    line-height: 28rpx;
  }

  .content {
    overflow: hidden;
    text-overflow: ellipsis;
    // white-space: nowrap;
  }
}

.right-action-list {
  position: absolute;
  top: 0;
  right: -100px;
  bottom: 0;
  width: 100px;

  .right-action-item {
    width: 100px;
    /* #ifndef APP-NVUE */
    display: inline-block;
    /* #endif */
    color: #fff;
    text-align: center;
    height: $cellHeight;
    line-height: $cellHeight;
  }

  .action-top {
    background: $app-main-color;
  }

  .action-delete {
    background: #a8abb6;
  }
}

.conversation-item-content {
  display: flex;
  flex-direction: row;
  align-items: center;

  height: $cellHeight;
}

.conversation-item-left {
  position: relative;
  border-radius: 100rpx;
  background-color: #ffffff;
  // border: 3rpx solid #F4F5F6;

  .conversation-item-badge {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 10;
  }
}

.conversation-item-right {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.conversation-item-top {
  margin-bottom: 8rpx;
  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  .conversation-item-title {
    font-weight: 500;
    font-size: 32rpx;
    color: #1a1a1a;
    width: 420rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    .text {
      max-width: 300rpx;
      word-break: break-all;
      white-space: nowrap;
      word-wrap: normal;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    :deep(.u-text__value) {
      font-weight: 500 !important;
    }
  }
  .tag {
    @include flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 2rpx;
    width: 72rpx;
    height: 26rpx;
    border-radius: 6rpx;
    border: 2rpx solid $app-main-color;
    margin-left: 8rpx;
    text-align: center;
    // top: -1rpx;
    .text {
      font-weight: 500;
      font-size: 22rpx;
      color: $app-main-color;
    }
  }
  .conversation-item-time {
    font-size: 24rpx;
    color: #afafaf;
    text-align: right;
    width: 150rpx;
    position: relative;
    // right: 6px;
  }
}

.conversation-item-desc {
  font-family:
    Noto Sans SC,
    Noto Sans SC;
  margin-right: 130rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .conversation-item-desc-state {
    margin-left: 10px;
  }
}

.start {
  font-weight: 500;
  font-size: 28rpx;
  color: #1cc7be;
  position: absolute;
  right: 48rpx;
  top: 40rpx;
}
</style>
