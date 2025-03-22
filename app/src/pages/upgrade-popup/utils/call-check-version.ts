import { fetchUpgradeInfo } from "@/api/common";
import { useReportStore } from "@/stores/report/";
import { checkFileExists } from "@/utils/";

export type StoreListItem = {
  enable: boolean;
  id: string;
  name: string;
  scheme: string;
  priority: number; // 优先级
};

export type UniUpgradeCenterResult = {
  title: string; // 标题
  contents: string; // 升级内容
  url: string; // 安装包下载地址
  platform: Array<string>; // Array<'Android' | 'iOS'>
  version: string; // 版本名称 1.0.0
  version_code: number; // 版本号 100
  is_mandatory: boolean; // 是否强制更新
  is_silently: boolean | null; // 是否静默更新
  type: string; // "native_app" | "wgt"
  store_list: StoreListItem[] | null;
  size: string; // 安装包大小
};

export default function (): Promise<UniUpgradeCenterResult> {
  return new Promise<UniUpgradeCenterResult>((resolve, reject) => {
    const systemInfo = uni.getSystemInfoSync();
    uni.log.info("systemInfo", systemInfo);
    const appId = systemInfo.appId;
    const appVersion = systemInfo.appVersion; //systemInfo.appVersion
    const reportStore = useReportStore();

    if (
      typeof appId === "string" &&
      typeof appVersion === "string" &&
      appId.length > 0 &&
      appVersion.length > 0
    ) {
      plus.runtime.getProperty(appId, async function (widgetInfo) {
        uni.log.info("plus.runtime.getProperty", widgetInfo);
        // widgetInfo.versionCode = widgetInfo.versionCode || 120;
        if (widgetInfo.versionCode && widgetInfo.appid) {
          const { campaign_id, p_channel, p_channel_id, p_campaign_id } =
            reportStore.userData;
          const res = await fetchUpgradeInfo({
            campaign_id: campaign_id || p_campaign_id,
            channel: p_channel,
            channel_id: p_channel_id,
            version_code: widgetInfo.versionCode,
            device_id: reportStore.deviceInfo.device_id,
          }).catch((err) => {
            uni.log.info("fetchUpgradeInfo err", err);
            reject("fetchUpgradeInfo err");
          });
          console.log("fetchUpgradeInfo", res);
          if (res && res.version_code) {
            const isWGT = res.type === "WGT";
            const is_mandatory = Boolean(res.force);
            let url = res.apk_url;
            let size = res.apk_size;

            // wgt 更新
            if (isWGT) {
              url = res.wgt_url;
              size = res.wgt_size;
              // is_mandatory = true;
            }

            const isExists = await checkFileExists(url).catch(() => {
              reject("file is not exists");
            });

            if (isExists) {
              resolve({
                title: res.title,
                platform: ["Android"],
                is_mandatory: is_mandatory, // 是否强制更新
                url: url, // 安装包下载地址
                contents: res.content,
                version: res.version_name, // 版本号 1.0.0
                version_code: res.version_code, // 版本号 100
                type: res.type,
                store_list: res.store_list,
                size: size,
              });
            } else {
              reject("file is not exists");
            }
          } else {
            resolve();
          }
          // resolve({
          //   title: "下载",
          //   platform: ["Android"],
          //   is_silently: false,
          //   is_mandatory: false,
          //   code: 1,
          //   url: "https://static-gamehub-client.sh28.vip/walle/ext/vip.taogehaotest.apk?comment=%7B%7D",
          //   contents: "下载4",
          //   version: "1.0.7",
          //   type: "APK",
          //   store_list: [
          //     {
          //       channel: "yyb",
          //       name: "应用",
          //       scheme: "123",
          //       priority: 1,
          //     },
          //   ],
          //   size: "3",
          //   min_uni_version: "1.0.7",
          // });
        } else {
          reject("widgetInfo.version is EMPTY");
        }
      });
    } else {
      reject("plus.runtime.appid is EMPTY");
    }
  });
}
