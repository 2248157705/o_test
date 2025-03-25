import { EventTracking } from "@xkit-yx/utils/dist/uniapp";

export const trackInit = (
  component: "ChatUIKit" | "ContactUIKit" | "ConversationUIKit" | "SearchUIKit"
): void => {
  if (uni.$UIKitNIM?.initOptions?.appkey) {
    const eventTracking = new EventTracking({
      appKey: uni.$UIKitNIM?.initOptions?.appkey,
      version: "1.4.0",
      component,

      imVersion: uni.$UIKitNIM.version,
      platform: "Dcloud",
    });
    eventTracking.track("init", "");
  }
};
