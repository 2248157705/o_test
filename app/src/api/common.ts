import type { ReportEventReq, ApkUpgradeInfoReq } from "@/types/report";
import { request } from "../fetch";

const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

export const getOssAuth = (data) => {
  return request.post("/client/common/oss/ossAuth", data);
};

export const getCosAuth = (data) => {
  return request.post("/client/common/oss/cosAuth", data);
};

export const getCosAuthJava = (data) => {
  return request.post(`${baseUrl}/client/oss/getUploadCredential`, data);
};

export const sendSMS = (data) => {
  return request.post("/client/common/phone/sendSMS", data);
};
export const getBannerList = (display_terminal: string) => {
  return request.post(
    "/client/banner/list",
    { display_terminal },
    {
      showLoading: false,
    }
  );
};

/**
 * 事件上报
 * @param data ReportEventReq
 * @returns
 */
export const reportEvent = (data: ReportEventReq) => {
  return request.post(`${baseUrl}/client/event/report`, data, {
    showLoading: false,
  });
};

/**
 * 查询新版本
 * @param data ApkUpgradeInfoReq
 * @returns
 */
export const fetchUpgradeInfo = (data: ApkUpgradeInfoReq) => {
  return request.post(`${baseUrl}/client/apkPackage/getUpgradeInfo`, data, {
    showLoading: false,
  });
};

// 黑号查询
export const checkBlackAccount = (data) => {
  return request.get(`${baseUrl}/client/blackAccount/check`, data);
};
