import { getCurrentInstance } from "vue";
import storage, { cacheKeyEnums } from "@/utils/storage";
import dayjs from "dayjs";
import CryptoJS from "crypto-js";

// 刷新当前页面
export const refreshCurPage = (params: any = {}) => {
  const pages = getCurrentPages();
  if (pages && pages.length > 0) {
    const _page = pages[pages.length - 1].$page;

    const options = { ..._page.options, ...params };
    const url = _page?.path + uni.$u.queryParams(options);

    if (_page?.openType === "switchTab") {
      uni.reLaunch({
        url: url,
      });
    } else {
      uni.redirectTo({
        url: url,
      });
    }
  }
};

export const filterName = (name, count = 3) => {
  if (/^[a-zA-Z0-9]+$/.test(name)) {
    if (name.length > 6) {
      return name.slice(0, 5) + "...";
    } else {
      return name;
    }
  }
  if (name.length > 4) {
    return name.slice(0, count) + "...";
  } else {
    return name;
  }
  return name;
};

export const toCamelCase = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const newKey = key.replace(/(_\w)/g, function (k) {
      return k[1].toUpperCase();
    });
    newObj[newKey] = obj[key];
  }
  return newObj;
};

export const formatDate = (time, format = "YYYY-MM-DD") => {
  if (!time) return "";
  return dayjs.unix(time).format(format);
};

export const safeAreaPadding = () => {
  let safeArea = 0;

  const res = uni.getSystemInfoSync();

  if (res.safeArea) {
    // iOS
    safeArea = res.screenHeight - res.safeArea.bottom;
  } else if (res.platform.toLowerCase() === "android") {
    // Android
    safeArea = res.screenHeight - res.windowHeight;
  }
  // 设置安全区域内边距
  return safeArea + "px";
};

export const accountInfo = uni.getAccountInfoSync
  ? uni.getAccountInfoSync()
  : {};
export const systemInfo = uni.getSystemInfoSync() || {};

export const getPageInstance = () => {
  return systemInfo.uniPlatform === "app"
    ? getApp()
    : getCurrentInstance()?.proxy;
};

/**
 * 获取请求客户端配置
 *
 * @param {object} systemInfo uni.getSystemInfoSync() 信息
 * @returns
 */

export const getReqConfig = async () => {
  // const appInfo = process.env.appInfo;
  const launchOption = storage.get(cacheKeyEnums.LAUNCH_OPICON) || null;
  const { networkType } = await uni.getNetworkType();
  return {
    launch_option: launchOption,
    device_id: systemInfo.deviceId,
    network_type: networkType,
    version: "1.0.0",
    request_time: Date.parse(new Date()) / 1000,
    client_os: systemInfo?.platform || "android",
    client_system: systemInfo.system || "",
    client_name: systemInfo.model || "",
    sdk_version: systemInfo.SDKVersion,
    host_sdk_version: systemInfo.hostSDKVersion,
    app_client_version: systemInfo.version,
    client_type: "app", //客户端类型
  };
};

export const getSystemData = () => {
  const client_os = systemInfo?.platform || "android";
  const sysInfo = {
    is_ad_ios: false,
    tt: false,
    wx: false,
    android: false,
    ios: false,
    app: false,
    windows: false,
    windowWidth: 0,
    windowHeight: 0,
    mac: false,
    devtools: false,
    deviceId: systemInfo.deviceId,
  };
  sysInfo.tt = client_os === "mp-toutiao";
  sysInfo.wx = client_os === "mp-weixin";
  sysInfo.app = systemInfo.uniPlatform === "app";
  sysInfo.android = client_os === "android";
  sysInfo.ios = client_os === "ios";
  sysInfo.windows = client_os === "windows";
  sysInfo.windowWidth = systemInfo.windowWidth;
  sysInfo.windowHeight = systemInfo.windowHeight;
  sysInfo.screenHeight = systemInfo.screenHeight;
  sysInfo.mac = client_os === "mac";
  sysInfo.devtools = client_os === "devtools";
  return sysInfo;
};

// https://uniapp.dcloud.net.cn/tutorial/app-disagreemode.html#limit-plus
export const showPrivacyDialog = () => {
  const options = {
    success: function (response) {
      console.log("success  " + JSON.stringify(response));
      if (response.code == 1) {
        //用户已同意隐私政策，可以使用其它业务功能
        plus.runtime.restart();
      } else {
        //用户未同意隐私政策，仍然运行disagreeMode模式，不可以使用其它业务功能
        // ...
      }
    },
    fail: function (response) {
      console.log("fail  " + JSON.stringify(response));
    },
  };
  //弹出隐私政策协议框，引导用户同意隐私政策
  plus.runtime.showPrivacyDialog(options);
};

// 淘个号用户服务协议及规则
export const toUserAgreement = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=userAgreement`,
  });
};

// 淘个号虚拟物品交易规则
export const toTradingRules = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=tradingRules`,
  });
};

// 淘个号隐私政策
export const toUserPrivacy = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=userPrivacy`,
  });
};

// 淘个号卖家服务协议
export const toSellerAgreement = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=sellerAgreement`,
  });
};

// 淘个号账号转让协议
export const toAccountTransfer = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=accountTransfer`,
  });
};

// 淘个号平台账户注销重要提醒
export const toAccoutLogout = () => {
  uni.navigateTo({
    url: `/pages/web-view/index?name=accoutLogout`,
  });
};

/**
 * 金额格式化，不四舍五入
 * @param num 金额
 * @param decimals 保留几位小数
 * @returns
 */
export const priceFormat = (num, decimals = 0) => {
  // 确保输入是数字
  if (typeof num !== "number" || isNaN(num)) {
    return "Invalid input";
  }

  // 将数字转换为字符串，并保留指定的小数位数
  let str = num.toFixed(decimals).toString();

  // 如果数字是负数，记录负号并去掉它
  let negative = false;
  if (str[0] === "-") {
    negative = true;
    str = str.slice(1);
  }

  // 分割整数部分和小数部分
  const parts = str.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || ""; // 如果没有小数部分，则为空字符串

  // 从整数部分的末尾开始，每3个字符添加一个逗号
  const formattedIntegerPart = integerPart
    .split("")
    .reverse()
    .reduce((acc, val, i) => {
      if (i % 3 === 0 && i !== 0) {
        acc = "," + acc;
      }
      return val + acc;
    }, "");

  // 拼接整数部分和小数部分
  let formatted = formattedIntegerPart + (decimalPart ? "." + decimalPart : "");

  // 如果数字是负数，则在最前面添加负号
  if (negative) {
    formatted = "-" + formatted;
  }

  return formatted;
};

/**
 * APP退出事件不弹提示
 */
export const moveToBack = () => {
  // 隐藏“再按一次退出应用”的提示，将应用隐藏至后台
  const main = plus.android.runtimeMainActivity();
  plus.runtime.quit = function () {
    main.moveTaskToBack(false);
  };
  //重写提示：如果提示为 ‘再按一次退出应用’ 就隐藏应用，其他提示正常显示
  plus.nativeUI.toast = function (str) {
    if (str == "再按一次退出应用") {
      main.moveTaskToBack(false);
      return false;
    } else {
      uni.showToast({
        title: str,
        icon: "none",
      });
    }
  };
};

/**
 * 转base64
 */
export const encodeBase64 = (str: string) => {
  if (str) {
    const wordArray = CryptoJS.enc.Utf8.parse(str.toString());
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
  }
  return "";
};

/**
 * 检查文件是否存在
 * @param url
 * @returns
 */
export const checkFileExists = (url) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: url,
      method: "HEAD",
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
