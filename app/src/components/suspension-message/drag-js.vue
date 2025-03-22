<template>
  <view class="suspension-message-wrapper">
    <view
      id="_drag_button"
      class="icon-wrapper"
      :class="`${messageListPopup.transition ? 'icon-show' : 'icon-hide'}`"
      :style="`top: ${position.top + 'px'};left: ${position.left + 'px'}`"
      @touchmove.stop.prevent="touchmove"
      @touchend="touchend"
    >
      <!-- :class="`${messageListPopup.transition ? 'show' : 'hide'}`" -->
      <!--      :style="`top: ${parseInt(screenHeight / 2)}px;`"-->
      <view
        v-if="messageListPopup.transition"
        class="content"
        @click="messageListPopup.show = true"
      >
        <image
          class="img"
          src="/static/images/im/my/suspension-message.png"
          @click="handleImgClick"
        />
        <view class="unread-wrapper">
          <text class="text">消息{{ unread > 99 ? 99 : unread }}</text>
          <text v-if="unread > 99" class="add">+</text>
        </view>
      </view>
      <image
        v-else
        class="img rotate"
        src="/static/images/im/my/suspension-message.png"
        @click="handleImgClick"
      />
    </view>

    <!-- @click="messageListPopup.show = true" -->
    <MessageListPopup
      :show="messageListPopup.show"
      :popupStyle="messageListPopup.style"
      :closeable="false"
      @close="messageListPopup.show = false"
    >
      <view class="message-list-popup-title">
        <u--image
          src="/static/images/im/my/message-page-title.png"
          width="148rpx"
          height="36rpx"
        />
      </view>
      <scroll-view
        class="scroll-view"
        scroll-y="true"
        :show-scrollbar="false"
        :style="`height: ${parseInt(screenHeight / 1.5)}px`"
      >
        <ConversationList :isPopup="true" />
      </scroll-view>
    </MessageListPopup>
  </view>
</template>
<script setup>
import MessageListPopup from "@/components/popup/index.vue";
import ConversationList from "@/components/im/conversation-list/index.vue";
import { onUnmounted, reactive, ref, onMounted, getCurrentInstance } from "vue";
// import { useMessageStore } from "@/stores/message";

defineProps({
  screenHeight: {
    type: [Number, String],
    default: 0,
  },
});
// const messageStore = useMessageStore();
const unread = ref(0);

const position = ref({
  left: 80,
  top: 80,
  edge: 10,
  isDock: false,
  isMove: true,
  offsetWidth: 0,
  offsetHeight: 0,
  width: 0,
  height: 0,
  windowWidth: 0,
  windowHeight: 0,
});

onMounted(() => {
  const sys = uni.getSystemInfoSync();
  position.value.windowWidth = sys.windowWidth;
  position.value.windowHeight = sys.windowHeight;

  const instance = getCurrentInstance();
  const query = uni.createSelectorQuery().in(instance.proxy);

  query
    .select("#_drag_button")
    .boundingClientRect((data) => {
      position.value.width = data.width;
      position.value.height = data.height;
      position.value.offsetWidth = data.width / 2;
      position.value.offsetHeight = data.height / 2;
      // position.value.left = position.value.windowWidth - position.value.width - position.value.edge;
      // position.value.top = position.value.windowHeight - position.value.height - position.value.edge;
      console.log("布局信息:", data, position.value);
    })
    .exec();
});

const touchmove = (e) => {
  // 单指触摸
  if (e.touches.length !== 1) {
    return false;
  }

  position.value.isMove = true;
  // pageX
  // clientX
  // clientY
  // pageY
  position.value.left = e.touches[0].clientX - position.value.offsetWidth;
  let clientY = e.touches[0].clientY - position.value.offsetHeight;
  // #ifdef H5
  clientY += position.value.height;
  // #endif
  const edgeBottom =
    position.value.windowHeight - position.value.height - position.value.edge;
  // // 上下触及边界
  if (clientY < position.value.edge) {
    position.value.top = position.value.edge;
  } else if (clientY > edgeBottom) {
    position.value.top = edgeBottom;
  } else {
    position.value.top = clientY;
  }
};

const touchend = () => {
  position.value.isMove = false;
};

const messageListPopup = reactive({
  show: false,
  style: {
    backgroundColor: "#fff", // 修改背景色
    borderTopLeftRadius: "24rpx", // 修改圆角
    borderTopRightRadius: "24rpx", // 修改圆角
    padding: "0 0 24rpx 0",
  },

  timer: null,
  transition: false,
});

const handleImgClick = () => {
  messageListPopup.transition = true;
  clearTimeout(messageListPopup.timer);
  getUnread();
  messageListPopup.timer = setTimeout(() => {
    messageListPopup.transition = false;
  }, 4000);
};
let onmsgTimer = null;
uni.$UIKitNIM?.on("msg", async () => {
  clearTimeout(onmsgTimer);
  onmsgTimer = setTimeout(() => {
    getUnread();
    clearTimeout(onmsgTimer);
  }, 1200);
});
const getUnread = () => {
  const store = uni.$UIKitStore;
  unread.value = store?.uiStore?.sessionUnread || 0;
  // unread.value = 999;
  // unread.value = unread.value > 99 ? 99 : unread.value;
};

onUnmounted(() => {
  clearTimeout(messageListPopup.timer);
});
</script>
<style lang="scss" scoped>
.suspension-message-wrapper {
  .message-list-popup-title {
    height: 124rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1rpx solid #f5f5f5;
  }
  .icon-wrapper {
    position: fixed;
    transition: left 0.5s;
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .unread-wrapper {
      @include flex;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 130rpx;
      height: 38rpx;
      background: linear-gradient(to right, #5effc5, #46fff5);
      border-radius: 50rpx;
      position: relative;
      // top: -20rpx;
      left: -8rpx;
      margin: -20rpx 0 0 0;

      z-index: 99;
      .text {
        font-weight: 600;
        font-size: 24rpx;
        color: #083e57;
      }
      .add {
        font-size: 20rpx;
        font-weight: 600;
        color: #083e57;
      }
    }
    &.icon-hide {
      left: 680rpx;
      // transform: rotate(-20deg);
    }

    &.icon-show {
      left: 600rpx;
      // transform: rotate(0deg);
    }
    .img {
      width: 152rpx;
      height: 124rpx;

      &.rotate {
        transform: rotate(-10deg);
      }
      // transform: rotate(-60deg) !important;

      // &.hide {
      //   transition-timing-function: ease-in;
      //   transition-duration: 0.5s;
      //   transform: translateX(400rpx);
      // }
      // &.show {
      //   transition-timing-function: ease-out;
      //   transition-duration: 0.5s;
      //   transform: translateX(0rpx);
      // }
    }
  }
}
</style>
