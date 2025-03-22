<template>
  <div class="input-root">
    <!-- 以下这个 div 用于确保 vue2 的 ref 会更新 -->
    <div style="display: none">
      <div>{{ teamMute ? "禁言" : "不禁言" }}</div>
      <div>{{ isTeamMute ? "禁言" : "不禁言" }}</div>
    </div>

    <div class="msg-input-wrapper">
      <!-- 键盘上要显示的回复消息内容 -->
      <div v-if="isReplyMsg" class="reply-message-wrapper">
        <div class="reply-message-close" @tap="removeReplyMsg">
          <Icon
            color="#929299"
            :iconStyle="{ fontWeight: '200' }"
            :size="13"
            type="icon-guanbi"
          />
        </div>

        <div class="reply-title">{{ t("replyText") }}</div>
        <div
          v-if="replyMsg && replyMsg.idClient == 'noFind'"
          class="reply-noFind"
        >
          {{ t("replyNotFindText") }}
        </div>
        <div v-else class="reply-message">
          <div class="reply-to">
            <Appellation
              :account="replyMsg.from"
              :team-id="scene === 'team' ? to : ''"
              color="#929299"
              :fontSize="13"
            >
            </Appellation>
          </div>
          <div v-if="replyMsg.type === 'text'" class="reply-msg-content">
            <message-one-line :text="replyMsg.body"></message-one-line>
          </div>
          <div v-else>{{ "[" + REPLY_MSG_TYPE_MAP[replyMsg.type] + "]" }}</div>
        </div>
      </div>
      <!-- 输入框上操作组 -->
      <MsgButtonGroup
        :scene="scene"
        :to="to"
        :ext="ext"
        @show="handleShowButtonGroup"
      />

      <!-- v-if="inputVisible" -->
      <div class="msg-input">
        <div class="input-box">
          <!-- 当从表情面板切换到文字输入时，直接唤起键盘，ios 会存在input框消失的情况，故此处需要用EmojiInput兼容下 -->
          <div
            v-if="showEmojiInput && !isIOSWeb"
            class="input-emoji"
            @click="onClickEmojiInput"
          >
            <div v-if="inputText" class="input-text">{{ inputText }}</div>
            <div v-else class="input-placeholder">
              {{
                isTeamMute
                  ? t("teamMutePlaceholder")
                  : t("chatInputPlaceHolder")
              }}
            </div>
          </div>
          <input
            v-else
            id="msg-input"
            v-model="inputText"
            :focus="isFocus"
            class="msg-input-input"
            :maxlength="800"
            :placeholder="
              isTeamMute ? t('teamMutePlaceholder') : t('chatInputPlaceHolder')
            "
            type="text"
            :disabled="isTeamMute"
            :confirm-hold="true"
            cursor-spacing="65"
            adjust-position="true"
            confirm-type="send"
            @confirm="handleSendTextMsg"
            @blur="handleInputBlur"
            @focus="handleInputFocus"
            @input="handleInput"
          />
        </div>
        <div class="msg-input-right-button" @tap="handleEmojiVisible">
          <Icon :size="28" type="icon-biaoqing" />
        </div>
        <div class="msg-input-right-button sead">
          <Icon
            v-if="!inputText"
            type="send-more"
            :size="28"
            @tap="handleSendMoreVisible"
          />
          <div
            v-else
            class="msg-input-send"
            @touchend.prevent="handleSendTextMsg"
          >
            发送
          </div>
        </div>
      </div>

      <!-- 表情面板 -->
      <div v-if="emojiVisible" class="msg-emoji-panel" @click.stop="() => {}">
        <Face
          @emoji-click="handleEmoji"
          @emoji-delete="handleEmojiDelete"
          @emoji-send="handleSendTextMsg"
        />
      </div>
      <!-- 发送语音消息面板 -->
      <div
        v-if="audioPanelVisible"
        class="msg-audio-panel"
        @click.stop="() => {}"
      >
        <VoicePanel @handle-send-audio-msg="handleSendAudioMsg"></VoicePanel>
      </div>
      <!-- 发送更多面板 -->
      <div
        v-if="sendMoreVisible"
        class="send-more-panel"
        @click.stop="() => {}"
      >
        <div class="send-more-panel-item" @tap="shotActionSheetShow = true">
          <div class="icon-box">
            <Icon :size="36" type="icon-tupian" />
          </div>
          <text class="text">相册</text>
        </div>

        <div
          class="send-more-panel-item"
          @tap="(event) => handleSendImageMsg('camera')"
        >
          <div class="icon-box">
            <Icon type="icon-paishe" :size="36"></Icon>
          </div>
          <text class="text">拍照</text>
        </div>
        <div
          class="send-more-panel-item"
          @tap="(event) => handleSendVideoMsg('camera', event)"
        >
          <div class="icon-box">
            <Icon type="icon-shipin2" :size="36"></Icon>
          </div>
          <text class="text">视频</text>
        </div>
      </div>
    </div>
    <!-- <UniPopup ref="popupRef" background-color="#ffffff" type="bottom" mask-background-color="rgba(0,0,0,0.4)"
			@change="onPopupChange">
			<MentionMemberList :team-id="to"></MentionMemberList>
		</UniPopup> -->
    <!-- :actions="shotList" -->
    <u-action-sheet
      class="action-sheet-wrapper"
      :closeOnClickOverlay="true"
      round="6"
      :show="shotActionSheetShow"
      @close="shotActionSheetShow = false"
    >
      <view class="action-sheet-item" @click="handleSendImageMsg('album')">
        图片
      </view>
      <view
        class="action-sheet-item"
        @tap="(event) => handleSendVideoMsg('album', event)"
      >
        视频
      </view>
      <u-gap bgColor="#eaeaec" height="6"></u-gap>
      <view
        class="action-sheet-item cencel"
        @click="shotActionSheetShow = false"
        >取消</view
      >
    </u-action-sheet>
    <u-popup
      :show="mentionMemberShow"
      :round="10"
      :mode="'bottom'"
      :close-on-click-overlay="true"
      :closeable="false"
      @close="closePopup"
    >
      <view class="popup-content">
        <MentionMemberList :team-id="to"></MentionMemberList>
      </view>
    </u-popup>
  </div>
</template>

<script lang="ts" setup>
import type { TMsgScene } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import type { Team, TeamMember } from "@xkit-yx/im-store";
import Face from "./face.vue";
import VoicePanel from "./voice-panel.vue";
import Icon from "@/components/im/components/Icon.vue";
import {
  ref,
  computed,
  onUnmounted,
  onMounted,
  defineProps,
  watch,
} from "@/components/im/utils/transformVue";
import {
  ALLOW_AT,
  events,
  REPLY_MSG_TYPE_MAP,
} from "@/components/im/utils/constants";
import { emojiMap } from "@/components/im/utils/emoji";
import { t } from "@/components/im/utils/i18n";
// import { handleNoPermission } from "@/components/im/utils/permission";
// import { customNavigateTo } from "@/components/im/utils/customNavigate";
import type { IMMessage } from "@xkit-yx/im-store";
import MessageOneLine from "@/components/im/components/MessageOneLine.vue";
import { getUniPlatform, stopAllAudio } from "@/components/im/utils";
import MentionMemberList from "./mention-member-list.vue";
import { autorun } from "mobx";
import Appellation from "@/components/im/components/Appellation.vue";
import { AT_ALL_ACCOUNT } from "@/components/im/utils/constants";
import { deepClone } from "@/components/im/utils";
import { GroupType } from "@/components/im/utils/enums";
import { getServerExt } from "@/components/im/conversation-list";
import { chooseImagePermission } from "@/utils/choose-file";
import MsgButtonGroup from "@/components/im/chat/message/card/components/msg-button-group.vue";

type MentionedMember = { account: string; appellation: string };
const props = defineProps({
  scene: {
    type: String, // Assuming TMsgScene is a custom object type
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  replyMsgsMap: {
    type: Object,
    default: undefined,
  },
  ext: {
    // 目前写了支持群的扩展参数
    type: Object,
    default: () => {
      return {};
    },
  },
});
const inputText = ref("");
const extVisible = ref(false);
// 音频面板flag
const audioPanelVisible = ref(false);
// 发送更多面板flag
const sendMoreVisible = ref(false);
// 表情面板flag
const emojiVisible = ref(false);

const shotActionSheetShow = ref(false);
// input框flag
// const inputVisible = computed(() => {
//   if (audioPanelVisible.value || sendMoreVisible.value) {
//     return false;
//   } else {
//     return true;
//   }
// });
const uniPlatform = getUniPlatform();
const isAndroidApp =
  uni.getSystemInfoSync().platform == "android" && uniPlatform == "app";
const showEmojiInput = ref(false);
const isIOSWeb =
  uniPlatform === "web" && uni.getSystemInfoSync().platform === "ios";
// const isWeb = uniPlatform === "web";
// 回复消息相关
const isReplyMsg = ref(false);
const isFocus = ref(false);
const replyMsg = ref<IMMessage>({
  idClient: "",
  from: "",

  type: "",
  text: "",
  body: "",
  sessionId: "",
});
// @消息相关
// const ctx = getCurrentInstance();
// const popupRef = ref(null);
const selectedAtMembers = ref<MentionedMember[]>([]);

// 群相关
const team = ref<Team>();
const teamMembers = ref<TeamMember[]>([]);
const teamMute = ref(false);

const isGroupOwner = computed(() => {
  const myUser = uni.$UIKitStore.userStore.myUserInfo;
  return (
    (team.value ? team.value.owner : "") === (myUser ? myUser.account : "")
  );
});

const isGroupManager = computed(() => {
  const myUser = uni.$UIKitStore.userStore.myUserInfo;
  return teamMembers.value
    .filter((item) => item.type === "manager")
    .some((member) => member.account === (myUser ? myUser.account : ""));
});

const allowAtAll = computed(() => {
  let ext: any = {};
  try {
    ext = JSON.parse((team.value || {}).ext || "{}");
  } catch (error) {
    //
  }
  if (ext[ALLOW_AT] === "manager") {
    return isGroupOwner.value || isGroupManager.value;
  }
  return true;
});

const isTeamMute = computed(() => {
  if (!teamMute.value) {
    return false;
  }
  // 群主或者群管理员在群禁言时，可以发送消息
  if (isGroupOwner.value || isGroupManager.value) {
    return false;
  }
  return true;
});

// const onPopupChange = (e: any) => {
//   uni.$emit(events.HANDLE_MOVE_THROUGH, e.value);
// };

const handleMentionItemClick = (member: MentionedMember) => {
  closePopup();
  uni.$emit(events.HANDLE_MOVE_THROUGH, false);
  const nickInTeam = member.appellation;
  selectedAtMembers.value = [
    ...selectedAtMembers.value.filter(
      (item) => item.account !== member.account
    ),
    member,
  ];
  const newInputText = inputText.value + nickInTeam + " ";
  // 更新input框的内容
  inputText.value = newInputText;
};

const closePopup = () => {
  mentionMemberShow.value = false;
  uni.$emit(events.HANDLE_MOVE_THROUGH, false);
};

const onClickEmojiInput = () => {
  showEmojiInput.value = false;
  extVisible.value = false;
  emojiVisible.value = false;
  setTimeout(() => {
    isFocus.value = true;
  }, 300);
};

const handleInputFocus = () => {
  uni.$emit(events.ON_INPUT_FOCUS_CHANGE, true);
  sendMoreVisible.value = false;
};

const handleInputBlur = () => {
  isFocus.value = false;
  // setTimeout(() => {
  //   uni.$emit(events.ON_SCROLL_BOTTOM)
  // }, 300)
  uni.$emit(events.ON_INPUT_FOCUS_CHANGE, false);
};
const mentionMemberShow = ref(false);
// const inputRef: Ref<HTMLInputElement | null> = ref(null);
const inputCursor = ref(0);
const isNeedAit = ref(false);
const handleInput = (event: any) => {
  const text = event?.detail?.value;

  const isAit = text.endsWith("@") || text.endsWith("@\n");

  inputCursor.value = event.detail.cursor;
  if (props.scene == "team") {
    if (isAit) {
      // ctx.refs.popupRef.open('bottom')
      uni.$UIKitStore.teamStore.getTeamForceActive(props.to).then((res) => {
        const { team } = getServerExt(res.serverExt);
        if (team?.type == GroupType.AFTER_SALES) {
          isNeedAit.value = true;
          // 当前输入的是@
          uni.hideKeyboard();
          // 售后才显示@弹窗
          mentionMemberShow.value = true;
          isFocus.value = false;
          uni.$emit(events.HANDLE_MOVE_THROUGH, true);
        } else {
          isNeedAit.value = false;
        }
      });
    }
  }
};

watch(
  () => inputText.value,
  (newVal, oldVal) => {
    if (!isNeedAit.value) {
      return;
    }
    // https://www.jianshu.com/p/8f1a1d5d447a
    let cursorIndex = 0;
    for (let i = 0; i < oldVal?.length; i++) {
      if (newVal[i] !== oldVal[i]) {
        cursorIndex = i;
        break;
      }
    }

    const atIndex = oldVal.lastIndexOf("@");
    // console.log("atIndex",atIndex)
    // console.log("cursorIndex",cursorIndex)
    if (atIndex !== -1 && cursorIndex > atIndex) {
      const nameIndex = oldVal.indexOf(" ", atIndex);
      //   console.log("nameIndex",nameIndex)
      const name = oldVal.slice(
        atIndex,
        nameIndex !== -1 ? nameIndex : undefined
      );
      //   console.log("name", name)
      //   console.log("atIndex+name.length==",atIndex+name.length)
      if (
        cursorIndex >= atIndex &&
        cursorIndex <= nameIndex &&
        cursorIndex >= atIndex + name.length
      ) {
        inputText.value = oldVal.replace(name, "").trim();
      }
    }
  }
);

// 发送文本消息
const handleSendTextMsg = () => {
  if (inputText.value.trim() === "") return;
  const ext = onAtMembersExtHandler();

  uni.$UIKitStore.msgStore
    .sendTextMsgActive({
      scene: props.scene as TMsgScene,
      to: props.to,
      body: inputText.value,
      ext: selectedAtMembers.value.length && ext,
      // pushInfo: {
      // 	needPush: true,
      // }
      // ext: messageStore.serverExt,
    })
    .then(() => {
      // if (extVisible.value) {
      //   emojiVisible.value = false
      //   extVisible.value = false
      //   uni.hideKeyboard()
      // }
    })
    .catch((err) => {
      console.error("发送消息失败==>", err);
      uni.$main.toast("消息发送失败，请稍后重试");
    });
  inputText.value = "";
  isReplyMsg.value = false;
  selectedAtMembers.value = [];
  uni.$emit(events.ON_SCROLL_BOTTOM);
};

// 移除回复消息
const removeReplyMsg = () => {
  if (uni.$UIKitStore) {
    uni.$UIKitStore.msgStore.removeReplyMsgActive(
      replyMsg?.value?.sessionId as string
    );
    isReplyMsg.value = false;
  }
};

// 显示表情面板
const handleEmojiVisible = () => {
  if (isTeamMute.value) return;
  if (uniPlatform == "mp-weixin" || isAndroidApp) {
    setTimeout(() => {
      emojiVisible.value = true;
      extVisible.value = true;
      uni.$emit(events.ON_SCROLL_BOTTOM);
    }, 300);
  } else {
    emojiVisible.value = true;
    extVisible.value = true;
  }
  showEmojiInput.value = true;
  audioPanelVisible.value = false;
  sendMoreVisible.value = false;
  uni.$emit(events.ON_SCROLL_BOTTOM);
};

// 显示发送更多"+"面板
const handleSendMoreVisible = () => {
  if (isTeamMute.value) return;
  audioPanelVisible.value = false;
  emojiVisible.value = false;
  sendMoreVisible.value = !sendMoreVisible.value;
  setTimeout(() => {
    uni.$emit(events.ON_SCROLL_BOTTOM);
  }, 300);
};

const handleEmoji = (emoji: { key: string; type: string }) => {
  inputText.value += emoji.key;
};
// 删除表情
const handleEmojiDelete = () => {
  let target = "";
  const isEmojiEnd = Object.keys(emojiMap).reduce((prev, cur) => {
    const isEnd = inputText.value.endsWith(cur);
    if (isEnd) {
      target = cur;
    }
    return prev || isEnd;
  }, false);
  if (isEmojiEnd && target) {
    inputText.value = inputText.value.replace(target, "");
  } else {
    inputText.value = inputText.value.slice(0, -1);
  }
};

// 显示语音面板
// const handleAudioVisible = () => {
//   if (isTeamMute.value) return;
//   audioPanelVisible.value = !audioPanelVisible.value;
//   emojiVisible.value = false;
//   setTimeout(() => {
//     uni.$emit(events.ON_SCROLL_BOTTOM);
//   }, 300);
// };

// 发送图片消息
const handleSendImageMsg = (type) => {
  shotActionSheetShow.value = false;
  if (isTeamMute.value) return;
  stopAllAudio();
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: [type], //album 从相册选图，camera 使用相机，默认二者都有
    success: (res) => {
      uni.$UIKitStore.msgStore
        .sendImageMsgActive({
          scene: props.scene as TMsgScene,
          to: props.to,
          filePath: res.tempFilePaths[0],
        })
        .catch((err) => {
          console.log("handleSendImageMsg err", err);
          uni.showToast({
            icon: "error",
            title: t("sendImageFailedText"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            uni.$emit(events.ON_SCROLL_BOTTOM);
          }, 100);
        });
    },
    fail: (err) => {
      shotActionSheetShow.value = false;
      chooseImagePermission(err?.code);
    },
    //没有开启权限时，提示开启权限
    // complete: handleNoPermission,
  });
};

// 发送视频消息（使用相机或者从相册选择）
const handleSendVideoMsg = async (type: string, event: any) => {
  shotActionSheetShow.value = false;
  await uni.$u.sleep(800);
  if (isTeamMute.value) return;
  stopAllAudio();
  // 这里做一层拦截的原因是，微信小程序在input聚焦的时候点击+号按钮，会触发此函数执行，阻止冒泡也无法解决该问题，疑为uniapp编译问题
  if (uniPlatform == "mp-weixin" && event?.type == "blur") {
    return;
  }

  uni.chooseVideo({
    sourceType: [type],
    compressed: true,
    maxDuration: 60,
    success: (res) => {
      uni.$UIKitStore.msgStore
        .sendVideoMsgActive({
          scene: props.scene as TMsgScene,
          to: props.to,
          filePath: res.tempFilePath,
          onUploadStart: () => {
            setTimeout(() => {
              uni.$emit(events.ON_SCROLL_BOTTOM);
            }, 100);
          },
        })
        .catch(() => {
          uni.showToast({
            icon: "error",
            title: t("sendVideoFailedText"),
          });
        })
        .finally(() => {
          setTimeout(() => {
            uni.$emit(events.ON_SCROLL_BOTTOM);
          }, 100);
        });
    },
    fail: (err) => {
      shotActionSheetShow.value = false;
      chooseImagePermission(err?.code);
    },
    //没有开启权限时，提示开启权限
    // complete: handleNoPermission,
  });
};

// 发送语音消息
const handleSendAudioMsg = (filePath: string, duration: number) => {
  uni.$UIKitStore.msgStore
    .sendAudioMsgActive({
      scene: props.scene,
      to: props.to,
      filePath,
      duration,
      onUploadStart: () => {
        setTimeout(() => {
          uni.$emit(events.ON_SCROLL_BOTTOM);
        }, 100);
      },
    })
    .then(() => {
      uni.$emit(events.ON_SCROLL_BOTTOM);
    })
    .catch(() => {
      uni.showToast({
        icon: "error",
        title: t("sendAudioFailedText"),
      });
    })
    .finally(() => {
      setTimeout(() => {
        uni.$emit(events.ON_SCROLL_BOTTOM);
      }, 100);
    });
};

// const handleSendFileMsg = () => {
//   uni.chooseFile({
//     count: 1,
//     success: (res) => {
//       uni.$UIKitStore.msgStore.sendFileMsgActive({
//         scene: props.scene as TMsgScene,
//         to: props.to,
//         filePath: res.tempFilePaths[0],
//       });
//     },
//     // 还没有校验权限
//     // fail: (err) => {
//     // 	chooseImagePermission(err?.code)
//     // },
//   });
// };

// 跳转设置页
// const handleSetting = () => {
//   if (props.scene === "p2p") {
//     customNavigateTo({
//       url: `/pages/Chat/message/p2p-set?id=${props.to}`,
//     });
//   } else if (props.scene === "team") {
//     customNavigateTo({
//       url: `/pages/Group/group-set/index?id=${props.to}`,
//     });
//   }
// };

onMounted(() => {
  autorun(() => {
    if (props.scene === "team") {
      const team = deepClone(uni.$UIKitStore.teamStore.teams.get(props.to));
      team.value = team;
      teamMute.value = team.mute;

      teamMembers.value = deepClone(
        uni.$UIKitStore.teamMemberStore.getTeamMember(props.to)
      );
    }
  });

  // 撤回后，重新编辑消息
  uni.$on(events.ON_REEDIT_MSG, (msg: IMMessage) => {
    const _replyMsg = props.replyMsgsMap?.[msg.idClient];
    // 如果重新编辑的是回复消息，则需要将回复消息展示在输入框上方
    if (_replyMsg?.idClient) {
      _replyMsg && uni.$UIKitStore.msgStore.replyMsgActive(_replyMsg);
      replyMsg.value = _replyMsg;
      isReplyMsg.value = true;
    }
    // 如果重新编辑的是@消息，则需要将被@的成员重新加入selectedAtMembers
    if (msg.ext) {
      const extObj = JSON.parse(msg.ext);
      const yxAitMsg = extObj.yxAitMsg;
      if (yxAitMsg) {
        const _mentionedMembers: MentionedMember[] = [];
        Object.keys(yxAitMsg).forEach((key) => {
          if (key == AT_ALL_ACCOUNT) {
            _mentionedMembers.push({
              account: key,
              appellation: "所有人",
            });
          } else {
            _mentionedMembers.push({
              account: key,

              appellation: uni.$UIKitStore.uiStore.getAppellation({
                account: key,
                teamId: props.to,
                ignoreAlias: true,
              }),
            });
          }
        });
        selectedAtMembers.value = _mentionedMembers;
      }
    }
    inputText.value = msg?.attach?.oldBody;
    isFocus.value = true;
  });

  uni.$on(events.REPLY_MSG, (msg: IMMessage) => {
    isReplyMsg.value = true;
    isFocus.value = true;
    replyMsg.value = msg;
  });

  uni.$on(events.AIT_TEAM_MEMBER, (member) => {
    selectedAtMembers.value = [
      ...selectedAtMembers.value.filter(
        (item) => item.account !== member.account
      ),
      member,
    ];
    const newInputText = inputText.value + "@" + member.appellation + " ";
    // 更新input框的内容
    inputText.value = newInputText;
  });

  // 关闭表情、语音、发送更多面板
  uni.$on(events.CLOSE_PANEL, () => {
    emojiVisible.value = false;
    extVisible.value = false;
    audioPanelVisible.value = false;
    sendMoreVisible.value = false;
  });

  // @消息 @群成员
  uni.$on(events.HANDLE_AIT_MEMBER, (member) => {
    handleMentionItemClick(member);
  });

  // 关闭@群成员面板
  uni.$on(events.CLOSE_AIT_POPUP, () => {
    closePopup();
  });

  // 表情点击
  uni.$on(events.EMOJI_CLICK, (emoji) => {
    handleEmoji(emoji);
  });

  // 表情删除
  uni.$on(events.EMOJI_DELETE, () => {
    handleEmojiDelete();
  });

  // 表情发送
  uni.$on(events.EMOJI_SEND, () => {
    emojiVisible.value = false;
    extVisible.value = false;
    handleSendTextMsg();
  });

  if (uni.onKeyboardHeightChange) {
    uni.onKeyboardHeightChange((res) => {
      const isAndroidApp =
        uni.getSystemInfoSync().platform == "android" && uniPlatform == "app";
      const isAndroidWxapp =
        uni.getSystemInfoSync().platform == "android" &&
        uniPlatform == "mp-weixin";
      // 此处是为了点击安卓键盘上的收起按钮时，表情面板需要隐藏
      if (
        (res && res?.height === 0 && isAndroidApp) ||
        (res?.height === 0 && isAndroidWxapp)
      ) {
        emojiVisible.value = false;
        extVisible.value = false;
      }
    });
  }
});

const onAtMembersExtHandler = () => {
  let ext: any;
  if (selectedAtMembers.value.length) {
    selectedAtMembers.value
      .filter((member) => {
        if (!allowAtAll.value && member.account === AT_ALL_ACCOUNT) {
          return false;
        }
        return true;
      })
      .forEach((member) => {
        const substr = `@${member.appellation}`;
        const positions: number[] = [];
        let pos = inputText.value?.indexOf(substr);
        while (pos !== -1) {
          positions.push(pos);
          pos = inputText.value?.indexOf(substr, pos + 1);
        }
        if (positions.length) {
          if (!ext) {
            ext = {
              yxAitMsg: {
                [member.account]: {
                  text: substr,
                  segments: [],
                },
              },
            };
          } else {
            ext.yxAitMsg[member.account] = {
              text: substr,
              segments: [],
            };
          }
          positions.forEach((position) => {
            const start = position;
            ext.yxAitMsg[member.account].segments.push({
              start,
              end: start + substr.length,
              broken: false,
            });
          });
        }
      });
  }
  return ext;
};

// 显示按钮组
const handleShowButtonGroup = () => {
  sendMoreVisible.value = false;
};

onUnmounted(() => {
  uni.$off(events.REPLY_MSG);
  uni.$off(events.ON_REEDIT_MSG);
  uni.$off(events.REPLY_MSG);
  uni.$off(events.AIT_TEAM_MEMBER);
  // 关闭表情面板
  uni.$off(events.CLOSE_PANEL);
  // @消息 @群成员
  uni.$off(events.HANDLE_AIT_MEMBER);
  // 关闭@群成员面板
  uni.$off(events.CLOSE_AIT_POPUP);
  // 表情点击
  uni.$off(events.EMOJI_CLICK);
  // 表情删除
  uni.$off(events.EMOJI_DELETE);
  // 表情发送
  uni.$off(events.EMOJI_SEND);
  removeReplyMsg();
});

defineExpose({});
</script>

<style scoped lang="scss">
// @import '../../styles/common.scss';
.action-sheet-wrapper {
  .action-sheet-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 110rpx;
    border-bottom: 2rpx solid #f4f5f6;
    font-size: 32rpx;
    color: #1a1a1a;
  }

  .action-sheet-item:first-child {
    padding-top: 22rpx;
  }

  .cencel {
    height: 120rpx;
    color: #afafaf !important;
  }
}

.input-root {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: auto;
  max-height: 300px;
  position: relative;
}

.input-root-h5 {
  height: auto;
  position: relative;
  order: 1;
}

.msg-input-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f4f5f6;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  z-index: 99;
  padding-bottom: 24rpx;
}

.msg-input {
  padding: 10rpx 24rpx 24rpx 24rpx;
  background-color: #f4f5f6;
  @include flex;
  align-items: center;
  // justify-content: center;

  .input-box {
    flex: 1;
  }

  .msg-input-right-button {
    margin-left: 22rpx;
    &.sead {
      margin-left: 12rpx;
      width: 74rpx;
      display: flex;
      align-items: center;
      justify-content: right;
    }
    .msg-input-send {
      height: 60rpx;
      width: 74rpx;
      color: #ffffff;
      background-color: #1cc7be;
      border-radius: 8rpx;
      @include flex;
      align-items: center;
      justify-content: center;
      font-size: 26rpx;
    }
  }

  &-input {
    background-color: #ffffff;
    height: 72rpx;
    font-size: 28rpx;

    padding: 0 24rpx;
    border-radius: 100rpx;
    // margin-bottom: 5px;

    &::placeholder {
      padding: 0 24rpx;
    }
  }
}

.msg-button-group {
  // border: 1px solid;
  // padding: 40rpx 20rpx 80rpx 20rpx;
  padding: 20rpx;
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: left;

  .msg-input-button {
    // flex: 1;
    width: 100rpx;
    // &:not(:last-child) {
    //   margin-right: 60px;
    // }

    &.msg-input-loading {
      animation: loadingCircle 1s infinite linear;
      z-index: 1;
      width: 20px;
      height: 20px;
      margin-top: 4px;

      .loading {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.msg-ext {
  overflow-y: auto;
  width: 100%;
  height: 300px;
  background-color: #f4f5f6;
  z-index: 1;
}

.msg-emoji-panel {
  overflow-y: auto;
  width: 100%;
  height: 600rpx;

  background-color: #f4f5f6;
  z-index: 1;
}

.msg-audio-panel {
  overflow-y: hidden;
  width: 100%;
  height: 300px;
  background-color: #f4f5f6;
  z-index: 1;
}

.send-more-panel {
  display: flex;
  justify-content: space-around;
  padding-bottom: 20rpx;
  overflow-y: hidden;
  width: 100%;
  // height: 300px;
  background-color: #f4f5f6;
  z-index: 1;
}

.reply-message-wrapper {
  display: flex;
  font-size: 13px;
  background-color: #eff1f2;
  height: 25px;
  padding-top: 6px;
  align-items: center;
  color: #929299;

  .reply-noFind {
    width: fit-content;
  }

  .reply-message-close {
    flex-basis: 14px;
    margin-left: 10px;
    display: flex;
    align-items: center;
  }

  .reply-message {
    display: flex;
    align-items: center;
    flex-basis: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reply-title {
    flex-basis: 30px;
    white-space: nowrap;
    margin-right: 5px;
  }

  .reply-to {
    flex-basis: content;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }
}

.input-emoji {
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding: 0 12px;
  border-radius: 6px;
}

.input-text {
  white-space: nowrap;
}

.input-placeholder {
  background-color: #fff;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  padding: 0 12px;
  border-radius: 6px;
  color: gray;
}

.send-more-panel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  // border:1px solid red;
  .icon-box {
    width: 116rpx;
    height: 116rpx;
    background: #ffffff;
    border-radius: 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 10px;
    justify-content: center;
  }

  .text {
    font-size: 24rpx;
    color: #1a1a1a;
    margin-top: 22rpx;
  }
}
</style>
