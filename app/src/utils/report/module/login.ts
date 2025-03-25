import { reactive } from "vue";
import { LoginType } from "@/enums/loginEnums";
import Events, { report, ReportStatus } from "@/utils/report/report";

export enum LoginType {
  DOUYIN = "DOUYIN", //抖音登录
  WEIXIN = "WEIXIN", //微信登录
  PHONE = "PHONE", //手机号登录
}

export function LoginReport() {
  const reporData = reactive({
    startTime: 0,
    type: LoginType.PHONE,
  });

  const reportLoginSuccess = (userData: any) => {
    report(Events.USER_INFO, userData);
    report(Events.USER_LOGIN_STATUS, {
      type: reporData.type,
      status: ReportStatus.SUCCESS,
      dur: new Date().getTime() - reporData.startTime,
    });
  };

  const reportLoginFailed = (errMsg: any) => {
    report(Events.USER_LOGIN_STATUS, {
      type: reporData.type,
      status: ReportStatus.FAILED,
      errMsg: errMsg,
      dur: new Date().getTime() - reporData.startTime,
    });
  };

  const reportLoginPreSuccess = () => {
    report(Events.USER_LOGIN_PRE_STATUS, {
      type: reporData.type,
      status: ReportStatus.SUCCESS,
    });
  };

  const reportLoginPreFailed = (errMsg: any) => {
    report(Events.USER_LOGIN_PRE_STATUS, {
      type: reporData.type,
      status: ReportStatus.FAILED,
      errMsg: errMsg,
    });
  };

  const reportLogin = () => {
    report(Events.USER_LOGIN, {
      type: reporData.type,
    });
  };

  const reportLoginPre = (type: LoginType) => {
    reporData.startTime = new Date().getTime();
    reporData.type = type;
    report(Events.USER_LOGIN_PRE, {
      type: reporData.type,
    });
  };

  return {
    reportLogin,
    reportLoginPre,
    reportLoginSuccess,
    reportLoginFailed,
    reportLoginPreSuccess,
    reportLoginPreFailed,
  };
}
