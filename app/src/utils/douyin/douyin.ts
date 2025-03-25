/**
 * 抖音sdk
 */

const DouYinModule = uni.requireNativePlugin("DouYinModule");

/**
 * 初始化
 * @returns
 */
export function init(
  opts: {
    clientkey: string;
  },
  cb
) {
  DouYinModule?.init(opts, cb);
}

/**
 * 抖音登录
 * @returns
 */
export function auth(
  opts: {
    scope: string;
    state?: string;
    optionalScope0?: string;
    optionalScope1?: string;
  },
  cb
) {
  DouYinModule?.auth(opts, cb);
}
