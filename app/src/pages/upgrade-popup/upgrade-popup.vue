<template>
  <global-view>
    <view class="mask flex-center">
      <view class="content botton-radius">
        <view class="content-top">
          <image
            class="content-top"
            style="top: 0"
            width="100%"
            height="100%"
            src="@/static/images/common/bg-update.png"
          >
          </image>
        </view>
        <view class="content-body">
          <view class="title">
            <image
              class="img"
              src="@/static/images/common/bg-update-text.png"
            />
            <text class="content-body-version">
              v {{ localPackageInfo.version }}
            </text>
          </view>
          <view class="body">
            <text class="sub-title">更新内容</text>
            <scroll-view class="box-des-scroll" scroll-y="true">
              <!-- <rich-text
                class="box-des"
                :nodes="localPackageInfo.contents"
              ></rich-text> -->
              <view v-for="item in contentArr" :key="item">
                <text class="box-des">
                  {{ item }}
                </text>
              </view>
            </scroll-view>
          </view>
          <view class="footer flex-center">
            <template v-if="!downloadSuccess">
              <view v-if="downloading" class="progress-box flex-column">
                <u-line-progress
                  class="progress"
                  :percentage="downLoadPercent"
                  :showText="false"
                  height="84rpx"
                  activeColor="#1CC7BE"
                  inactiveColor="#F7F9FA"
                ></u-line-progress>

                <view class="content-button-status">
                  <text class="text">{{ downLoadingText }}</text>
                  <view>
                    <text class="text"
                      >{{ downloadedSize }}/{{ packageFileSize }}M</text
                    >
                  </view>
                </view>
              </view>

              <template v-else>
                <button
                  class="content-button"
                  style="border: none; color: #fff"
                  plain
                  @click="updateApp"
                >
                  {{ downLoadBtnText }}
                </button>
                <view
                  v-if="!localPackageInfo.is_mandatory"
                  class="content-button-status"
                >
                  <text class="text" @click.stop="closeUpdate">稍后再说</text>
                </view>
              </template>
            </template>
            <button
              v-else-if="downloadSuccess && !installed"
              class="content-button"
              style="border: none; color: #fff"
              plain
              :loading="installing"
              @click="installPackage"
            >
              {{ installing ? "正在安装……" : "下载完成，立即安装" }}
            </button>
            <button
              v-else-if="installed && !isWGT"
              class="content-button"
              style="border: none; color: #fff"
              plain
              :loading="installing"
              @click="installPackage"
            >
              安装未完成，点击安装
            </button>

            <button
              v-else-if="installed && isWGT"
              class="content-button"
              style="border: none; color: #fff"
              plain
              @click="restart"
            >
              安装完毕，点击重启
            </button>
          </view>
        </view>
      </view>
    </view>
  </global-view>
  <u-modal
    :show="modal.show"
    :title="modal.title"
    :content="modal.content"
    :showCancelButton="modal.showCancelButton"
    :confirmText="modal.confirmText"
    :cancelText="modal.cancelText"
    width="550rpx"
    contentTextAlign="center"
    @confirm="modal.success"
    @cancel="modal.cancel"
  ></u-modal>
</template>

<script>
import { compare } from "./utils/index";
import GlobalView from "@/components/global-view/index.vue";
import Events, { report, ReportStatus } from "@/utils/report/report";

const localFilePathKey = "UNI_ADMIN_UPGRADE_CENTER_LOCAL_FILE_PATH";
const platform_iOS = "iOS";
const platform_Android = "Android";
let downloadTask = null;
let openSchemePromise;

export default {
  components: {
    "global-view": GlobalView,
  },
  data() {
    return {
      // 从之前下载安装
      installForBeforeFilePath: "",
      // 安装
      installed: false,
      installing: false,
      // 下载
      downloadSuccess: false,
      downloading: false,
      downLoadPercent: 0,
      downloadedSize: 0,
      packageFileSize: 0,
      tempFilePath: "", // 要安装的本地包地址

      downLoadBtnTextiOS: "打开应用商店",
      downLoadBtnText: "立即升级",
      downLoadingText: "正在更新中，请稍候...",
      // 默认安装包信息
      localPackageInfo: {
        title: "",
        platform: [],
        is_silently: false, // 是否静默更新
        is_mandatory: false, // 是否强制更新
        url: "", // 安装包下载地址
        contents: "",
        version: "", // 版本名 1.0.0
        version_code: "", // 版本号 100
        type: "APK", // 安装包类型 APK WGT
        store_list: null,
      },
      modal: {
        show: false,
        content: "",
        title: "",
        showCancelButton: false,
        confirmText: "",
        cancelText: "",
        success: null,
        cancel: null,
      },
    };
  },
  onLoad({ local_storage_key }) {
    if (!local_storage_key) {
      uni.log.info("local_storage_key为空，请检查后重试");
      uni.navigateBack();
      return;
    }
    const localPackageInfo = uni.getStorageSync(local_storage_key);
    if (!localPackageInfo) {
      uni.log.info("安装包信息为空，请检查后重试");
      uni.navigateBack();
      return;
    }
    const requiredKey = ["version", "url", "type"];
    for (const key in localPackageInfo) {
      if (requiredKey.indexOf(key) !== -1 && !localPackageInfo[key]) {
        uni.log.info(`参数 ${key} 必填，请检查后重试`);
        uni.navigateBack();
        return;
      }
    }

    report(Events.APP_UPDATE_PAGE, {
      data: this.reportData,
    });
    this.localPackageInfo = localPackageInfo;
    uni.log.info("localPackageInfo", localPackageInfo);
    this.checkLocalStoragePackage();
  },
  onBackPress() {
    // 强制更新不允许返回
    if (this.localPackageInfo.is_mandatory) return true;
    if (!this.needNotificationProgress) downloadTask && downloadTask.abort();
  },
  onHide() {
    openSchemePromise = null;
  },
  computed: {
    isWGT() {
      return this.localPackageInfo.type === "WGT";
    },
    isAndroid() {
      return this.localPackageInfo.platform.indexOf(platform_Android) !== -1;
    },
    needNotificationProgress() {
      return (
        this.localPackageInfo.platform.indexOf(platform_iOS) === -1 &&
        !this.localPackageInfo.is_mandatory
      );
    },
    contentArr() {
      if (this.localPackageInfo?.contents) {
        return this.localPackageInfo?.contents
          .split("\n")
          .map((el) => el.trim())
          .filter((el) => el);
      } else {
        return [];
      }
    },
    reportData() {
      return {
        url: this.localPackageInfo.url,
        version: this.localPackageInfo.version,
        version_code: this.localPackageInfo.version_code,
        type: this.localPackageInfo.type,
      };
    },
  },
  methods: {
    showModal(opts) {
      // 重置modal
      this.modal = {};
      this.modal.title = opts.title;
      this.modal.content = opts.content;
      this.modal.showCancelButton = opts.showCancelButton;
      this.modal.confirmText = opts.confirmText;
      this.modal.cancelText = opts.cancelText;
      this.modal.success = opts.success;
      this.modal.cancel = opts.cancel;
      this.modal.show = true;
    },
    checkLocalStoragePackage() {
      // 如果已经有下载好的包，则直接提示安装
      const localFilePathRecord = uni.getStorageSync(localFilePathKey);
      if (localFilePathRecord) {
        const { version, savedFilePath, installed } = localFilePathRecord;
        // 比对版本
        if (
          !installed &&
          compare(version, this.localPackageInfo.version) === 0
        ) {
          this.downloadSuccess = true;
          this.installForBeforeFilePath = savedFilePath;
          this.tempFilePath = savedFilePath;
        } else {
          // 如果保存的包版本小 或 已安装过，则直接删除
          this.deleteSavedFile(savedFilePath);
        }
      }
    },
    askAbortDownload() {
      this.modal.title = "是否取消下载？";
      this.modal.content = "";
      this.modal.showCancelButton = false;

      this.showModal({
        content: "是否取消下载？",
        cancelText: "否",
        confirmText: "是",
        showCancelButton: true,
        success: () => {
          downloadTask && downloadTask.abort();
          //   cancelNotificationProgress()
          this.modal.show = false;
          uni.navigateBack();
        },
        cancel: () => {
          this.modal.show = false;
        },
      });
    },
    async closeUpdate() {
      if (this.downloading) {
        if (this.localPackageInfo.is_mandatory) {
          return uni.$main.toast("下载中，请稍后...");
        }
        if (!this.needNotificationProgress) {
          this.askAbortDownload();
          return;
        }
      }
      if (
        !this.needNotificationProgress &&
        this.downloadSuccess &&
        this.tempFilePath
      ) {
        // 包已经下载完毕，稍后安装，将包保存在本地
        await this.saveFile(this.tempFilePath, this.localPackageInfo.version);
      }
      report(Events.APP_UPDATE_CANCEL, {
        type: this.localPackageInfo.type,
        data: this.reportData,
      });
      uni.navigateBack();
    },
    updateApp() {
      this.checkStoreScheme()
        .catch(() => {
          this.downloadPackage();
        })
        .finally(() => {
          openSchemePromise = null;
        });
    },
    // 跳转应用商店
    checkStoreScheme() {
      const systemInfo = uni.getSystemInfoSync() || {};
      const phone = systemInfo.deviceBrand.toLocaleUpperCase();
      const storeList = this.localPackageInfo.store_list || [];
      const arr = storeList
        .sort((cur, next) => next.priority - cur.priority)
        .filter((item) => phone.includes(item.channel));
      if (arr.length > 0) {
        arr
          .map((item) => item.scheme)
          .reduce((promise, cur) => {
            openSchemePromise = (promise || (promise = Promise.reject())).catch(
              () => {
                return new Promise((resolve, reject) => {
                  plus.runtime.openURL(cur, (err) => {
                    // console.log("plus.runtime.openUR url", cur, err);
                    report(Events.APP_STORE_OPEN_STATUS, {
                      type: this.localPackageInfo.type,
                      data: this.reportData,
                      url: cur,
                      status: ReportStatus.FAILED,
                      errMg: err,
                    });
                    reject(err);
                  });
                });
              }
            );
            return openSchemePromise;
          }, openSchemePromise);
        return openSchemePromise;
      }
      return Promise.reject();
    },
    downloadPackage() {
      this.downloading = true;
      //下载包
      downloadTask = uni.downloadFile({
        url: this.localPackageInfo.url,
        success: (res) => {
          if (res.statusCode == 200) {
            report(Events.APP_DOWNLOAD_STATUS, {
              type: this.localPackageInfo.type,
              data: this.reportData,
              status: ReportStatus.SUCCESS,
            });
            // fix: wgt 文件下载完成后后缀不是 wgt
            if (
              this.isWGT &&
              res.tempFilePath.split(".").slice(-1)[0] !== "wgt"
            ) {
              const failCallback = (e) => {
                uni.log.info("[FILE RENAME FAIL]：", JSON.stringify(e));
              };
              plus.io.resolveLocalFileSystemURL(
                res.tempFilePath,
                (entry) => {
                  entry.getParent((parent) => {
                    const newName = `new_wgt_${Date.now()}.wgt`;
                    entry.copyTo(
                      parent,
                      newName,
                      (res) => {
                        this.tempFilePath = res.fullPath;
                        this.downLoadComplete();
                      },
                      failCallback
                    );
                  }, failCallback);
                },
                failCallback
              );
            } else {
              this.tempFilePath = res.tempFilePath;
              this.downLoadComplete();
            }
          } else {
            report(Events.APP_DOWNLOAD_STATUS, {
              type: this.localPackageInfo.type,
              data: this.reportData,
              status: ReportStatus.FAILED,
              errMsg: res,
            });
          }
        },
      });
      downloadTask.onProgressUpdate((res) => {
        this.downLoadPercent = res.progress;
        this.downloadedSize = (
          res.totalBytesWritten / Math.pow(1024, 2)
        ).toFixed(2);
        this.packageFileSize = (
          res.totalBytesExpectedToWrite / Math.pow(1024, 2)
        ).toFixed(2);
        if (this.needNotificationProgress && !this.downloadSuccess) {
          // createNotificationProgress({
          // 	title: "升级中心正在下载安装包……",
          // 	content: `${this.downLoadPercent}%`,
          // 	progress: this.downLoadPercent,
          // 	onClick: () => {
          // 		this.askAbortDownload()
          // 	}
          // })
        }
      });
      // if (this.needNotificationProgress) {
      //   uni.navigateBack();
      // }
    },
    downLoadComplete() {
      this.downloadSuccess = true;
      this.downloading = false;
      this.downLoadPercent = 0;
      this.downloadedSize = 0;
      this.packageFileSize = 0;
      downloadTask = null;
      if (this.needNotificationProgress) {
        // finishNotificationProgress({
        // 	title: "安装升级包",
        // 	content: "下载完成"
        // })
        this.installPackage();
        return;
      }
      // 强制更新，直接安装
      if (this.localPackageInfo.is_mandatory) {
        this.installPackage();
      }
    },
    openFile(filePath) {
      return new Promise((resolve, reject) => {
        plus.runtime.openFile(
          filePath,
          {
            // force: false,
          },
          (err) => {
            uni.log.info(" plus.runtime.openFile err", err);
            return reject(err);
          }
        );
        uni.log.info(" plus.runtime.openFile success");
        resolve({
          status: true,
        });
      });
    },
    async installPackage() {
      // 正在安装中
      if (this.installing) {
        return;
      }
      // wgt资源包安装
      if (this.isWGT) {
        this.installing = true;
      }
      plus.runtime.install(
        this.tempFilePath,
        {
          force: false,
        },
        async () => {
          report(Events.APP_UPDATE_STATUS, {
            type: this.localPackageInfo.type,
            data: this.reportData,
            status: ReportStatus.SUCCESS,
          });

          this.installing = false;
          this.installed = true;
          // wgt包，安装后会提示 安装成功，是否重启
          if (this.isWGT) {
            // 强制更新安装完成重启
            // if (this.localPackageInfo.is_mandatory) {
            uni.$main.showLoading({
              title: "安装成功，正在重启...",
              mask: true,
            });

            setTimeout(() => {
              uni.$main.hideLoading();
              this.restart();
            }, 1000);
            // }
          } else {
            const localFilePathRecord = uni.getStorageSync(localFilePathKey);
            uni.setStorageSync(localFilePathKey, {
              ...localFilePathRecord,
              installed: true,
            });
          }
        },
        async (err) => {
          uni.log.info("plus.runtime.install err", err);
          // 如果是安装之前的包，安装失败后删除之前的包
          if (this.installForBeforeFilePath) {
            await this.deleteSavedFile(this.installForBeforeFilePath);
            this.installForBeforeFilePath = "";
          }
          // 安装失败需要重新下载安装包
          this.installing = false;
          this.installed = false;

          this.showModal({
            content: "更新失败，请重新下载",
            showCancelButton: false,
            success: () => {
              this.modal.show = false;
            },
          });

          report(Events.APP_UPDATE_STATUS, {
            type: this.localPackageInfo.type,
            data: this.reportData,
            status: ReportStatus.FAILED,
            errMsg: err,
          });
        }
      );
      // 非wgt包，安装跳出覆盖安装，此处直接返回上一页
      if (!this.isWGT && !this.localPackageInfo.is_mandatory) {
        uni.navigateBack();
      }
    },
    restart() {
      this.installed = false;
      //更新完重启app
      plus.runtime.restart();
    },
    saveFile(tempFilePath, version) {
      return new Promise((resolve) => {
        uni.saveFile({
          tempFilePath,
          success({ savedFilePath }) {
            uni.setStorageSync(localFilePathKey, {
              version,
              savedFilePath,
            });
          },
          complete() {
            resolve();
          },
        });
      });
    },
    deleteSavedFile(filePath) {
      uni.removeStorageSync(localFilePathKey);
      return uni.removeSavedFile({
        filePath,
      });
    },
    jumpToAppStore() {
      plus.runtime.openURL(this.localPackageInfo.url);
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
}

.botton-radius {
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.content {
  position: relative;
  top: 0;
  width: 606rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 32rpx 48rpx;
  font-family: Source Han Sans CN;
}

.text {
  text-align: center;
  color: #ffffff;
}

.content-top {
  position: absolute;
  top: -195rpx;
  left: 0;
  width: 606rpx;
  height: 414rpx;
}

.content-top-text {
  font-size: 45rpx;
  font-weight: bold;
  color: #f8f8fa;
  position: absolute;
  top: 120rpx;
  left: 50rpx;
  z-index: 1;
}

.content-body {
  position: relative;
  z-index: 999;
  margin-top: 70rpx;
  .title {
    position: relative;
    display: flex;
    justify-content: center;

    .img {
      width: 334rpx;
      height: 58rpx;
    }

    .content-body-version {
      position: absolute;
      right: 2rpx;
      top: -38rpx;
      width: 106rpx;
      height: 40rpx;
      line-height: 40rpx;
      background: #34d288;
      border-radius: 8rpx 8rpx 8rpx 8rpx;
      text-align: center;
      font-weight: 400;
      font-size: 28rpx;
      color: #ffffff;
    }
  }

  .body {
    margin-top: 30rpx;

    .box-des-scroll {
      margin-top: 12rpx;
      box-sizing: border-box;
      height: 180rpx;
      text-align: left;
    }
    .sub-title {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }

    .box-des {
      font-weight: 400;
      font-size: 28rpx;
      color: #606060;
      line-height: 40rpx;
    }
  }
}

.footer {
  // height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
}

.progress-box {
  width: 100%;
}

.progress {
  width: 90%;
  height: 40rpx;
  /* border-radius: 35px; */
}

.content-button {
  text-align: center;
  font-size: 30rpx;
  font-weight: 400;
  color: #ffffff;
  width: 446rpx;
  height: 84rpx;
  line-height: 84rpx;
  background: #1cc7be;
  border-radius: 12rpx 12rpx 12rpx 12rpx;
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-button-status {
  margin-top: 28rpx;
  text-align: center;
  .text {
    font-weight: 400;
    font-size: 32rpx;
    color: #1cc7be;
  }
}

::v-deep .u-line-progress {
  border-radius: 12rpx;
  .u-line-progress__background {
    border-radius: 12rpx;
  }
  .u-line-progress__line {
    border-radius: 0;
  }
  .u-line-progress__text {
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
  }
}
</style>
