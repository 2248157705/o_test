import { isObject, isNumber, isString } from "lodash-es";
import storage from "@/utils/storage";
import { getRequestSign } from "./getRequestSign";
import { useUserStore } from "../stores/user";
import { useMainStore } from "../stores/main";
import { useReportStore } from "../stores/report";
import { ReportPlatform } from "@/enums/common";
import { toLogin } from "@/utils/login";
import { getApiJsonUrl, isApiJsonUrl } from "@/fetch/api-json-config";
import { isProd } from "@/utils/config";

// 接口规范文档 https://www.kdocs.cn/l/cuYGu145rhHs
enum CodeStatus {
  SUCCESS = "SUCCESS", // 请求成功
  FAILED = "FAILED", // 请求失败
  NETWORK_ERROR = "NETWORK_ERROR", // 网络异常
  LOGIN = "LOGIN", // 未登录
  ERROR = "ERROR", // 接口错误
  NOT_FOUND = "NOT_FOUND", // 接口404
  ALERT = "ALERT", // 接口错误，显示showModal
  QPS = "QPS", // 请求频繁
  IM_NOT_LOGGED = "IM_NOT_LOGGED", // IM账号未登录
}

const getCodeStatus = (response) => {
  const { data, statusCode, errMsg } = response;

  if (statusCode === 200 && isObject(data)) {
    let code = "";
    if (isNumber(data?.code)) {
      code = data.code;
    } else if (isString(data?.code)) {
      code = data.code.split(":")[1];
      code = +code;
    }
    if ([0, 200, 20000].includes(code)) {
      return CodeStatus.SUCCESS;
    } else if ([50009, 500101, 101].includes(code)) {
      return CodeStatus.LOGIN;
    } else if ([50000, 400, 103, 102, 105].includes(code)) {
      return CodeStatus.ERROR;
    } else if ([429, 104, 500429].includes(code)) {
      return CodeStatus.QPS;
    } else if ([402, 409].includes(code)) {
      return CodeStatus.ALERT;
    } else if ([500301].includes(code)) {
      return false;
    } else if ([50041].includes(code)) {
      return CodeStatus.IM_NOT_LOGGED;
    } else if ([500102, 50002].includes(code)) {
      const mainStore = useMainStore();
      mainStore.realPopupVisible = true;
      return false;
    } else {
      return CodeStatus.ERROR;
    }
  } else {
    if (errMsg && errMsg.includes("request:fail")) {
      return CodeStatus.NETWORK_ERROR;
    } else if (statusCode === 404) {
      return CodeStatus.NOT_FOUND;
    } else if (statusCode === 500) {
      return CodeStatus.FAILED;
    } else {
      return CodeStatus.FAILED;
    }
  }
};

const getYlextData = () => {
  const reportStore = useReportStore();
  const { userData, deviceInfo } = reportStore;

  const data = {
    session_id: userData.session_id,
    platform: ReportPlatform.ANDROID,
    campaign_id: userData.campaign_id,
    p_channel: userData.p_channel,
    p_channel_id: userData.p_channel_id,
    p_campaign_id: userData.p_campaign_id,
    version_code: deviceInfo?.version_code,
  };

  return data;
};

export function setRequest(vm) {
  // console.log("vm---", vm);
  vm.interceptor.request((config) => {
    /* 请求之前拦截器 */
    if (config.showLoading) {
      uni.$main.showLoading({
        title: "请稍后...",
        mask: true,
      });
    }
    const apiJsonUrl = getApiJsonUrl(config.url, config.data);
    if (!config.originRequest && apiJsonUrl) {
      // 保存原始请求参数
      config.originRequest = {
        url: config.url,
        method: config.method,
        data: config.data,
      };
      config.url = apiJsonUrl;
      config.method = "GET";
      if (isProd) {
        config.data = {};
      }
    } else {
      config.data.request_time = Math.round(
        new Date().getTime() / 1000
      ).toString();
      config.data.sign = getRequestSign(
        config.data,
        import.meta.env.VITE_APP_SECRET_KEY
      );
      const token = uni.getStorageSync("token"); // 从本地缓存中同步获取指定 key 对应的内容。
      if (token) {
        config.header.token = token;
      } else {
        if (config.header.token) delete config.header.token;
      }
      const reportData = getYlextData();
      config.header["ylext"] = JSON.stringify(reportData);
      config.header["Tgh-Version-Code"] = reportData?.version_code;
      config.header["Tgh-Platform"] = reportData?.platform;
      // uni.log.info(`${config.url} request=====>`, config);
    }

    return config;
  });
}
export function setResponse(vm) {
  vm.interceptor.response(async (response) => {
    /* 请求之后拦截器 */
    console.log(`${response.config.url} response====>`, response);
    const { data, statusCode, config } = response;
    const error = statusCode === 200 ? data?.msg || data?.error : "系统错误";
    const status = getCodeStatus(response);
    // if (config && config.showLoading) {
    uni.$main.hideLoading(); //关闭加载动画
    // }

    if (config.url.includes("/client/event/report")) {
      return {};
    }

    if (status === CodeStatus.SUCCESS) {
      return data.data || data;
    } else if (status === CodeStatus.ERROR) {
      !response.config?.hideMsg &&
        !response.config.data.ignoreError &&
        uni.$main.toast(error);
      return Promise.reject(data);
    } else if (status === CodeStatus.LOGIN) {
      const userStore = useUserStore();
      storage.clear();
      userStore.logOut();
      toLogin();
      return Promise.reject(data);
    } else if (status === CodeStatus.ALERT) {
      uni.showModal({
        title: "提示",
        content: error,
        showCancel: false,
      });
      return Promise.reject(data);
    } else if (status === CodeStatus.NOT_FOUND && isApiJsonUrl(config.url)) {
      return Promise.reject({});
    } else if (status === CodeStatus.NOT_FOUND) {
      uni.$main.toast("接口不存在");
      return Promise.reject(data);
    } else if (status === CodeStatus.QPS) {
      // uni.$main.toast("请求频繁");
      return Promise.reject(data);
    } else if (status === CodeStatus.NETWORK_ERROR) {
      uni.$main.toast("网络连接失败");
      return Promise.reject(data);
    } else if (status === CodeStatus.FAILED) {
      uni.$main.toast("系统错误");
      return Promise.reject(data);
    } else {
      return Promise.reject(data);
    }
  });
}
