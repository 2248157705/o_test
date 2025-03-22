import callCheckVersion, { UniUpgradeCenterResult } from "./call-check-version";
import Events, { report, ReportStatus } from "@/utils/report/report";

// 推荐再App.vue中使用
const PACKAGE_INFO_KEY = "__package_info__";

export default function (): Promise<UniUpgradeCenterResult> {
  report(Events.APP_CHECK_UPDATE);
  return new Promise<UniUpgradeCenterResult>((resolve, reject) => {
    callCheckVersion()
      .then(async (uniUpgradeCenterResult) => {
        if (!uniUpgradeCenterResult || !uniUpgradeCenterResult.url) {
          return reject(uniUpgradeCenterResult);
        }

        const reportData = {
          url: uniUpgradeCenterResult.url,
          version: uniUpgradeCenterResult.version,
          version_code: uniUpgradeCenterResult.version_code,
          type: uniUpgradeCenterResult.type,
        };

        report(Events.APP_CHECK_UPDATE_STATUS, {
          data: reportData,
          status: ReportStatus.SUCCESS,
        });

        uni.log.info("uniUpgradeCenterResult", uniUpgradeCenterResult.url);

        uni.setStorageSync(PACKAGE_INFO_KEY, uniUpgradeCenterResult);
        uni.navigateTo({
          url: `/pages/upgrade-popup/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
          fail: (err) => {
            uni.log.info("更新弹框跳转失败", err);
            uni.removeStorageSync(PACKAGE_INFO_KEY);
          },
        });

        // 静默更新，只有wgt有
        // if (uniUpgradeCenterResult.type === "WGT") {
        //   uni.downloadFile({
        //     url: uniUpgradeCenterResult.url,
        //     success: (res) => {
        //       uni.log.info("uniUpgradeCenterResult.is_silently success", res);
        //       if (res.statusCode == 200) {
        //         report(Events.APP_DOWNLOAD_STATUS, {
        //           type: "WGT",
        //           data: reportData,
        //           status: ReportStatus.SUCCESS,
        //         });
        //         // 下载好直接安装，下次启动生效
        //         plus.runtime.install(
        //           res.tempFilePath,
        //           {
        //             force: false,
        //           },
        //           function () {
        //             report(Events.APP_UPDATE_STATUS, {
        //               type: "WGT",
        //               data: reportData,
        //               status: ReportStatus.SUCCESS,
        //             });
        //             uni.log.infog("gwt install success");
        //             // plus.runtime.restart();
        //           },
        //           function (e) {
        //             report(Events.APP_UPDATE_STATUS, {
        //               type: "WGT",
        //               data: reportData,
        //               status: ReportStatus.FAILED,
        //               errMsg: e,
        //             });
        //             uni.log.info("gwt install error : " + e.message);
        //           }
        //         );
        //       } else {
        //         report(Events.APP_DOWNLOAD_STATUS, {
        //           type: "WGT",
        //           data: reportData,
        //           status: ReportStatus.FAILED,
        //           errMsg: res,
        //         });
        //       }
        //     },
        //   });
        // } else {
        //   uni.setStorageSync(PACKAGE_INFO_KEY, uniUpgradeCenterResult);
        //   uni.navigateTo({
        //     url: `/pages/upgrade-popup/upgrade-popup?local_storage_key=${PACKAGE_INFO_KEY}`,
        //     fail: (err) => {
        //       console.error("更新弹框跳转失败", err);
        //       uni.removeStorageSync(PACKAGE_INFO_KEY);
        //     },
        //   });
        // }
        return resolve(uniUpgradeCenterResult);
      })
      .catch((err) => {
        report(Events.APP_CHECK_UPDATE_STATUS, {
          status: ReportStatus.FAILED,
          errMsg: err,
        });
        reject(err);
      });
  });
}

/**
 * 使用 uni.showModal 升级
 */
export function updateUseModal(packageInfo: UniUpgradeCenterResult): void {
  const {
    title, // 标题
    contents, // 升级内容
    is_mandatory, // 是否强制更新
    url, // 安装包下载地址
    type,
    platform,
  } = packageInfo;

  const isWGT = type === "wgt";
  const isiOS = !isWGT ? platform.includes("iOS") : false;

  const confirmText = isiOS ? "立即跳转更新" : "立即下载更新";

  return uni.showModal({
    title,
    content: contents,
    showCancel: !is_mandatory,
    confirmText,
    success: (res) => {
      if (res.cancel) return;

      if (isiOS) {
        // iOS 平台跳转 AppStore
        plus.runtime.openURL(url);
        return;
      }

      uni.showToast({
        title: "后台下载中……",
        duration: 1000,
      });

      // wgt 和 安卓下载更新
      uni.downloadFile({
        url,
        success: (res) => {
          if (res.statusCode !== 200) {
            uni.log.info("下载安装包失败");
            return;
          }
          // 下载好直接安装，下次启动生效
          // uni-app x 项目没有 plus5+ 故使用条件编译
          plus.runtime.install(
            res.tempFilePath,
            {
              force: false,
            },
            () => {
              if (is_mandatory) {
                //更新完重启app
                plus.runtime.restart();
                return;
              }
              uni.showModal({
                title: "安装成功是否重启？",
                success: (res) => {
                  if (res.confirm) {
                    //更新完重启app
                    plus.runtime.restart();
                  }
                },
              });
            },
            (err) => {
              uni.showModal({
                title: "更新失败",
                content: err.message,
                showCancel: false,
              });
            }
          );
        },
      });
    },
  });
}
