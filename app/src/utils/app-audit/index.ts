import { ChannelType, ConifgCode } from "@/enums/common";
import { useReportStore } from "@/stores/report/";
import { useUserStore } from "@/stores/user/";
import { getConfigByCodes } from "@/api/order";
import { Appstore_Audit } from "./appstore";
import { Taotiao_Audit } from "./taotiao";
import { Android_Audit } from "./android";

export enum PlatformLoginPages {
  "APPSTORE" = "/pages/audit/appstore/login",
  "MP_TOUTIAO" = "/pages/audit/taotiao/login",
  "DEFAULT" = "/pages/login/index",
}

/**
 * 监听tabbar mid 按钮事件
 */
export function onTabBarMidButton() {
  uni.onTabBarMidButtonTap(() => {
    uni.switchTab({
      url: "/pages/sell-account/index",
    });
  });
}

export function clearTabBarMidButton() {
  uni.onTabBarMidButtonTap(() => {
    //
  });
}

/**
 * 判断是否开启提审
 */
export const getAppAuditConfig = async () => {
  const reportStore = useReportStore();
  const { p_channel } = reportStore.userData;
  const { release } = reportStore.deviceInfo;
  const res = await getConfigByCodes([ConifgCode.APP_AUDIT_V2]).catch((err) => {
    console.log("getConfigByCodes error", err);
    if (p_channel === ChannelType.APPSTORE) {
      checkAppstoreAuditStatus({
        channel: p_channel,
        version: release,
      });
    } else if (p_channel === ChannelType.MP_TOUTIAO) {
      checkTaotiaoAuditStatus({
        channel: p_channel,
        version: release,
      });
    } else {
      checkAuditStatus();
    }
  });

  if (res && res[ConifgCode.APP_AUDIT_V2]) {
    const data = res[ConifgCode.APP_AUDIT_V2].methods.find((el) => {
      return (
        el.version === release && el.channelType === p_channel && el.status
      );
    });

    if (data) {
      if (p_channel === ChannelType.APPSTORE) {
        checkAppstoreAuditStatus(data);
      } else if (p_channel === ChannelType.MP_TOUTIAO) {
        checkTaotiaoAuditStatus(data);
      } else {
        checkAuditStatus(data);
      }
    } else {
      checkAuditStatus();
    }
  }
};

/**
 * 检查appstore审核状态
 */
export const checkAppstoreAuditStatus = (data) => {
  const userStore = useUserStore();
  userStore.setAppAuditInfo({
    channel: data.channelType,
    version: data.version,
    status: true,
  });
  Appstore_Audit();
  clearTabBarMidButton();
};

/**
 * 检查taotiao审核状态
 */
export const checkTaotiaoAuditStatus = (data) => {
  const userStore = useUserStore();
  userStore.setAppAuditInfo({
    channel: data.channelType,
    version: data.version,
    status: true,
  });
  Taotiao_Audit();
  clearTabBarMidButton();
};

/**
 * 检查android审核状态
 */
export const checkAuditStatus = () => {
  const userStore = useUserStore();
  userStore.setAppAuditInfo({
    channel: "",
    version: "",
    status: null,
  });
  Android_Audit();
  onTabBarMidButton();
};

/**
 * 返回当前审核状态
 */
export const isAppAudit = () => {
  const userStore = useUserStore();
  const appAuditInfo = userStore.appAuditInfo;
  return !!(
    appAuditInfo &&
    appAuditInfo.channel &&
    appAuditInfo.version &&
    appAuditInfo.status
  );
};
