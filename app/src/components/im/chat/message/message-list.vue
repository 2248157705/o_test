<template>
  <div
    id="yxMsgList"
    ref="msgList"
    class="msg-list-wrapper"
    :style="msgListStyle"
    @touchstart="handleTapMessageList"
  >
    <scroll-view
      scroll-y="true"
      :scroll-top="scrollTop"
      class="message-scroll-list"
    >
      <div v-show="!noMore" class="view-more-text" @click="onLoadMore">
        {{ t("viewMoreText") }}
      </div>
      <view v-show="noMore && finalMsgs.length < 1" class="msg-tip">{{
        t("noMoreText")
      }}</view>
      <div v-for="(item, index) in finalMsgs" :key="item.renderKey">
        <MessageItem
          ref="messageItemRef"
          :key="item.renderKey"
          :scene="scene"
          :to="to"
          :msg="item"
          :index="index"
          :reply-msg="replyMsgsMap && replyMsgsMap[item.idClient]"
        >
        </MessageItem>
      </div>
      <!-- <div v-if="isIosH5" class="block"></div> -->
    </scroll-view>
  </div>
</template>

<script lang="ts" setup>
import type { IMMessage } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import {
  ref,
  computed,
  onBeforeMount,
  onUnmounted,
} from "@/components/im/utils/transformVue";
import MessageItem from "./message-item.vue";
import { events } from "@/components/im/utils/constants";
import { caculateTimeago } from "@/components/im/utils/date";
import { onPageScroll } from "@dcloudio/uni-app";
import { getUniPlatform } from "@/components/im/utils";
import { t } from "@/components/im/utils/i18n";
import { onMsgListLayoutEvent } from "@/components/im/utils/msg";
import { nextTick } from "vue";
const props = defineProps({
  msgs: {
    type: Array,
    required: true,
  },
  scene: {
    type: String, // Assuming TMsgScene is a custom object type
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  loadingMore: {
    type: Boolean,
    default: undefined,
  },
  noMore: {
    type: Boolean,
    default: undefined,
  },
  replyMsgsMap: {
    type: Object,
    default: undefined,
  },
});
const sysInfo = uni.getSystemInfoSync();
const isKeyboardUp = ref(false);
const uniPlatform = getUniPlatform();
// const isIosH5 = uniPlatform == "web" && sysInfo.platform == "ios";
const scrollTop = ref(9999);
const finalMsgs = computed(() => {
  const res: IMMessage[] = [];

  props.msgs.forEach((item: IMMessage, index) => {
    // 如果两条消息间隔超过5分钟，插入一条自定义时间消息

    if (index > 0 && item.time - props.msgs[index - 1].time > 5 * 60 * 1000) {
      res.push({
        idClient: "time-" + item.time,
        type: "custom",
        attach: {
          type: "time",
          value: caculateTimeago(item.time),
        },
        status: "sent",
        time: item.time,

        renderKey: `${item.time + 1}`,
      });
    }
    res.push(Object.assign({}, item, { renderKey: `${item.time}` }));
  });
  return res;
});

// const start = ref(0)
// const end = computed(() => start.value + HISTORY_LIMIT)

// let lock = false

onPageScroll(() => {
  isKeyboardUp.value = false;
});

// 消息滑动到底部，建议搭配 nextTick 使用
const scrollToBottom = () => {
  scrollTop.value += 3000;
  const timer = setTimeout(() => {
    scrollTop.value += 1;
    clearTimeout(timer);
  }, 300);
};

const onLoadMore = () => {
  const msg = finalMsgs.value.filter(
    (item) =>
      !(
        item.type === "custom" &&
        ["beReCallMsg", "reCallMsg"].includes(item.attach?.type || "")
      )
  )[0];
  if (msg) {
    uni.$emit(events.GET_HISTORY_MSG, msg);
  }
};

const handleTapMessageList = () => {
  uni.$emit(events.CLOSE_PANEL);
  setTimeout(() => {
    uni.$emit(events.CLOSE_PANEL);
  }, 300);
};
// const moveThrough = ref(false);

const msgList = ref(null);
const msgListStyle = ref({});
let toolHeight = 180;
const toolOffset = 20; //偏移量
// const instance = getCurrentInstance();

const adaptLayout = () => {
  nextTick(() => {
    const query = uni.createSelectorQuery().in(this);
    const yxMsgInputEl = query.select("#yxMsgInput");
    if (query && yxMsgInputEl) {
      yxMsgInputEl.boundingClientRect((data) => {
        if (data) {
          console.log("输入框高度:", data);
          if (data.height) {
            toolHeight = data?.height;
          }
          msgListStyle.value = {
            heigth: `calc(${sysInfo.windowHeight}px - ${toolHeight}px)`,
          };
        } else {
          console.log("输入框高度2:", data);
          msgListStyle.value = {
            heigth: `calc(${sysInfo.windowHeight}px - ${toolOffset}px)`,
          };
        }
      });
      query.exec();
    }
  });
};

onBeforeMount(() => {
  if (props.scene === "team") {
    uni.$UIKitStore.teamMemberStore.getTeamMemberActive(props.to);
  }
  uni.$on(events.SEND_MSG, () => {
    scrollToBottom();
  });

  uni.$on(events.ON_CHAT_MOUNTED, (msg: IMMessage) => {
    console.log("msg", msg);
    if (uniPlatform === "mp-weixin") {
      scrollToBottom();
    } else {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  });

  uni.$on(events.ON_MSG, () => {
    setTimeout(() => {
      scrollToBottom();
    }, 300);
  });

  uni.$on(events.ON_SCROLL_BOTTOM, () => {
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  });

  uni.$on(events.ON_LOAD_MORE, () => {
    const msg = finalMsgs.value.filter(
      (item) =>
        !(
          item.type === "custom" &&
          ["beReCallMsg", "reCallMsg"].includes(item.attach?.type || "")
        )
    )[0];
    if (msg) {
      uni.$emit(events.GET_HISTORY_MSG, msg);
    }
  });

  uni.$on(events.ON_INPUT_FOCUS_CHANGE, (flag) => {
    isKeyboardUp.value = flag;
  });

  adaptLayout();
  onMsgListLayoutEvent(this, msgList);

  // uni.$on(events.ON_REACH_BOTTOM, () => {
  // if (end.value < props.msgs.length && !lock) {
  //   lock = true
  //   start.value += HISTORY_LIMIT
  //   setTimeout(() => {
  //     lock = false
  //   }, 1500)
  // }
  // console.log('到底了！！！！', 'start: ', start.value, 'lock: ', lock, 'msg.lenght: ', props.msgs.length)
  // })
});

// uni.$on(events.ON_REACH_TOP, () => {
//   if (start.value > 0 && !lock) {
//     lock = true
//     start.value -= HISTORY_LIMIT
//     setTimeout(() => {
//       lock = false
//     }, 1500)
//   }
//   console.log('到顶了！！！！', 'start: ', start.value, 'lock: ', lock, 'msg.lenght: ', props.msgs.length)
// })

onUnmounted(() => {
  uni.$off(events.SEND_MSG);

  uni.$off(events.ON_CHAT_MOUNTED);

  uni.$off(events.ON_MSG);

  uni.$off(events.ON_SCROLL_BOTTOM);

  uni.$off(events.ON_LOAD_MORE);

  uni.$off(events.ON_INPUT_FOCUS_CHANGE);

  // #ifdef H5
  uni.$off(events.LAYOUT_MSG_LIST);
  // #endif
});
</script>

<style scoped lang="scss">
.msg-list-wrapper {
  //flex: 1;
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
  //padding: 16px 0;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

// .msg-list {
//   padding: 0 16px 20px 16px;
//   box-sizing: border-box;
//   transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
//   overflow-x: hidden;
//   // height: 100%;
// }

.msg-tip {
  text-align: center;
  color: #b3b7bc;
  font-size: 12px;
  margin-top: 10px;
}

.block {
  width: 100%;
  height: 40px;
}

.message-scroll-list {
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 1px;
}

.view-more-text {
  text-align: center;
  color: #b3b7bc;
  font-size: 15px;
  margin-top: 20px;
}

page > view > message > view > message-list {
  height: 100%;
}
</style>
