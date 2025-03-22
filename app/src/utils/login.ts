import { useUserStore } from "@/stores/user";
import { ChannelType } from "@/enums/common";
import { tabBarItems as appstoreTabBarItems } from "@/utils/app-audit/appstore";
import { tabBarItems as taotiaoTabBarItems } from "@/utils/app-audit/taotiao";
import { tabBarItems as androidTabBarItems } from "@/utils/app-audit/android";

export enum PlatformLoginPages {
  "APPSTORE" = "/pages/audit/appstore/login",
  "MP_TOUTIAO" = "/pages/audit/taotiao/login",
  "DEFAULT" = "/pages/login/index",
}

export enum PlatformHomePages {
  "APPSTORE" = "/pages/audit/appstore/home",
  "MP_TOUTIAO" = "/pages/audit/taotiao/home",
  "DEFAULT" = "/pages/home/index",
}

export const tabBarPageList = () => {
  const userStore = useUserStore();
  const appAuditInfo = userStore.appAuditInfo;
  let tabBarItems = [];
  if (appAuditInfo.channel === ChannelType.APPSTORE) {
    tabBarItems = appstoreTabBarItems;
  } else if (appAuditInfo.channel === ChannelType.MP_TOUTIAO) {
    tabBarItems = taotiaoTabBarItems;
  } else {
    tabBarItems = androidTabBarItems;
  }
  return tabBarItems.map((el) => el.pagePath);
};

export function checkIsBarPage(page: string): boolean {
  if (page) {
    const pagePaths = tabBarPageList();
    return pagePaths.some((el) => page.includes(el));
  }
  return false;
}

export function getCurPage(prevIndex = 1) {
  const page = getCurPageData(prevIndex);
  if (page) {
    return page?.$page?.fullPath;
  }
  return null;
}

export function getCurPageData(prevIndex = 1) {
  const pages = getCurrentPages();
  if (pages && pages.length > 0) {
    const page = pages[pages.length - prevIndex];
    return page;
  }
  return null;
}

export const routerPush = (url: string) => {
  if (checkIsBarPage(url)) {
    // tabbar页
    uni.switchTab({ url: url });
  } else {
    // 非tabbar页
    uni.navigateTo({ url: url });
  }
};

export function checkIsLogin(): boolean {
  const userStore = useUserStore();
  return userStore.userInfo?.uid;
}

export function toLogin(url: string) {
  const loginUrl = getLoginPageUrl();
  let params = "";
  if (url) {
    params = "?redirect_url=" + encodeURIComponent(url);
  }
  routerPush(loginUrl + params);
}

// 获取登录页地址
export const getLoginPageUrl = (): string => {
  const userStore = useUserStore();
  const appAuditInfo = userStore.appAuditInfo;

  if (appAuditInfo.channel === ChannelType.APPSTORE) {
    return PlatformLoginPages.APPSTORE;
  } else if (appAuditInfo.channel === ChannelType.MP_TOUTIAO) {
    return PlatformLoginPages.MP_TOUTIAO;
  } else {
    return PlatformLoginPages.DEFAULT;
  }
};

// 获取首页地址
export const getHomePageUrl = (): string => {
  const userStore = useUserStore();
  const appAuditInfo = userStore.appAuditInfo;

  if (appAuditInfo.channel === ChannelType.APPSTORE) {
    return PlatformHomePages.APPSTORE;
  } else if (appAuditInfo.channel === ChannelType.MP_TOUTIAO) {
    return PlatformHomePages.MP_TOUTIAO;
  } else {
    return PlatformHomePages.DEFAULT;
  }
};

// 登录页返回按钮
export function navigateBack(url: string) {
  const homePageUrl = getHomePageUrl();
  const loginPageUrl = getLoginPageUrl();
  console.log("url", url, homePageUrl, loginPageUrl);
  if (url) {
    if (loginPageUrl.includes(url)) {
      // 当上一页是登录页时，则跳转到首页
      routerPush(homePageUrl);
    } else {
      routerPush(url);
    }
  } else {
    const prevUrl = getCurPage(2);
    if (!prevUrl) {
      // 默认返回首页
      routerPush(homePageUrl);
    } else if (loginPageUrl.includes(prevUrl)) {
      // 当上一页是登录页时，则跳转到首页
      routerPush(homePageUrl);
    } else {
      uni.navigateBack();
    }
  }
}
