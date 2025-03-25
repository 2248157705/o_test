const openinstall = uni.requireNativePlugin("OpenInstallModule");

/**
 * 初始化
 * 在 App.vue 的 onLaunch 方法中进行初始化
 */
export function init() {
  openinstall?.init();
}

/**
 * 获取安装数据
 * @param seconds 回调超时时间 单位：秒
 */
export function getInstall(seconds: number) {
  return new Promise((resolve) => {
    if (!openinstall?.getInstall) {
      resolve({});
      // resolve({
      //   bindData: JSON.stringify({
      //     campaign_id: "UJ7Q4Zye",
      //     campaign_extra: encodeURIComponent(
      //       JSON.stringify({
      //         path: "pages/my/index",
      //       })
      //     ),
      //   }),
      //   channelCode: "test5",
      // });
    }
    openinstall?.getInstall(seconds, (res) => {
      resolve(res || {});
    });
  });
}

/**
 * 获取拉起数据
 * 在 App.vue 的 onLaunch 方法中注册拉起回调（在初始化之后调用 ）
 */
export function registerWakeUp(callback: () => void) {
  openinstall?.registerWakeUp(callback);
}

/**
 * 注册量统计
 */
export function reportRegister() {
  openinstall?.reportRegister();
}

/**
 * 效果点统计
 * @param effectPointId 效果点ID
 * @param effectPointValue 效果点值，数值类型
 * @param extras 效果点自定义参数和值,key和value都必须是string类型
 */
export function reportEffectPoint(
  effectPointId: string,
  effectPointValue: number,
  extras?: {
    [key: string]: string;
  }
) {
  openinstall?.reportEffectPoint(effectPointId, effectPointValue, extras);
}

/**
 * 裂变分享上报
 * @param shareCode 分享标识码（用户标识）
 * @param sharePlatform  分享平台，参考官网定义的平台字符串
 * @param callback 上报回调函数
 */
export function reportShare(shareCode: string, sharePlatform: string) {
  return new Promise((resolve) => {
    if (!openinstall?.reportShare) {
      resolve({});
    }
    openinstall?.reportShare(shareCode, sharePlatform, (res) => {
      resolve(res || {});
    });
  });
}
