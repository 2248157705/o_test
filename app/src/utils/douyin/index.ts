import { init, auth } from "./douyin";

/**
 * 初始化
 * @returns
 */
export function initDouyin() {
  init(
    {
      clientkey: import.meta.env.VITE_APP_DOUYIN_CLIENTKEY,
    },
    (res) => {
      uni.log.info("initDouyin", res);
    }
  );
}

/**
 * 抖音登录
 * @returns
 */
export function dyAuth(opts, cb) {
  auth(opts, cb);
}
