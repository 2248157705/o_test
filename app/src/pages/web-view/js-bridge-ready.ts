import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { toLogin, routerPush } from "@/utils/login";

export enum JSBridgeAction {
  USER_INFO = "USER_INFO", // 获取用户信息
  LOGIN = "LOGIN", // 登录
  NAVIGATE_TO = "NAVIGATE_TO", // 跳转到指定页面
  CUSTOM = "CUSTOM", // 自定义事件
  NAVIGATE_BACk = "NAVIGATE_BACk", // 返回
}

export const EVENT_KEY = "JSBridgeReady";

export function JSBridgeReady() {
  const userStore = useUserStore();
  const webviewRef = ref();
  const messageList = ref([]);

  // webview接收消息
  const onPostMessage = (e) => {
    console.log("onPostMessage", e);
    if (e.detail && e.detail.data && e.detail.data.length > 0) {
      const { action, payload } = e.detail.data[0];
      switch (action) {
        case JSBridgeAction.USER_INFO:
          evalJs({
            action: JSBridgeAction.USER_INFO,
            payload: userStore.userInfo,
          });
          messageList.value.push(e);
          break;
        case JSBridgeAction.LOGIN:
          toLogin();
          break;
        case JSBridgeAction.NAVIGATE_TO:
          if (payload.url) {
            routerPush(payload.url);
          } else {
            console.log("url is null");
          }
          break;
        case JSBridgeAction.NAVIGATE_BACk:
          uni.navigateBack();
          break;
        case JSBridgeAction.CUSTOM:
          // emit("change", payload);
          break;
      }

      // 触发事件
      uni.$emit(EVENT_KEY, { action, payload });
    }
  };
  // 传递消息给webview
  const evalJs = (payload: any) => {
    // console.log("currentWebview", webviewRef.value, payload);
    if (webviewRef.value) {
      webviewRef.value.evalJs(
        `window.postMessage(${JSON.stringify(payload)}, '*');`
      );
    } else {
      console.log("currentWebview is null");
    }
  };

  // 监听事件
  const onEvent = () => {
    uni.$on(EVENT_KEY, (event) => {
      console.log("uni.on event", event);
    });
  };

  // 取消监听事件
  const offEvent = () => {
    uni.$off(EVENT_KEY);
  };

  return {
    webviewRef,
    messageList,
    onPostMessage,
    evalJs,
    onEvent,
    offEvent,
  };
}
