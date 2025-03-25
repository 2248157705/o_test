import type { DeviceInfo, ReportEventList } from "@/types/report";
import * as pinia from "pinia";

export const useReportStore = pinia.defineStore("report", {
  unistorage: {
    paths: ["isFirstInstall", "events", "deviceInfo", "userData"],
  },
  state: () => {
    return {
      isFirstInstall: true,
      events: [],
      maxEventsToSend: 10, // 达到这个数量时上报
      maxEventsPerBatch: 20, // 每次上报的最大数量
      checkInterval: 10000, // 设置间隔时间(s)检查时间
      deviceInfo: {},
      userData: {
        uid: "",
        session_id: "",
        pid: "",
        fullpath: "",
        furl: "",
        campaign_id: "",
        campaign_extra: {},
        p_channel: "",
        p_channel_id: "",
        p_campaign_id: "",
        p_campaign_extra: {},
      },
      userImData: {
        launch_time: {
          init_success: 0, // 初始化成功时间
          login_success: 0, // 登录成功时间
          disconnect: 0, // 断开连接时间
          enter_chat: 0, // 进入群聊时间
        },
      },
    };
  },
  actions: {
    setMaxEventsToSend(n: number) {
      this.maxEventsToSend = n;
    },
    setCheckInterval(n: number) {
      this.checkInterval = n;
    },
    setUserData(values) {
      this.userData = Object.assign(this.userData, values);
    },
    setDeviceInfo(values: DeviceInfo) {
      this.deviceInfo = Object.assign(this.deviceInfo, values);
    },
    setEvents(arr: ReportEventList[]) {
      this.events = arr;
    },
    pushEvents(value: ReportEventList) {
      this.events.push(value);
    },
    clearEvents() {
      this.events = [];
    },
    setIMLaunchTime(values) {
      this.userImData.launch_time = Object.assign(
        this.userImData.launch_time,
        values
      );
    },
    setInstallStatus(value: boolean) {
      this.isFirstInstall = value;
    },
  },
});
