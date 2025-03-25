import * as pinia from "pinia";
import { has } from "lodash-es";

/**
 * tabBar 角标类型
 */
export enum TabBarType {
  BADGE = "BADGE", // 角标
  RED_DOT = "RED_DOT", // 红点
}

/**
 * tabBar 页面类型
 */
export enum PageType {
  HOME = "HOME", // 首页
  BUY = "BUY", // 买号
  SELL = "SELL", // 卖号
  IM = "IM", // 消息
  MY = "MY", // 我的
}

/**
 * tabBar 页面下标
 */
export enum TabBarBadgeType {
  HOME = 0, // 首页
  BUY = 1, // 买号
  SELL = 2, // 卖号
  IM = 3, // 消息
  MY = 4, // 我的
}

export const useTabBarStore = pinia.defineStore("tabBar", {
  unistorage: true, // 是否持久化
  state: () => {
    return {
      badgeStatus: {
        [PageType.HOME]: 0,
        [PageType.BUY]: 0,
        [PageType.SELL]: 0,
        [PageType.IM]: 0,
        [PageType.MY]: 0,
      },
    };
  },
  // 也可以这样定义
  actions: {
    setBadgeStatus(values) {
      this.badgeStatus = values;
    },
    clearBadgeStatus() {
      this.badgeStatus = {
        [PageType.HOME]: 0,
        [PageType.BUY]: 0,
        [PageType.SELL]: 0,
        [PageType.IM]: 0,
        [PageType.MY]: 0,
      };
    },
    setBadgeStatusByType(key: PageType, value: number | undefined) {
      console.log("setBadgeStatusByType: key=", key, "value=", value);
      if (has(this.badgeStatus, key)) {
        this.badgeStatus[key] = value || 0;
      } else {
        console.error(`setBadgeStatusByType: key=${key} 不存在`);
      }
    },
    clearBadgeStatusByType(key: PageType) {
      if (has(this.badgeStatus, key)) {
        this.badgeStatus[key] = 0;
      } else {
        console.error(`clearBadgeStatusByType: key=${key} 不存在`);
      }
    },
    // 获取未读消息数
    getMessageUnread() {
      const store = uni.$UIKitStore;
      if (store) {
        const unread = store?.uiStore?.sessionUnread || 0;
        console.log("unread----", unread);
        this.setBadgeStatusByType(PageType.IM, unread);
      }
    },
    // 获取议价未读消息数
    getBargainUnread() {
      this.setBadgeStatusByType(PageType.MY, 0);
    },
  },
});
