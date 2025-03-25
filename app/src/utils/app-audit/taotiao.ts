import { useCommonStore } from "@/stores/common";
import { useUserStore } from "@/stores/user/";
import { taotiaoGreementMap } from "@/utils/platform-greement";

export const tabBarItems = [
  {
    pagePath: "pages/audit/taotiao/home",
    text: "首页",
    iconPath: "static/images/tabber/home.png",
    selectedIconPath: "static/images/tabber/home-active.png",
    visible: true,
  },
  {
    pagePath: "pages/audit/taotiao/security-center",
    text: "安全中心",
    iconPath: "static/images/tabber/buy.png",
    selectedIconPath: "static/images/tabber/buy-active.png",
    visible: true,
  },
  {
    pagePath: "pages/audit/taotiao/order",
    text: "订单中心",
    iconPath: "static/images/tabber/order.png",
    selectedIconPath: "static/images/tabber/order-active.png",
    visible: true,
  },
  {
    pagePath: "pages/message/index",
    text: "消息",
    iconPath: "static/images/tabber/message.png",
    selectedIconPath: "static/images/tabber/message-active.png",
    visible: true,
  },
  {
    pagePath: "pages/audit/taotiao/my",
    text: "我的",
    iconPath: "static/images/tabber/my.png",
    selectedIconPath: "static/images/tabber/my-active.png",
    visible: true,
  },
];

export function Taotiao_Audit() {
  const commonStore = useCommonStore();
  const userStore = useUserStore();
  commonStore.setPlatformGreement(taotiaoGreementMap);
  setTabBarItems();
  uni.setTabBarStyle({
    midButton: {},
  });
  uni.reLaunch({
    url: "/pages/audit/taotiao/home",
    complete: () => {
      userStore.setLoading(false);
      uni.showTabBar();
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
