import RootStore from "@xkit-yx/im-store";
import { NimKitCore } from "@xkit-yx/core-kit/dist/uniapp-nim-core";
// import { getMsgContentTipByType } from "@/components/im/utils/msg";
import { getLoginCredential } from "@/api/chat";
import { useMessageStore, ConectedStatus } from "@/stores/message";
import { useTabBarStore } from "@/stores/tabBar";
import { useUserStore } from "@/stores/user";
import { useReportStore } from "@/stores/report";
import { getSessionLastMsg } from "@/components/im/conversation-list/index";
import { getTeamQuickInquiryMenu, getMessageCardFieldLabel } from "@/api/chat";
import { watch, computed } from "vue";
import { toLogin, getCurPageData } from "@/utils/login";
import {
  addListenEvent,
  ReportStatus,
  Events,
  report,
} from "@/utils/report/module/im";
import { debounce } from "lodash-es";
import { MsgTemplate } from "@/components/im/utils/enums";
import { SessionListUitl } from "@/components/im/chat/message/card/js/session-list";
import { checkLoginCredentialValid } from "@/components/im/chat/message/card/js/nim";

// #ifdef APP-PLUS
import { initNimPush } from "@/utils/nim-push/min-push";
// #endif

let lastMsgs = {};

const isConected = computed(() => {
  const messageStore = useMessageStore();
  return messageStore.isConected === ConectedStatus.YES;
});

// 监听用户是否登录app后登录IM
export const listeningIMLogin = () => {
  const userStore = useUserStore();
  watch(
    () => userStore.userInfo?.token,
    async (val) => {
      if (val) {
        loginIM();
      }
    },
    {
      immediate: true,
      deep: true,
      flush: "post",
    }
  );
};

// 登录IM
export const loginIM = async () => {
  const messageStore = useMessageStore();
  const userStore = useUserStore();
  const reportStore = useReportStore();

  try {
    let loginCredential = messageStore.loginCredential;

    if (!userStore.userInfo?.token) {
      // toLogin();
      return;
    }
    // #ifdef H5
    if (uni.JSBridge?.isNvue) {
      console.log("uniapp nvue环境下不允许执行");
      return;
    }

    if (!navigator || !navigator.onLine) {
      console.log("IM登录：网络已断开");
      return;
    }
    // #endif

    // console.log("检查准备连接登录前状态:", isConected.value);
    // console.log("检查loginCredential准备连接登录前状态:", loginCredential);
    // 如果IM已经完成连接，说明此时⼀定已经登录，直接return即可
    if (isConected.value) {
      console.log("IM已经登录");
      return;
    }

    uni.$main.showLoading({
      title: "加载中...",
      mask: true,
    });

    if (!checkLoginCredentialValid(loginCredential)) {
      const res = await getLoginCredential({});
      if (res && res.accid) {
        res.time = new Date().getTime();
        loginCredential = res;
      }
    }

    // 先销毁，后重新登录
    uni.$UIKitNIM?.destroy();
    uni.$UIKitNIM?.disconnect();
    uni.$UIKitStore?.destroy();

    report(Events.IM_INIT);

    // uni.log.info("IM登录账号信息=>", loginCredential);
    const { app_key, accid, token } = loginCredential || {};
    uni.$UIKitNIM = new NimKitCore({
      initOptions: {
        appkey: app_key, // 请填写你的appkey
        account: accid, // 请填写你的account
        token: token, // 请填写你的token
        lbsUrls: ["https://lbs.netease.im/lbs/webconf.jsp"],
        linkUrl: "weblink.netease.im",
        needReconnect: true,
        authType: 1,
        /**
         * 使用固定设备ID，
         */
        isFixedDeviceId: true,
        // reconnectionAttempts: 3, // 默认情况会一直重连。设置次数，断网重连会有问题
        debugLevel: "off", // debug，off
      },
      platform: "UniApp",
    });

    addListenEvent(uni.$UIKitNIM);

    uni.$UIKitStore = new RootStore(uni.$UIKitNIM, {
      addFriendNeedVerify: false,
      teamBeInviteMode: "noVerify",
      teamJoinMode: "noVerify",
      teamUpdateExtMode: "all",
      teamUpdateTeamMode: "all",
      teamInviteMode: "all",
      // 新拉的群聊未读数不显示，
      // 解决方法：更新版本@xkit-xy/im-store:0.4.3
      // teamCreatedSelect：false 解决该问题
      teamCreatedSelect: false,
      sendMsgBefore: (options) => {
        const env = import.meta.env.VITE_APP_ENV;
        uni.log.warn("当前IM环境变量=>", env);
        console.log("options", options);

        const ext = JSON.parse(options.ext || "{}");
        ext.env = env;
        return {
          ...options,
          setting: {
            envConfig: env,
          },
          needPush: false,
          isPushable: false,
          ext: JSON.stringify(ext),
        };
      },
    });
    report(Events.IM_INIT_STATUS, {
      status: ReportStatus.SUCCESS,
    });
    reportStore.setIMLaunchTime({
      init_success: new Date().getTime(),
    });
    getMessageCardFieldLabel().then((res) => {
      messageStore.setMessageCardFieldLabel(res?.list || []);
    });
    // #ifdef APP-PLUS
    initNimPush(uni.$UIKitNIM);
    // #endif
    listeningEvents();
    connectIM({
      loginCredential,
    });
  } catch (error) {
    uni.log.warn("IM SDK初始化失败=>", error);

    report(Events.IM_INIT_STATUS, {
      status: ReportStatus.FAILED,
      errMsg: error,
    });
  } finally {
    uni.$main.hideLoading();
  }
};

// 连接IM
export const connectIM = ({ loginCredential }) => {
  const messageStore = useMessageStore();
  uni.$UIKitNIM
    .connect()
    .then(() => {
      messageStore.setLoginCredential(loginCredential);
      // im快捷菜单
      getTeamQuickInquiryMenu().then((res) => {
        messageStore.setTeamQuickInquiryMenu(res || null);
      });
      uni.log.info("IM登录成功");
    })
    .catch((err) => {
      uni.log.warn("IM登录失败=>", err);
      report(Events.IM_LOGIN_STATUS, {
        status: ReportStatus.FAILED,
        errMsg: err,
      });
      // 登录失败，移除登录账号凭证
      messageStore.setLoginCredential(null);
    });
};

// 会话更新的事件
export const onUpdateSession = (session) => {
  const messageStore = useMessageStore();
  const lastMsg = session?.lastMsg;
  console.log("lastMsg", lastMsg);
  if (
    lastMsg &&
    lastMsg.attach?.type === "updateTeam" &&
    lastMsg.type === "notification"
  ) {
    uni.log.warn("IM更新群非通知消息显示=>", lastMsg);
    // 获取历史消息接口有频率限制,单个账号1分钟60次
    uni.$UIKitStore.msgStore
      .getHistoryMsgActive({
        sessionId: session.id,
        limit: 40,
        endTime: new Date().getTime(),
      })
      .then((msgs) => {
        report(Events.IM_TEAMS_HISTORY_MSG_STATUS, {
          status: ReportStatus.SUCCESS,
        });
        const itemMsg = getSessionLastMsg(msgs);
        lastMsgs[session.id] = itemMsg;
        messageStore.setLastMsgs(lastMsgs);
      })
      .catch((err) => {
        report(Events.IM_TEAMS_HISTORY_MSG_STATUS, {
          status: ReportStatus.FAILED,
          errMsg: err,
        });
        console.error("获取群历史消息异常=>", err);
      });
  } else {
    lastMsgs[session.id] = lastMsg;
    console.log(" lastMsgs[session.id]", lastMsgs);
    messageStore.setLastMsgs(lastMsgs);
  }
  console.log("messageStore.lastMsgs====>", messageStore.lastMsgs);
};

// IM断开连接
// 状态码 https://doc.yunxin.163.com/messaging/client-apis/jk4ODM4NjU?platform=uniapp
export const onDisconnect = (e: any) => {
  const messageStore = useMessageStore();
  messageStore.setIsConected(ConectedStatus.NO);
  uni.log.warn("IM连接断开=>", e);
};

const selectSessionByChatIndex = () => {
  const page = getCurPageData();
  if (page && page?.route === "components/im/chat/index") {
    const sessionId = page?.$page?.options?.sessionId;
    if (sessionId) {
      uni.$UIKitStore.uiStore.selectSession(sessionId);
    }
    // refreshCurPage();
  }
};

// 获取消息未读数
const getMessageUnread = debounce(() => {
  const tabBarStore = useTabBarStore();
  tabBarStore.getMessageUnread();
}, 1500);

// 获取会话列表
const getList = debounce(() => {
  const { querySessionList } = SessionListUitl();
  querySessionList();
}, 500);

// IM监听事件处理
export const listeningEvents = () => {
  if (uni.$UIKitNIM) {
    const messageStore = useMessageStore();
    const userStore = useUserStore();
    const { querySessionList } = SessionListUitl();
    const nim = uni.$UIKitNIM;
    lastMsgs = messageStore.lastMsg || {};

    nim.on("logined", () => {
      // uni.log.warn("IM连接成功=>", e);
      uni.$u.sleep(300).then(() => {
        querySessionList();
        messageStore.setIsConected(ConectedStatus.YES);
        getMessageUnread();
        selectSessionByChatIndex();
      });
    });

    nim.on("syncRoamingMsgs", (session: any) => {
      const itemMsg = getSessionLastMsg(session.msgs);
      lastMsgs[session.sessionId] = itemMsg;
      messageStore.setLastMsgs(lastMsgs);
    });

    nim.on("updateSession", onUpdateSession);

    nim.on("msg", (e) => {
      console.log("msg---", e);
      getList();
      markBargainMsg(e);
      getMessageUnread();
    });

    // 连接断开
    nim.on("disconnect", onDisconnect);
    // 开始自动重连
    nim.on("willReconnect", (e: any) => {
      uni.log.warn("IM开始自动重连=>", e, isConected.value);
      messageStore.setIsConected(ConectedStatus.NO);
    });

    // 被踢下线
    nim.on("kicked", (e: any) => {
      uni.log.warn("IM被踢下线=>", e);
      userStore.logOut();
      uni.$main.toast("你的账号已在其他设备登录，请重新登录");
      toLogin("/pages/my/index");
    });

    // 多端登录通知
    nim.on("multiPortLogin", (e: any) => {
      uni.log.warn("IM多端登录通知=>", e);
    });

    nim.on("syncdone", () => {
      //
    });
  }
};

// 获取im连接状态
export const getConnectState = (maxAttempts: number = 5): Promise<string> => {
  return new Promise((resolve) => {
    let currentAttempt: number = 0;
    let state: string = uni.$UIKitStore?.connectStore?.connectState;

    const checkConnection = () => {
      state = uni.$UIKitStore?.connectStore?.connectState;

      if (state === "connected") {
        console.log("IM连接成功");
        resolve(state);
      } else {
        currentAttempt++;

        if (currentAttempt >= maxAttempts) {
          console.log("达到最大尝试次数，结束轮询");
          resolve("fail");
        } else {
          console.log("IM连接中...");
          setTimeout(checkConnection, 1000);
        }
      }
    };
    checkConnection();
  });
};

const markBargainMsg = debounce((msg) => {
  const template = msg.attach?.option?.template;
  // const { content } = msg.attach?.option || {};
  if (
    template === MsgTemplate.PRODUCT_COUNTER_OFFER ||
    template === MsgTemplate.PRODUCT_COUNTER_OFFER_ACCEPTED ||
    template === MsgTemplate.PRODUCT_COUNTER_OFFER_REJECTED ||
    template === MsgTemplate.PRODUCT_PRICE_REDUCE_ACCEPTED
  ) {
    const userStore = useUserStore();
    userStore.getMyInfoV2({ order_unread_resp: true });
  }
}, 800);
