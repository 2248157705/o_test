<template>
  <!-- 输入框上操作组 -->
  <u-scroll-list :indicator="false">
    <div v-if="buttonGroups.length" class="msg-action-group">
      <div
        v-for="(item, index) in buttonGroups"
        :id="`card${index}`"
        :key="index"
        :class="`card msg-action-group-card_${index}`"
        :style="`width:${item.title.length * 40}rpx`"
      >
        <u-transition
          v-if="item.submenu && item.submenu.length > 0"
          :show="showSubMenu[item.title]"
        >
          <view
            :id="`options${index}`"
            :class="`service-options-box service-options-box_${index}`"
            :style="buttonGroupsStyle"
          >
            <view
              v-for="(sb, sb_index) in item.submenu"
              :key="sb_index"
              class="cell"
              @click="handleSubMenu(sb, item.title)"
            >
              <text class="text">{{ sb.title }}</text>
            </view>
          </view>
        </u-transition>
        <text class="text" @click.stop="handleMenu(item, index)">{{
          item.title
        }}</text>
        <image
          v-if="item.submenu && item.submenu.length > 0"
          :class="showSubMenu[item.title] ? '' : 't-open'"
          class="triangle"
          src="/static/images/im/triangle.png"
        />
      </div>
    </div>
  </u-scroll-list>

  <ProductSnapshot
    v-if="productCardData"
    v-model:show="cardLinkShow"
    :info="productCardData"
    @send="sendCardLinkMsg"
  />
</template>

<script lang="ts" setup>
import type { TMsgScene } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import dayjs from "dayjs";
import { throttle } from "lodash-es";
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  nextTick,
  getCurrentInstance,
  reactive,
} from "vue";
import { events } from "@/components/im/utils/constants";
import { GroupType } from "@/components/im/utils/enums";
import { useMessageStore } from "@/stores/message";
import { isAppAudit } from "@/utils/app-audit";
import { getServerExt } from "@/components/im/conversation-list";
import { systemInfo } from "@/utils/index";
import {
  getTeamQuickInquiry,
  productRecoveryRequestConfirmReceiptCard,
} from "@/api/chat";
import { setConsultationRecords } from "@/api/product";
import ProductSnapshot from "@/components/im/chat/message/card/product-card/product-snapshot.vue";
import { commonEvent } from "@/utils/config";

// 快捷语类型
enum MenuType {
  INQUIRY = "inquiry", //咨询
  PAT = "pat", // 催一催
  REDIRECT = "redirect", // 跳转链接
  CONFIRM_RECEIPT = "confirm_receipt", // 请买家确认收货
  NONE = "none", // 不执行操作
}

const props = defineProps({
  scene: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  ext: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["show"]);

const { proxy } = getCurrentInstance();
const messageStore = useMessageStore();

const confirm_receipt_btn = [
  {
    title: "请买家确认收货",
    type: "confirm_receipt",
    config: {
      keyword: "",
      params: {},
    },
    submenu: [],
  },
];

const showSubMenu = reactive({});
const buttonGroupsStyle = ref({});
const cardLinkShow = ref(true);

const productCardData = computed(() => {
  const { type, option } = messageStore.productCardData || {};
  if (type === "card" && option?.template === "product_detail") {
    return option?.content;
  } else {
    return null;
  }
});

const buttonGroups = computed(() => {
  const menus = messageStore.teamQuickInquiryMenu;
  const loginCredential = messageStore.loginCredential;
  const { team, buyer } = getServerExt(props.ext);
  if (isAppAudit()) {
    return [];
  } else if (team?.type === GroupType.CONSULT) {
    return menus?.consultation_team || [];
  } else if (team?.type === GroupType.AUDITING) {
    return menus?.review_team || [];
  } else if (team?.type === GroupType.AFTER_SALES) {
    return menus?.after_sale_team || [];
  } else if (team?.type === GroupType.SECURED_TRANSACTION) {
    return menus?.secured_transaction || [];
  } else if (team?.type === GroupType.TYPE_PRODUCT_RECOVERY) {
    const isSelf = loginCredential?.accid == buyer?.accid;
    // 买家
    if (!isSelf) {
      return [...menus.product_recovery, ...confirm_receipt_btn];
    }
  }
  return [];
});

// 设置按钮组样式
const setButtonGroupsStyle = (index) => {
  uni
    .createSelectorQuery()
    .in(proxy)
    .selectAll(
      `.msg-action-group-card_${index},
			  .msg-input-wrapper,.service-options-box_${index}`
    )
    .boundingClientRect((data) => {
      console.log("data=====", data);
      const right = parseInt(systemInfo.windowWidth - data[1].right);
      let str = `right: 24px;`;
      if (data[1].right < systemInfo.windowWidth) {
        str = `right: ${right < 10 ? 12 : right}px;`;
      }
      if (data[1].left < data[1].width) {
        str = `left: 12px;`;
      }
      if (data.lenght > 0 && data[0].height) {
        buttonGroupsStyle.value = `position:fixed; z-index: 5; bottom:${data[0].height}px; ${str}`;
      }
    })
    .exec();
};

const sendTextMsgActive = (body, cb) => {
  console.log("sendTextMsgActive==>", body, props.to, props.scene);
  uni.$UIKitStore.msgStore
    .sendTextMsgActive({
      scene: props.scene as TMsgScene,
      to: props.to,
      body: body,
    })
    .then(() => {
      cb && cb();
    })
    .catch((err) => {
      console.error("发送消息失败==>", err);
      uni.$main.toast("消息发送失败，请稍后重试");
    });
};
// 发送自定消息
const sendCustomMsgActive = (attach: any, cb) => {
  const from = uni.$UIKitStore.userStore.myUserInfo.account;
  // sence代表发送场景 form 发送方 to接收方
  uni.$UIKitStore.msgStore
    .sendCustomMsgActive({
      scene: props.scene,
      from,
      to: props.to,
      attach: JSON.stringify(attach),
    })
    .then(() => {
      cb && cb();
      cardLinkShow.value = false;
      uni.$emit(events.ON_SCROLL_BOTTOM);
    })
    .catch((err) => {
      console.log("sendCustomMsgActive err", err);
      uni.$main.toast("消息发送失败，请稍后重试");
    });
};

//  发送商品卡片
const sendCardLinkMsg = () => {
  const attach = messageStore.productCardData;
  console.log("attachattachattachattachattach", attach);
  sendCustomMsgActive(attach);
  fetchsetConsultationRecords(attach?.option?.content?.product_id);
};

//商品咨询记录录入
const fetchsetConsultationRecords = async (product_id: string) => {
  if (product_id) {
    const res = await setConsultationRecords(product_id);
    console.log("fetchsetConsultationRecords", res);
  }
};

// 请买家确认收货
const handleConfirmReceipt = () => {
  const { ticket } = getServerExt(props.ext);
  productRecoveryRequestConfirmReceiptCard({ ticket_id: ticket?.id });
};

// 发送催一催
const handleSendUrgent = (msg) => {
  const attach = {
    type: "text",
    option: {
      scene: "team_prompt",
      position: "center",
      content: {
        msg: msg,
      },
    },
  };

  const lastUsedTime = messageStore.lastUsedPatTime || {};
  const currentTime = dayjs();
  const lastTime = lastUsedTime[props.to] || 0;
  const diff = currentTime.diff(dayjs(lastTime), "minute");

  if (diff > 10) {
    // 更新最后使用时间为当前时间
    lastUsedTime[props.to] = currentTime;
    messageStore.setLastUsedPatTime(lastUsedTime);
    sendCustomMsgActive(attach);
  } else {
    // 如果在10分钟内，显示提示信息
    uni.$main.toast("稍安勿躁，请10分钟后重试");
  }
};

// 请求接口发送快捷语
const sendTeamQuickInquiry = (keyword: string) => {
  getTeamQuickInquiry({ tid: props.to, keyword: keyword });
};

// 发送快捷语 0：文本消息 1：图片消息 2：语音消息  3：视频消息 4：地理位置消息 6：文件消息 10：自定义消息 100：自定义消息
const handleSendMsgType = (item) => {
  const { type, config } = item;
  const sendData = config?.params?.send;
  const errorMsg = "发送消息内容为空，请稍后重试";
  if (type === MenuType.CONFIRM_RECEIPT) {
    // 请买家确认收货
    handleConfirmReceipt();
  } else if (type === MenuType.REDIRECT) {
    if (config?.params?.page) {
      uni.navigateTo({
        url: config?.params?.page,
      });
    } else {
      console.log("跳转链接为空");
    }
  } else if (type === MenuType.INQUIRY) {
    if (sendData?.body?.msg) {
      sendTextMsgActive(sendData?.body.msg, () => {
        const keyword = config?.keyword;
        sendTeamQuickInquiry(keyword);
      });
    } else {
      uni.$main.toast(errorMsg);
    }
  } else if (type === MenuType.NONE) {
    // 不执行操作
  } else if (type === MenuType.PAT) {
    if (sendData?.type == 100) {
      if (sendData?.body?.msg) {
        handleSendUrgent(sendData?.body?.msg);
      } else {
        uni.$main.toast(errorMsg);
      }
    }
  }
};

// 一级菜单点击发送
const handleMenu = (item, index) => {
  const isHasSubMenu = item.submenu && item.submenu.length > 0;
  if (isHasSubMenu) {
    showSubMenu[item.title] = !showSubMenu[item.title];
  } else {
    showSubMenu[item.title] = false;
  }
  if (showSubMenu[item.title]) {
    emit("show");
  }
  handleSendMsgType(item);
  nextTick(() => {
    if (isHasSubMenu) {
      setButtonGroupsStyle(index);
    }
  });
};

// 二级菜单点击发送
const handleSubMenu = throttle((item, parentTitle: string) => {
  showSubMenu[parentTitle] = false;
  handleSendMsgType(item);
}, 300);

const hiddenSubMenu = () => {
  for (const key in showSubMenu) {
    showSubMenu[key] = false;
  }
};

onMounted(() => {
  uni.$on(commonEvent.GLOBAL_VIEW, hiddenSubMenu);
  //
});

onUnmounted(() => {
  hiddenSubMenu();
  uni.$off(commonEvent.GLOBAL_VIEW, hiddenSubMenu);
});
</script>

<style lang="scss" scoped>
.msg-action-group {
  margin: 30rpx 20rpx 0rpx 20rpx;
  @include flex;

  .card {
    @include flex;
    justify-content: center;
    align-items: center;
    padding: 0 24rpx;
    height: 60rpx;
    background: #ffffff;
    border-radius: 40rpx;
    position: relative;
    margin-right: 24rpx;

    .text {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .triangle {
      margin-left: 6rpx;
      width: 24rpx;
      height: 24rpx;
    }
    .t-open {
      transform: rotate(180deg);
    }

    .service-options-box {
      position: fixed;
      bottom: 230rpx;
      z-index: 1;
      background-color: #ffffff;
      padding: 24rpx 0 24rpx 32rpx;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
      border-radius: 8rpx;
      width: 145rpx;
      @include flex;
      flex-direction: column;
      align-items: flex-start;

      .cell {
        padding: 10rpx 0;
        .text {
          font-size: 28rpx;
          color: #1a1a1a;
          font-weight: 400;
        }
      }
    }
  }
}
</style>
