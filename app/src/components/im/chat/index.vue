<template>
  <global-view bgColor="#F7F9FA" :showBar="false" @click="handleGlobalClick">
    <div style="height: 100%">
      <!-- 处理滚动穿透  此为官方推荐做法 https://uniapp.dcloud.net.cn/component/uniui/uni-popup.html#%E4%BB%8B%E7%BB%8D -->
      <!-- <page-meta :page-style="'overflow:' + (moveThrough ? 'hidden' : 'visible')"></page-meta> -->
      <div :class="isH5 ? 'msg-page-wrapper-h5' : 'msg-page-wrapper'">
        <div class="msg-alert">
          <NetworkAlert />
        </div>
        <div :class="isH5 ? 'msg-wrapper-h5' : 'msg-wrapper'">
          <MessageList
            ref="messageListRef"
            :scene="scene"
            :to="to"
            :msgs="msgs"
            :loading-more="loadingMore"
            :no-more="noMore"
            :reply-msgs-map="replyMsgsMap"
          />
        </div>
        <div
          v-if="!isNotificationRole"
          id="yxMsgInput"
          :class="isH5 ? 'msg-page-input-h5' : ''"
          style="height: auto"
        >
          <MessageInput
            ref="messageInputRef"
            :reply-msgs-map="replyMsgsMap"
            :scene="scene"
            :to="to"
            :ext="teamExt"
          />
        </div>
      </div>
    </div>
  </global-view>
</template>

<script lang="ts" setup>
import GlobalView from "@/components/global-view/index.vue";
import { onHide, onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import { events } from "@/components/im/utils/constants";
import { trackInit } from "@/components/im/utils/reporter";
import { autorun } from "mobx";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
} from "@/components/im/utils/transformVue";
import { parseSessionId } from "@/components/im/utils/msg";
import type { TMsgScene } from "@xkit-yx/im-store";
import { deepClone, getUniPlatform, stopAllAudio } from "@/components/im/utils";
// import { customSwitchTab } from '@/components/im/utils/customNavigate'
import NetworkAlert from "@/components/im/components/NetworkAlert.vue";
import MessageList from "./message/message-list.vue";
import MessageInput from "./message/message-input.vue";
import type { IMMessage } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import { HISTORY_LIMIT, MSG_ID_FLAG } from "@/components/im/utils/constants";
import { t } from "@/components/im/utils/i18n";
import {
  getSessionName,
  getServerExt,
  includeNotification,
  notificationsNameMap,
} from "@/components/im/conversation-list";
import { useMessageStore } from "@/stores/message";
import { useReportStore } from "@/stores/report";
import { ReportStatus, Events, report } from "@/utils/report/module/im";
import { checkChatMsgStatus } from "@/components/im/chat/message/card/js/nim";
import { loginIM } from "@/components/im/utils/connect";
import { commonEvent } from "@/utils/config";
// import storage from "@/utils/storage/index";

const messageStore = useMessageStore();
const reportStore = useReportStore();

trackInit("ChatUIKit");

let isMounted = false;
let sessionId = null;
const isH5 = getUniPlatform() === "web";

if (uni.$UIKitStore) {
  sessionId = uni.$UIKitStore.uiStore.selectedSession;
  uni.$UIKitStore.uiStore.selectSession(sessionId);
}
console.warn("会话id", sessionId);

const { scene, to }: { scene: TMsgScene; to: string } =
  parseSessionId(sessionId);

const moveThrough = ref(false); // 处理uni-popup 引起的滚动穿透
const title = ref("");
const loadingMore = ref(false);
const noMore = ref(false);
const msgs = ref<IMMessage[]>([]);
const replyMsgsMap = ref<Record<string, IMMessage>>(); // 回复

const isNotificationRole = computed(() => {
  return includeNotification(to);
});

const backToConversation = () => {
  uni.navigateBack();
};

const handleGlobalClick = () => {
  uni.$emit(commonEvent.GLOBAL_VIEW);
};

const handleDismissTeam = (data: any) => {
  if (data.teamId === to) {
    uni.showModal({
      content: t("onDismissTeamText"),
      showCancel: false,
      success(data) {
        if (data.confirm) {
          backToConversation();
        }
      },
    });
  }
};

const handleRemoveTeamMembers = (data: any) => {
  const myAccount = uni.$UIKitStore.userStore.myUserInfo.account;
  if (data.team.teamId === to && data.accounts.includes(myAccount)) {
    uni.showModal({
      content: t("onRemoveTeamText"),
      showCancel: false,
      success(data) {
        if (data.confirm) {
          backToConversation();
        }
      },
    });
  }
};

const handleMsg = (msg: IMMessage) => {
  console.warn("events.ON_MSG==================");
  uni.$emit(events.ON_MSG, msg);
};

const getHistroy = async (endTime: number, lastMsgId?: string) => {
  try {
    if (noMore.value) {
      return [];
    }
    if (loadingMore.value) {
      return [];
    }
    loadingMore.value = true;
    if (sessionId) {
      const historyMsgs = await uni.$UIKitStore.msgStore.getHistoryMsgActive({
        sessionId,
        endTime,
        lastMsgId,
        limit: HISTORY_LIMIT,
      });
      loadingMore.value = false;
      if (historyMsgs.length < HISTORY_LIMIT) {
        noMore.value = true;
      }
      return historyMsgs;
    }
  } catch (error) {
    loadingMore.value = false;
    throw error;
  }
};

const handleLoadMore = async (lastMsg: IMMessage) => {
  const res = await getHistroy(lastMsg.time, lastMsg.idServer);
  return res;
};

// 设置聊天标题
const setChatTeamName = () => {
  if (scene === "p2p") {
    if (includeNotification(to)) {
      title.value = notificationsNameMap[to];
    } else {
      title.value = deepClone(
        uni.$UIKitStore.uiStore.getAppellation({ account: to })
      );
    }
  } else if (scene === "team") {
    const team = uni.$UIKitStore.teamStore.teams.get(to);
    // console.warn("team-----", team);
    if (team?.serverExt) {
      teamExt.value = getServerExt(team?.serverExt);
      const subTitle = `(${team?.memberNum || 0})`;
      title.value = getSessionName(team) + subTitle;
      messageStore.setTeamExt(teamExt.value);
    }
  }
  uni.setNavigationBarTitle({
    title: title.value,
  });
};

// 跳转到消息列表
const toMessageIndex = () => {
  uni.$u.sleep(100).then(() => {
    uni.switchTab({ url: "/pages/message/index" });
  });
};

const messageListRef = ref(null);
const teamExt = ref(null);
onShow(function () {
  if (messageStore.isConected) {
    autorun(
      () => {
        setChatTeamName();
      },
      {
        delay: 100,
      }
    );
  } else {
    toMessageIndex();
  }
});

onHide(() => {
  try {
    stopAllAudio();
  } catch (error) {
    console.log("error", error);
  }
});
let isBackMsgTab = false;
onLoad((options) => {
  console.warn("会话options", options);
  if (messageStore.isConected) {
    report(Events.IM_TEAM_ENTER_STAUTS, {
      sessionId: options?.sessionId,
      status: ReportStatus.SUCCESS,
      dur: new Date().getTime() - reportStore.userImData.launch_time.enter_chat,
    });
    //兼容H5
    if (options.sessionId && !sessionId) {
      sessionId = options.sessionId;
    }
    isBackMsgTab = options.backMsgTab === "true" ? true : false;
    uni.$on(events.HANDLE_MOVE_THROUGH, (flag) => {
      moveThrough.value = flag;
    });

    uni.$currentAudioContext = "";
  } else {
    loginIM();
  }
});

const handleMounted = () => {
  if (!uni.$UIKitNIM) {
    return;
  }

  const timer = setTimeout(() => {
    uni.$emit(events.ON_CHAT_MOUNTED);
    clearTimeout(timer);
  }, 300);
  setChatTeamName();

  uni.$UIKitNIM.on("msg", handleMsg);

  uni.$UIKitNIM.on("dismissTeam", handleDismissTeam);

  uni.$UIKitNIM.on("removeTeamMembers", handleRemoveTeamMembers);

  uni.$on(events.GET_HISTORY_MSG, (msg: IMMessage) => {
    console.warn("GET_HISTORY_MSG_0000", msg);

    handleLoadMore(msg)
      .then((res: IMMessage[]) => {
        console.warn("handleLoadMore00000", res);
        if (res?.[0]) {
          // uni.pageScrollTo 微信小程序指定滚动位置不起作用 https://ask.dcloud.net.cn/question/173874?item_id=258278&rf=false
          setTimeout(() => {
            uni.pageScrollTo({
              selector: `#${MSG_ID_FLAG + res[0].idClient}`,
              scrollTop: 0,
              duration: 0,
              fail: (error) => {
                console.log("error", error);
              },
            });
          }, 300);
        }
      })
      .finally(() => {
        // uni.stopPullDownRefresh();
      });
  });
};

onMounted(() => {
  handleMounted();
});

onUnload(() => {
  if (uni.$UIKitStore) {
    uni.$UIKitStore.uiStore.unselectSession();
  }
  uni.$off(events.CONFIRM_FORWARD_MSG);
  uni.$off(events.CANCEL_FORWARD_MSG);

  messageStore.setProductCard(null);
  messageStore.setTeamExt({});

  // 退出界面释放内存;
  stopAllAudio();
  uni.$currentAudioContext = "";

  if (isBackMsgTab) {
    toMessageIndex();
  }
});

onUnmounted(() => {
  if (!uni.$UIKitStore) {
    return;
  }
  uni.$UIKitNIM.off("dismissTeam", handleDismissTeam);
  uni.$UIKitNIM.off("removeTeamMembers", handleRemoveTeamMembers);
  uni.$UIKitNIM.off("msg", handleMsg);
  uni.$off(events.GET_HISTORY_MSG);
  // 销毁时清空内存
  // store.msgStore.removeMsg(sessionId)
});
const handleAutoRun = () => {
  autorun(() => {
    if (!uni.$UIKitStore) {
      return;
    }
    if (uni.$UIKitStore.connectStore.connectState === "connected") {
      getHistroy(Date.now()).then((msgs) => {
        if (!isMounted) {
          uni.$emit(events.ON_CHAT_MOUNTED, msgs?.[0]);
          isMounted = true;
        }
      });
    }
  });
  // 动态更新消息
  autorun(() => {
    // console.log("sessionId=========",sessionId)
    if (!uni.$UIKitStore) {
      return;
    }
    const messageList = deepClone(uni.$UIKitStore.msgStore.getMsg(sessionId));
    console.log("messageList", messageList);
    // 检查消息状态
    checkChatMsgStatus(messageList);

    msgs.value = messageList;

    // 遍历所有消息，找出被回复消息，储存在map中
    if (msgs.value.length !== 0) {
      const _replyMsgsMap: any = {};
      const reqMsgs: Array<{
        scene: "p2p" | "team";
        from: string;
        to: string;
        idServer: string;
        time: number;
      }> = [];
      const idClients: Record<string, string> = {};
      msgs.value.forEach((msg) => {
        if (msg.ext) {
          try {
            // yxReplyMsg 存储着被回复消息的相关消息
            const { yxReplyMsg } = JSON.parse(msg.ext);
            if (yxReplyMsg) {
              // 从消息列表中找到被回复消息，replyMsg 为被回复的消息
              const replyMsg = msgs.value.find(
                (item) => item.idClient === yxReplyMsg.idClient
              );
              // 如果直接找到，存储在map中
              if (replyMsg) {
                _replyMsgsMap[msg.idClient] = replyMsg;
                // 如果没找到，说明被回复的消息可能有三种情况：1.被删除 2.被撤回 3.不在当前消息列表中（一次性没拉到，在之前的消息中）
              } else {
                _replyMsgsMap[msg.idClient] = { idClient: "noFind" };
                const { scene, from, to, idServer, time } = yxReplyMsg;
                if (scene && from && to && idServer && time) {
                  reqMsgs.push({ scene, from, to, idServer, time });
                  idClients[idServer] = msg.idClient;
                }
              }
            }
          } catch (e) {
            //
          }
        }
      });

      if (reqMsgs.length > 0) {
        // 从服务器拉取被回复消息, 但是有频率控制

        uni.$UIKitStore.msgStore
          .getMsgByIdServerActive({ reqMsgs })
          .then((res) => {
            if (res?.length > 0) {
              res.forEach((item: IMMessage) => {
                if (item.idServer) {
                  _replyMsgsMap[idClients[item.idServer]] = item;
                }
              });
            }
            replyMsgsMap.value = { ..._replyMsgsMap };
          })
          .catch(() => {
            replyMsgsMap.value = { ..._replyMsgsMap };
          });
      } else {
        replyMsgsMap.value = { ..._replyMsgsMap };
      }
    }

    // 当聊天消息小于6条时，由于页面被键盘撑起，导致已经发出的消息不可见，所以需要隐藏键盘
    if (msgs.value.length < 6) {
      uni.hideKeyboard();
    }
  });
};
handleAutoRun();
</script>

<style scoped lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.msg-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.msg-page-wrapper-h5 {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg-alert {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  z-index: 1;
}

.msg-wrapper {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
}

.msg-wrapper-h5 {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg-wrapper > message-list {
  height: 100%;
}

.custom-im {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    white-space: nowrap;
    //font-weight: 500;
    font-weight: bold;
  }
  .tag {
    border: 1rpx solid #1cc7be;
    background: white;
    color: #1cc7be;
    font-size: 28rpx;
    margin: 0rpx 10rpx;
  }
}
</style>
