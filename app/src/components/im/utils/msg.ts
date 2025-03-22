// import { IMMessage } from "@xkit-yx/im-store";
import { t } from "./i18n";
import { TMsgScene } from "nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface";
import { events } from "@/components/im/utils/constants";
1;

const translate = (key: string): string => {
  const text =
    {
      textMsgText: t("textMsgText"),
      customMsgText: t("customMsgText"),
      audioMsgText: t("audioMsgText"),
      videoMsgText: t("videoMsgText"),
      fileMsgText: t("fileMsgText"),
      callMsgText: t("callMsgText"),
      geoMsgText: t("geoMsgText"),
      imgMsgText: t("imgMsgText"),
      notiMsgText: t("notiMsgText"),
      robotMsgText: t("robotMsgText"),
      tipMsgText: t("tipMsgText"),
      unknowMsgText: t("unknowMsgText"),
    }[key] || "";
  return `[${text}]`;
};

export const getMsgContentTipByType = (msg): string => {
  const { type, body } = msg;
  switch (type) {
    case "text":
      return (
        body.replace(/<[^>]*>/g, "").replace(/\s+/g, "") ||
        translate("textMsgText")
      );
    case "file":
      return translate("fileMsgText");
    case "image":
      return translate("imgMsgText");
    case "custom":
      return body || translate("customMsgText");
    case "audio":
      return translate("audioMsgText");
    case "g2":
      return translate("callMsgText");
    case "geo":
      return translate("geoMsgText");
    case "notification":
      return translate("notiMsgText");
    case "robot":
      return translate("robotMsgText");
    case "tip":
      return body || translate("tipMsgText");
    case "video":
      return translate("videoMsgText");
    default:
      return translate("unknowMsgText");
  }
};

// 联系人tab
export const setContactTabUnread = (): void => {
  const unread = uni.$UIKitStore?.sysMsgStore?.unreadSysMsgCount;
  if (unread === 0) {
    uni.hideTabBarRedDot({
      //隐藏数字
      index: 1, //tabbar下标
    });
  } else {
    uni.showTabBarRedDot({
      index: 1, //tabbar下标
    });
  }
};

export const parseSessionId = (
  sessionId: string
): { scene: TMsgScene; to: string } => {
  if (sessionId) {
    const [scene, ...to] = sessionId.split("-");
    return {
      scene: scene as TMsgScene,
      // 这样处理是为了防止有些用户 accid 中自带 -
      to: to.join("-"),
    };
  } else {
    return {
      scene: "",
      // 这样处理是为了防止有些用户 accid 中自带 -
      to: "",
    };
  }
};

export const emitMsgListLayoutEvent = () => {
  uni.$emit(events.LAYOUT_MSG_LIST);
};
export const onMsgListLayoutEvent = (page, msgListNode) => {
  uni.$on(events.LAYOUT_MSG_LIST, () => {
    const query = uni.createSelectorQuery().in(page);
    query.select("#yxMsgInput").boundingClientRect((data) => {
      if (msgListNode.value && data?.height) {
        // msgListNode.value.style.height='calc(100vh - 150px)'
      }
    });
    query.exec();
  });
};

export const getParams = (url) => {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = {};
  let match;
  while ((match = regex.exec(url))) {
    params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }
  return params;
};
