/**
 * 抖音分包sdk
 */

const humesdkModule = uni.requireNativePlugin("HumesdkModule");

/**
 * 获取渠道信息
 * @returns
 */
export function getChannel() {
  return humesdkModule?.getChannel();
}

/**
 * 获取版本号
 * @returns
 */
export function getVersion() {
  return humesdkModule?.getVersion();
}
