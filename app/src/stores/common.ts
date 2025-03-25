import * as pinia from "pinia";
import { isDev } from "@/utils/config";
import { platformGreementMap } from "@/utils/platform-greement";

export const useCommonStore = pinia.defineStore("common", {
  unistorage: true, // 是否持久化
  state: () => {
    return {
      openDebugger: isDev, // 是否打开控制台
      // openDebugger: true,
      platformGreementMap: platformGreementMap, // 平台协议
    };
  },
  // 也可以这样定义
  actions: {
    toggleDebugger(flag: boolean) {
      this.openDebugger = flag;
    },
    setPlatformGreement(data: { [key: string]: string }) {
      this.platformGreementMap = {
        ...this.platformGreementMap,
        ...data,
      };
    },
  },
});
