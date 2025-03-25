export enum cacheKeyEnums {
  USER_INFO = "user_info",
  LAUNCH_OPICON = "launch_option",
  CLIENT_INFO = "client_info", // 设备信息
  AD_VWETISEMENT = "ad_vertisement", // 广告位置数据
  ABOUT_ME_INFO = "aboutMeInfo", // 关于我们的数据
  PERSONALIZED = "personalized ", // 个性化推荐
  APP_VERSION = "app_version ", // 版本号
}

const storage = {
  set(key, data, datetime = 0) {
    // if (key == cacheKeyEnums.USER_INFO) datetime = 7;
    key = "whxl_" + key;
    const cacheValue = {
      content: data,
      datetime:
        parseInt(datetime) === 0
          ? 0
          : new Date().getTime() + parseInt(datetime) * 1000,
    };
    return uni.setStorageSync(key, JSON.stringify(cacheValue));
  },
  get(key) {
    key = "whxl_" + key;
    try {
      const value = JSON.parse(uni.getStorageSync(key));
      if (value) {
        const nowTime = new Date().getTime();
        if (nowTime > value.datetime && value.datetime != 0) {
          uni.removeStorageSync(key);
          return null;
        }
        return value.content;
      }
      return null;
    } catch (err) {
      return null;
    }
  },
  remove(key) {
    key = "whxl_" + key;
    return uni.removeStorageSync(key);
  },
  clear() {
    return uni.clearStorageSync();
  },
};

export default storage;
