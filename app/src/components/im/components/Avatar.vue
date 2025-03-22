<template>
  <div v-if="showAvatar" class="avatar-wrapper">
    <div class="avatar" :style="{ width: size + 'px', height: size + 'px' }">
      <!-- @click="handleAvatarClick"
      @longpress="longpress"
      @touchend="touchend" -->
      <!-- 使用遮罩层避免android长按头像会出现保存图片的弹窗 -->
      <div class="img-mask"></div>
      <image
        v-if="userAvatar"
        :style="`width:${size}px;height: ${size}px;`"
        :lazy-load="true"
        class="avatar-img"
        :src="userAvatar"
        mode="aspectFill"
      />
    </div>
    <div v-if="unread" class="unread">
      <div v-if="isMute" class="dot"></div>
      <text v-else class="badge">{{ unread }}</text>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { customNavigateTo, customRedirectTo } from "../utils/customNavigate";
// import type { UserNameCard } from "@xkit-yx/im-store";
// import { autorun } from "mobx";
import { ref, computed, onMounted, watch } from "../utils/transformVue";
import { useMessageStore } from "@/stores/message";
import { includeNotification } from "@/components/im/conversation-list";

const messageStore = useMessageStore();
const props = defineProps({
  account: {
    type: String,
    default: "",
    required: false,
  },
  to: {
    type: String,
    default: "",
  },
  teamId: {
    type: String,
    default: "",
  },
  avatar: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "40",
  },
  gotoUserCard: {
    type: Boolean,
    default: false,
  },
  fontSize: {
    type: String,
    default: "",
  },
  isRedirect: {
    type: Boolean,
    default: false,
  },
  unread: {
    type: [String, Number],
    default: 0,
  },
  isMute: {
    type: Boolean,
    default: false,
  },
});
// const $emit = defineEmits(["onLongpress"]);

const avatarMap = {
  default:
    "https://static-gamehub-client.sh28.vip/assets/avatar/user_avatar_1.png", // 默认头像
  robot:
    "https://static-gamehub-client.sh28.vip/assets/avatar/robot_avatar.png", // 小帮手头像
  system:
    "https://static-gamehub-client.sh28.vip/assets/avatar/system_avatar.png", // 系统消息头像
  activity:
    "https://static-gamehub-client.sh28.vip/assets/avatar/activity_avatar.png", // 活动消息头像
  trade:
    "https://static-gamehub-client.sh28.vip/assets/avatar/trade_avatar.png", // 交易消息头像
};

// let isLongPress = false; // uniapp 长按事件也会触发点击事件，此时需要处理

const userAvatar = ref(null);

const showAvatar = computed(() => !includeNotification(props.to));

const getAvatar = () => {
  if (props.avatar) {
    userAvatar.value = props.avatar;
  } else if (props.account.includes("@role_robot")) {
    userAvatar.value = avatarMap.robot;
  } else if (props.account.includes("@system_notification")) {
    userAvatar.value = avatarMap.system;
  } else if (props.account.includes("@trade_notification")) {
    userAvatar.value = avatarMap.trade;
  } else if (props.account.includes("@activity_notification")) {
    userAvatar.value = avatarMap.activity;
  } else if (messageStore.isConected && props.account) {
    const data = uni.$UIKitStore.userStore.users.get(props.account);
    userAvatar.value = data?.avatar || avatarMap.default;
  } else {
    userAvatar.value = avatarMap.default;
  }
};

watch(
  () => messageStore.isConected,
  (value) => {
    if (showAvatar.value && value) {
      getAvatar();
    }
  },
  {
    deep: true,
    flush: "post",
  }
);

onMounted(() => {
  if (showAvatar.value) {
    getAvatar();
  }
});

// const navigateTo = (url) => {
//   if (props.isRedirect) {
//     customRedirectTo({
//       url: url,
//     });
//   } else {
//     customNavigateTo({
//       url: url,
//     });
//   }
// };

// const handleAvatarClick = () => {
//   if (props.gotoUserCard && !isLongPress) {
//     if (props.account === uni.$UIKitStore?.userStore?.myUserInfo.account) {
//       navigateTo({
//         url: `/pages/user-card/my-detail/index`,
//       });
//     } else {
//       navigateTo({
//         url: `/pages/user-card/friend/index?account=${props.account}`,
//       });
//     }
//   }
// };

// const longpress = () => {
//   isLongPress = true;
//   $emit("onLongpress");
// };

// const touchend = () => {
//   setTimeout(() => {
//     isLongPress = false;
//   }, 200);
// };
</script>

<style scoped lang="scss">
$avatarSize: 100%;
// .avatar-wrapper {
// width: 0rpx;
// border: 1px solid red;
// }
.avatar {
  position: relative;
  background-color: #ffffff;
  border-radius: 100rpx;
}

.img-mask {
  position: absolute;
  z-index: 10;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
}

.avatar-img {
  // width: $avatarSize;
  // height: $avatarSize;
  border-radius: 100rpx;
  border: 2rpx solid #f4f5f6;
}

.avatar-name-wrapper {
  border-radius: 50rpx;
  width: $avatarSize;
  height: $avatarSize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-name-text {
  color: #fff;
  font-size: 14px;
}

.dot {
  background-color: #ff4d4f;
  color: #fff;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  // box-sizing: border-box;
  z-index: 99;
}

.badge {
  background-color: #ff4d4f;
  color: #fff;
  font-size: 12px;
  // width: 48rpx;
  padding: 0 12rpx;
  height: 18px;
  line-height: 19px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  position: relative;
}

.unread {
  position: absolute;
  right: 0rpx;
  top: 0rpx;
  z-index: 9999;
}
</style>
