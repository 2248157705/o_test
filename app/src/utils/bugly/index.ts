import { getDeviceInfo } from "@/utils/report/utils";
import { useUserStore } from "@/stores/user";
import { watch } from "vue";
// import { isDev } from "@/utils/config";
import { init, updateUserId, postException } from "./bugly";

export async function initBugly() {
  const deviceInfo = await getDeviceInfo();
  const userStore = useUserStore();
  const opts = {
    appID: import.meta.env.VITE_APP_BUGLY_APPID,
    appKey: import.meta.env.VITE_APP_BUGLY_APPKEY,
    uniqueId: deviceInfo.device_id,
    userId: userStore.userInfo?.uid,
    deviceModel: deviceInfo.phone_model,
    appVersion: deviceInfo.release,
    buildNumber: "" + deviceInfo.version_code,
    appChannel: deviceInfo.channel,
    enableAllThreadStackCrash: true,
    enableAllThreadStackAnr: true,
    enableCrashProtect: true,
    debugMode: true,
  };
  uni.log.info("bugly init------>", opts);
  init(opts, (res) => {
    uni.log.info("initBugly res", res);
  });

  // 监听用户登录状态，更新bugly userId
  watch(
    () => userStore.userInfo,
    (values) => {
      setUserId(values?.uid);
    },
    {
      deep: true,
    }
  );
}

export function setUserId(userId: string) {
  updateUserId(
    {
      userId: userId ? "" + userId : "-1",
    },
    (res) => {
      uni.log.info("setUserId res", res);
    }
  );
}

export function reportError(opts) {
  uni.log.info("reportError------>", opts);
  postException(opts, (res) => {
    uni.log.info("reportError res", res);
  });
}
