import type { ReportEventList } from "@/types/report";
import { reactive, watch } from "vue";
import { take, clone, drop } from "lodash-es";
import * as Events from "./event";
import { useReportStore } from "@/stores/report/index";
import { useUserStore } from "@/stores/user";
import { ReportPlatform, ReportType } from "@/enums/common";
import { reportEvent } from "@/api/common";
import { getPathname } from "@/fetch/api-json-config";
import { getDeviceInfo, getSessionId } from "./utils";
import { getCurPage } from "../login";

import {
  REQUEST_NETWORK,
  PAGE_VIEW,
  PAGE_VIEW_DUR,
  PAGE_VIEW_STAY,
  CODE_ERROR,
} from "./event";

export enum ReportStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

export enum ReportPayStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCEL = "CANCEL",
  ERRRO = "ERRRO",
  UNINSTALL = "UNINSTALL",
  TIMEOUT = "TIMEOUT",
}

const systemInfo = uni.getSystemInfoSync() || {};
let reportTimer = null;

/**
 * 获取当前系统
 */
export function getPlatform() {
  return systemInfo.platform === "ios"
    ? ReportPlatform.Ios
    : ReportPlatform.Android;
}

/**
 * 错误事件到队列中
 */
export function reportErrorEvent(opts: any) {
  // console.log("reportErrorEvent", opts);
  const reportStore = useReportStore();
  reportStore.pushEvents({
    ctime: new Date().getTime(),
    event_desc: "", // 事件中文
    event_id: CODE_ERROR, // 事件英文
    type: ReportType.ERROR, // 类型
    need_decode: ["errorMsg", "stack"],
    platform: getPlatform(), // 渠道
    props: opts,
    common: reportStore.userData,
    ext: null,
  });
}

/**
 * 业务埋点处理
 */
export function report(key: string, opts: any) {
  // console.log("report start--->", key, opts);
  const reportStore = useReportStore();
  reportStore.pushEvents({
    ctime: new Date().getTime(),
    event_desc: "", // 事件中文
    event_id: key, // 事件英文
    type: ReportType.EventReport, // 类型
    platform: getPlatform(), // 渠道
    props: opts,
    common: reportStore.userData,
    ext: null,
  });
  // console.log("report events--->", reportStore.events);
}

/**
 * 检查队列并发送事件
 */
function checkAndSendEvents() {
  const reportStore = useReportStore();
  const { events, maxEventsToSend, maxEventsPerBatch } = reportStore;
  // console.log("checkAndSendEvents---->", events.length);
  if (events.length >= maxEventsToSend) {
    const arr = take(clone(events), maxEventsPerBatch);
    // console.log("checkAndSendEvents", arr);
    sendEvents(arr);
  }
}

/**
 * 开始执行任务
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function startCheck() {
  const reportStore = useReportStore();
  reportTimer && clearInterval(reportTimer);
  reportTimer = setInterval(checkAndSendEvents, reportStore.checkInterval);
}
/**
 * 停止执行任务
 */
function stopCheck() {
  reportTimer && clearInterval(reportTimer);
}

/**
 * 上报事件
 */
async function sendEvents(arr: ReportEventList) {
  // console.log("sendEvents-start", arr);
  const reportStore = useReportStore();
  const { events, deviceInfo, setEvents, maxEventsPerBatch } = reportStore;

  const res = await reportEvent({
    device_info: deviceInfo,
    list: arr,
    stime: new Date().getTime(),
  }).catch((err) => {
    console.log("reportEvent request error", err, events);
  });
  if (res) {
    const newArr = drop(events, maxEventsPerBatch);
    setEvents(newArr);
  }
}

export function interceptorAppLife() {
  /**
   * app退出
   */
  const onUnload = () => {
    report(Events.APP_EXIT);
    checkAndSendEvents();
  };

  /**
   * app启动==
   */
  const onLaunch = () => {
    const reportStore = useReportStore();
    // 判断用户是否首次安装
    // uni.log.info("Events.APP_INSTALL", reportStore.isFirstInstall);
    if (reportStore.isFirstInstall) {
      report(Events.APP_INSTALL);
      reportStore.setInstallStatus(false);
    }
    report(Events.APP_LAUNCH, {
      dur: new Date().getTime() - reportStore.deviceInfo.startup_time,
    });
    checkAndSendEvents();
  };

  /**
   * app显示
   */
  const onShow = () => {
    startCheck();
  };

  /**
   * app隐藏
   */
  const onHide = () => {
    stopCheck();
  };

  return {
    onUnload,
    onLaunch,
    onShow,
    onHide,
  };
}

/**
 * 拦截接口请求
 */
export function interceptorRequest() {
  uni.addInterceptor("request", {
    invoke(args) {
      // console.log("args", args);
      const path = getPathname(args.url.split("?")[0]);
      const isBussApi = [
        import.meta.env.VITE_APP_HOST,
        import.meta.env.VITE_APP_ORDER_HOST,
      ].includes(args.baseUrl);
      if (isBussApi && !path.includes("/client/event/report")) {
        const reportStore = useReportStore();
        const interceptoData = {
          startTime: new Date().getTime(),
        };

        const common = clone(reportStore.userData);
        const _complete = args.complete;
        args.complete = function (e) {
          _complete && _complete(e);
          interceptoData.endTime = new Date().getTime();
          interceptoData.dur =
            interceptoData.endTime - interceptoData.startTime;

          const props = {
            http_code: e?.statusCode,
            code: e?.data?.code,
            path: path,
            dur: interceptoData.dur,
            start_time: interceptoData.startTime,
            end_time: interceptoData.endTime,
            result: {
              code: e?.data?.code,
              request_id: e?.data?.request_id,
              // error: e?.data?.errMsg || e?.data?.error,
            },
          };
          reportStore.pushEvents({
            ctime: new Date().getTime(),
            event_desc: "", // 事件中文
            event_id: REQUEST_NETWORK, // 事件英文
            type: ReportType.Monitor, // 类型
            platform: getPlatform(), // 渠道
            props: props,
            common: common,
            ext: null,
          });
        };
      }
    },
  });
}

/**
 * 页面级埋点事件
 */
export function interceptorPage() {
  const pageData = reactive({
    fullpath: "",
    pid: "",
    furl: "",
    enterTime: null,
    reportShow: false,
    reportHide: false,
  });

  const reset = () => {
    Object.assign(pageData, {
      fullpath: "",
      pid: "",
      furl: "",
      enterTime: null,
      reportShow: false,
      reportHide: false,
    });
  };

  const getPage = () => {
    const fullpath = getCurPage();
    const prevPage = getCurPage(2);
    if (fullpath) {
      pageData.fullpath = fullpath;
      pageData.pid = fullpath.split("?")[0];
      pageData.furl = prevPage;
      pageData.enterTime = new Date().getTime();
      pageData.reportShow = false;
      pageData.reportHide = false;
    }
  };

  const onLoad = () => {
    const reportStore = useReportStore();
    getPage();
    if (pageData.fullpath) {
      reportStore.setUserData({
        pid: pageData.pid,
        fullpath: pageData.fullpath,
        furl: pageData.furl,
      });
      report(PAGE_VIEW);
    }
  };

  const onShow = () => {
    if (pageData.fullpath) {
      if (!pageData.reportShow) {
        const dur = new Date().getTime() - pageData.enterTime;
        report(PAGE_VIEW_DUR, {
          dur: dur,
        });
      }
    } else {
      getPage();
    }
    pageData.reportShow = true;
  };

  const onHide = () => {
    if (pageData.fullpath && !pageData.reportHide) {
      const dur = new Date().getTime() - pageData.enterTime;
      report(PAGE_VIEW_STAY, {
        dur: dur,
      });
      reset();
    }
  };

  return {
    onLoad,
    onShow,
    onHide,
  };
}

/**
 * 初始化埋点
 */
export async function initReport() {
  const reportStore = useReportStore();
  const userStore = useUserStore();
  const deviceInfo = await getDeviceInfo();
  uni.log.info("deviceInfo-----", deviceInfo);
  // reportStore.clearEvents();
  reportStore.setDeviceInfo(deviceInfo);
  reportStore.setUserData({
    session_id: getSessionId(deviceInfo.device_id),
    p_channel: deviceInfo.p_channel,
    p_channel_id: deviceInfo.p_channel_id,
    p_campaign_id: deviceInfo.p_campaign_id,
    p_campaign_extra: deviceInfo.p_campaign_extra,
  });
  interceptorRequest();
  watch(
    () => userStore.userInfo,
    (values) => {
      reportStore.setUserData({
        uid: values?.uid,
      });
    },
    {
      deep: true,
      immediate: true,
    }
  );
}

export async function startReport() {
  startCheck();
}

export default Events;
