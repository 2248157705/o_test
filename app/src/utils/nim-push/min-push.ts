import { isHonor } from "./mobile";
import { nimPushCfg } from "@/config/nim-push";

export interface SendTextMsgProps {
  scene: string;
  to: string;
  body: string;
  pushInfo: {
    [key: string]: any;
  };
  //   pushInfo: {
  //     needPush: boolean;
  //     pushContent: string;
  //   };
}

export interface SendCustomSysMsgProps {
  type: string;
  to: string;
  attach: string;
}

const nimPushPlugin = uni.requireNativePlugin("NIMUniPlugin-PluginModule");

/**
 * 初始化
 */
export function initNimPush(nim) {
  // 荣耀手机不开启push
  if (isHonor()) {
    return;
  }
  const app = getApp();
  app.globalData.nim = nim;

  const nimInstance = nim.getNIM();

  nimInstance.offlinePush.setOfflinePushConfig({
    plugin: nimPushPlugin,
    authConfig: nimPushCfg,
  });
}

/**
 * 关闭离线推送
 */
export function closeNimPush() {
  const app = getApp();
  if (app && app.globalData && app.globalData.nim) {
    const nimInstance = app.globalData.nim.getNIM();
    nimInstance &&
      nimInstance?.offlinePush?.updateAppBackground({
        isBackground: false,
      });
  }
}

/**
 * 开启离线推送
 */
export function openNimPush() {
  const app = getApp();
  // 开了消息通知推送，才允许开启离线通知
  if (app && app.globalData && app.globalData.nim) {
    const nimInstance = app.globalData.nim.getNIM();
    nimInstance &&
      nimInstance?.offlinePush?.updateAppBackground({
        isBackground: true,
      });
  }
}

/**
 * 发送信息
 * @param opts SendTextMsgProps
 */
export async function sendTextMsg(opts: SendTextMsgProps) {
  uni.log.info("sendTextMsg++++++", opts);
  const app = getApp();
  if (app && app.globalData && app.globalData.nim) {
    const nimInstance = app.globalData.nim.getNIM();
    await nimInstance.msg.sendTextMsg(opts);
  }
}

/**
 * 发送系统消息
 * @param opts SendTextMsgProps
 */
export async function sendCustomSysMsg(opts: SendCustomSysMsgProps) {
  uni.log.info("SendCustomSysMsgProps++++++", opts);
  const app = getApp();
  if (app && app.globalData && app.globalData.nim) {
    const nimInstance = app.globalData.nim.getNIM();
    await nimInstance.systemMessage.sendCustomSysMsg(opts);
  }
}

/**
 * 发送信息
 * @param opts SendTextMsgProps
 */
export async function sendTextMsgActive(opts: SendTextMsgProps) {
  uni.log.info("sendTextMsgActive++++++", opts);
  if (uni.$UIKitStore && uni.$UIKitStore.msgStore && app.globalData.nim) {
    uni.$UIKitStore.msgStore.sendTextMsgActive(opts);
  }
}
