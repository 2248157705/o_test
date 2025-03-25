/**
 * 美团分包sdk
 */

const walleModule = uni.requireNativePlugin("WalleModule");

/**
 * 获取渠道名
 * @returns data
 */
export function getChannel() {
  return walleModule?.getChannel();
}

/**
 * 获取渠道信息
 * @returns
 */
export function getChannelInfo() {
  return walleModule?.getChannelInfo();
}
