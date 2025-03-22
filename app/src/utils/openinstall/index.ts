import {
  init,
  getInstall,
  registerWakeUp,
} from "@/utils/openinstall/openinstall";
import { getCurPage, checkIsBarPage } from "@/utils/login";
import storage, { cacheKeyEnums } from "@/utils/storage/";
import { systemInfo } from "@/utils/index";
import { useReportStore } from "@/stores/report/index";
import { useUserStore } from "@/stores/user/index";

interface InstallInfoProps {
  campaign_id?: string; // 推广ID
  campaign_extra?: string;
}

interface CampaignExtraProps {
  path?: string; // 推广指定app地址
  apk?: string; // 推广指定apk地址
  h5_device_id?: string; // h5页设备id
  [key: string]: any;
}

// let prevPage = null;

/**
 * 初始化
 * @returns
 */
export const initOpenInstall = async () => {
  init();

  const app_version = storage.get(cacheKeyEnums.APP_VERSION) || null;
  console.log("initOpenInstall app_version----", app_version);

  // 判断是否首次打开app
  if (!app_version || app_version !== systemInfo.appWgtVersion) {
    storage.set(cacheKeyEnums.APP_VERSION, systemInfo.appWgtVersion);
    const installData = await getInstall(8);
    uni.log.info("initOpenInstall installData----", installData);
    handleOpenInstallParams(installData);
  }
  registerWakeUp((res) => {
    uni.log.info("initOpenInstall registerWakeUp----", res);
    handleOpenInstallParams(res);
  });
};

/**
 * 处理openinstall参数
 * @param installData
 * @returns
 */
const handleOpenInstallParams = (installData) => {
  const reportStore = useReportStore();
  const userStore = useUserStore();

  if (installData?.bindData) {
    const installInfo: InstallInfoProps = JSON.parse(installData?.bindData);
    uni.log.info("initOpenInstall installInfo", installInfo);
    if (installInfo) {
      const campaign_id = installInfo?.campaign_id;
      const campaign_extra: CampaignExtraProps = installInfo?.campaign_extra
        ? JSON.parse(decodeURIComponent(installInfo?.campaign_extra))
        : {};

      if (campaign_id) {
        reportStore.setUserData({
          campaign_id: campaign_id,
          campaign_extra: campaign_extra,
        });
        reportStore.setDeviceInfo({
          campaign_id: campaign_id,
          campaign_extra: campaign_extra,
          h5_device_id: campaign_extra?.h5_device_id,
        });
      }
      uni.log.info("initOpenInstall appAuditInfo", userStore.appAuditInfo);
      if (
        userStore.appAuditInfo.channel &&
        userStore.appAuditInfo.status &&
        userStore.appAuditInfo.version
      ) {
        //
      } else {
        if (campaign_extra.path) {
          handleOpenInstallPath(campaign_extra.path);
        }
      }
    }
  }
};

/**
 * 指定跳转页面
 * @param path
 * @returns
 */
export const handleOpenInstallPath = (path: string) => {
  if (path) {
    path = "/" + path;
    const curPath = getCurPage();
    const pid = path.split("?")[0];
    const flag = checkIsBarPage(pid);

    uni.log.info("handleOpenInstallPath", path, pid, curPath, flag);

    if (curPath === path) {
      return;
    }

    // prevPage = path;

    const fail = () => {
      uni.log.info(`scheme page ${path} navigate failed`);
    };

    const success = () => {};

    uni.$u.sleep(300).then(() => {
      if (flag) {
        uni.switchTab({
          url: path,
          success,
          fail,
        });
      } else {
        uni.navigateTo({
          url: path,
          success,
          fail,
        });
      }
    });
  }
};
