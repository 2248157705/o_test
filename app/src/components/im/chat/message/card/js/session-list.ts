import type { IMMessage } from "@xkit-yx/im-store";
import type { NimKitCoreTypes } from "@xkit-yx/core-kit";
import { reactive, computed } from "vue";
import { useMessageStore } from "@/stores/message";
import { getServerExt } from "@/components/im/conversation-list";
import { toLogin, checkIsLogin } from "@/utils/login";
import { emptyList } from "@/components/im/utils/emptyData";
import { interceptorMedia, isJsonString } from "./nim";

export function SessionListUitl() {
  const messageStore = useMessageStore();
  const serviceSessionRes = messageStore.serviceSessionRes;

  const sessionState = reactive({
    loading: false,
  });

  // 默认会话列表
  const defaultSessionList = computed(() => {
    return emptyList.map((item) => {
      if (item.id === "customer_service") {
        item.to = messageStore.selfConsultationTid;
        item.teamId = messageStore.selfConsultationTid;
        return item;
      } else {
        return item;
      }
    });
  });

  // 是否登录
  const isLogin = computed(() => {
    return checkIsLogin();
    // return checkIsLogin() && messageStore.isConected === ConectedStatus.YES;
  });

  // 最大时间戳
  const maxTimestamp = computed(() => {
    const sessionList = messageStore.serviceSessionRes.sessionList;
    if (sessionList.length === 0) {
      return null;
    } else {
      const lastSession = sessionList[sessionList.length - 1];
      return (
        lastSession?.time ||
        lastSession?.updateTime ||
        lastSession?.userUpdateTime ||
        lastSession?.createTime ||
        null
      );
    }
  });

  const needShowBeMentioned = (msgs: IMMessage[]) => {
    let flag = false;
    // 遍历未读消息，判断是否被@
    msgs.forEach((msg) => {
      if (msg?.ext) {
        try {
          const extObj = JSON.parse(msg.ext);
          const yxAitMsg = extObj.yxAitMsg;
          const account = uni.$UIKitStore?.userStore?.myUserInfo?.account;
          if (yxAitMsg) {
            Object.keys(yxAitMsg).forEach((key) => {
              if (key === account || key === AT_ALL_ACCOUNT) {
                flag = true;
              }
            });
          }
        } catch (e) {
          console.log("needShowBeMentioned error", e);
        }
      }
    });
    return flag;
  };

  // 会话列表
  const querySessionList = () => {
    // 未登录，跳转登录页
    if (!isLogin.value) {
      console.log("querySessionList", isLogin.value);
      return toLogin();
    }
    const sessionList = uni.$UIKitStore?.uiStore?.sessionList.map(
      (session: NimKitCoreTypes.ISession, index: string) => {
        return {
          ...session,
          sessionId: session.id,
          renderKey: session.id + index,
          beMentioned: needShowBeMentioned(session.unreadMsgs || []),
        };
      }
    );

    console.log("querySessionList", sessionList);
    console.log("querySessionList length", sessionList.length);

    if (sessionList && sessionList.length > 0) {
      // 客服会话列表中是否已经存在
      const csIndex = sessionList.findIndex((s) => {
        const { team } = getServerExt(s?.serverExt);
        return s?.id === "customer_service" && team?.type == GroupType.CONSULT;
      });

      defaultSessionList.value.forEach((item) => {
        // 会话列表中是否已经存在
        const index = sessionList.findIndex((s) => s?.to === item.to);
        if (index === -1) {
          let toAppend = true;
          // 如果客服会话列表中已经存在，不再添加
          if (csIndex !== -1) {
            toAppend = false;
          }
          //修复注册首次打开会话BUG
          if (toAppend && item.id !== "customer_service") {
            sessionList.push(item);
          }
        }
      });
      messageStore.setServiceSessionRes(sessionList);
    } else {
      if (serviceSessionRes.sessionList.length === 0) {
        messageStore.setServiceSessionRes(defaultSessionList.value);
      }
    }
  };

  // 云端会话列表
  const queryCloudSessionList = () => {
    // 未登录，跳转登录页
    if (!isLogin.value) {
      return toLogin();
    }

    if (sessionState.loading) {
      console.log("云端会话列表加载中 ");
      return;
    }
    if (!maxTimestamp.value) {
      console.log("云端会话列表没有更多了");
      return;
    }

    console.log("maxTimestamp.value", maxTimestamp.value);
    sessionState.loading = true;
    uni.$UIKitNIM?.nim.cloudSession
      .queryCloudSessionList({
        includedLastMsg: true,
        limit: 20,
        maxTimestamp: maxTimestamp.value,
      })
      .then((res) => {
        console.log("getSessionList 刷新成功", res);
        if (res && res.sessionList) {
          const new_session_list = res.sessionList.map((item) => {
            return {
              id: item.sessionId,
              sessionId: item.sessionId,
              unread: 0,
              lastMsg: item.lastMsgInfo.lastMsg,
              ...item.lastMsgInfo.lastMsg,
            };
          });
          uni.$UIKitStore?.sessionStore.addSession(new_session_list);
          querySessionList();
        }
      })
      .catch((e) => {
        console.log("getSessionList 刷新失败", e);
      })
      .finally(() => {
        sessionState.loading = false;
      });
  };

  // 搜索会话列表
  const searchSessionList = (keyword: string) => {
    // 未登录，跳转登录页
    if (!isLogin.value) {
      return toLogin();
    }

    if (keyword) {
      const { sessionList } = messageStore.serviceSessionRes;
      const new_session_list = sessionList.filter((el) => {
        if (el.serverExt && isJsonString(el.serverExt)) {
          const serverExt = JSON.parse(el.serverExt);
          return serverExt?.team?.name?.includes(keyword);
        } else {
          return false;
        }
      });
      messageStore.setServiceSessionRes(new_session_list);
    } else {
      // messageStore.resetServiceSessionRes();
      querySessionList();
    }
  };

  // 初始化会话列表
  if (serviceSessionRes.sessionList.length === 0) {
    messageStore.setServiceSessionRes(defaultSessionList.value);
  }

  // 选择图片、视频、文件、媒体拦截器
  interceptorMedia();

  return {
    isLogin,
    sessionState,
    defaultSessionList,
    searchSessionList,
    querySessionList,
    queryCloudSessionList,
  };
}
