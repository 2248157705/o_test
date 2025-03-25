import { useCommonStore } from "@/stores/common";
import { useUserStore } from "@/stores/user/";
import { platformGreementMap } from "@/utils/platform-greement";
import checkUpdate from "@/pages/upgrade-popup/utils/check-update";

export const tabBarItems = [
  {
    pagePath: "pages/home/index",
    text: "首页",
    iconPath: "static/images/tabber/home.png",
    selectedIconPath: "static/images/tabber/home-active.png",
    visible: true,
  },
  {
    pagePath: "pages/buy-account/index",
    text: "买号",
    iconPath: "static/images/tabber/buy.png",
    selectedIconPath: "static/images/tabber/buy-active.png",
    visible: true,
  },
  {
    pagePath: "pages/sell-account/index",
    text: "卖号",
    visible: false,
  },
  {
    pagePath: "pages/message/index",
    text: "消息",
    iconPath: "static/images/tabber/message.png",
    selectedIconPath: "static/images/tabber/message-active.png",
    visible: true,
  },
  {
    pagePath: "pages/my/index",
    text: "我的",
    iconPath: "static/images/tabber/my.png",
    selectedIconPath: "static/images/tabber/my-active.png",
    visible: true,
  },
];

export function Android_Audit() {
  const commonStore = useCommonStore();
  const userStore = useUserStore();
  commonStore.setPlatformGreement(platformGreementMap);
  setTabBarItems();
  uni.setTabBarStyle({
    midButton: {
      width: "80px",
      height: "83px",
      text: "卖号",
      iconWidth: "70px",
      iconPath: "static/images/tabber/mid-button-icon.png",
      selectedIconPath: "static/images/tabber/mid-button-icon.png",
    },
  });
  uni.reLaunch({
    url: "/pages/home/index",
    complete: () => {
      userStore.setLoading(false);
      uni.showTabBar();
      checkUpdate();
    },
  });
}

/**
 * 设置tabbar
 */
function setTabBarItems() {
  tabBarItems.forEach((el, index) => {
    uni.setTabBarItem({
      index: index,
      text: el.text,
      pagePath: el.pagePath,
      iconPath: el.iconPath,
      selectedIconPath: el.selectedIconPath,
      visible: el.visible,
    });
  });
}
