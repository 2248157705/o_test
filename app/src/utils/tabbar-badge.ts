import { watch } from "vue";
import { checkIsBarPage, getCurPage } from "@/utils/login";
import {
  useTabBarStore,
  TabBarType,
  PageType,
  TabBarBadgeType,
} from "@/stores/tabBar";
import { useMessageStore } from "@/stores/message";

export const TabBarConfig = {
  [PageType.IM]: {
    type: TabBarType.BADGE,
  },
  // [PageType.MY]: {
  //   type: TabBarType.RED_DOT,
  // },
};

/**
 * 设置 tabBar 角标
 * @param {number} index - tabBar 项的索引，从 0 开始
 * @param {string} text - 角标显示的文本
 */
export function setTabBarBadge(index: number, text: string) {
  uni.setTabBarBadge({
    index,
    text,
    success() {
      console.log(`setTabBarBadge success: index=${index}, text=${text}`);
    },
    fail(err) {
      console.error(`setTabBarBadge fail: index=${index}, text=${text}`, err);
    },
  });
}

/**
 * 移除 tabBar 角标
 * @param {number} index - tabBar 项的索引，从 0 开始
 */
export function removeTabBarBadge(index: number) {
  uni.removeTabBarBadge({
    index,
    success() {
      console.log(`removeTabBarBadge success: index=${index}`);
    },
    fail(err) {
      console.error(`removeTabBarBadge fail: index=${index}`, err);
    },
  });
}

/**
 * 显示 tabBar 红点
 * @param {number} index - tabBar 项的索引，从 0 开始
 */
export function showTabBarRedDot(index: number) {
  uni.showTabBarRedDot({
    index,
    success() {
      console.log(`showTabBarRedDot success: index=${index}`);
    },
    fail(err) {
      console.error(`showTabBarRedDot fail: index=${index}`, err);
    },
  });
}

/**
 * 隐藏 tabBar 红点
 * @param {number} index - tabBar 项的索引，从 0 开始
 */
export function hideTabBarRedDot(index: number) {
  uni.hideTabBarRedDot({
    index,
    success() {
      console.log(`hideTabBarRedDot success: index=${index}`);
    },
    fail(err) {
      console.error(`hideTabBarRedDot fail: index=${index}`, err);
    },
  });
}
/**
 * 是否是 tabBar 页面
 * @returns
 */
export function isBarPage() {
  const page = getCurPage();
  const flag = checkIsBarPage(page);
  return flag;
}

export function TabBarBadgeUtil() {
  const tabBarStore = useTabBarStore();
  const messageStore = useMessageStore();

  let stopWatcher = null;

  // 设置 tabBar 角标
  const setBadge = (type: TabBarBadgeType, text: string) => {
    if (isBarPage()) {
      setTabBarBadge(type, text);
    } else {
      // console.warn("非 tabBar 页面");
    }
  };
  // 移除 tabBar 角标
  const removeBadge = (type: TabBarBadgeType) => {
    if (isBarPage()) {
      removeTabBarBadge(type);
    } else {
      // console.warn("非 tabBar 页面");
    }
  };
  // 清除全部 tabBar 角标
  const clearBadge = () => {
    if (isBarPage()) {
      Object.values(TabBarBadgeType).forEach((value) => {
        if (typeof value === "number") {
          // 过滤出数值
          removeTabBarBadge(value);
        }
      });
    } else {
      // console.warn("非 tabBar 页面");
    }
  };
  // 显示 tabBar 红点
  const showRedDot = (type: TabBarBadgeType) => {
    if (isBarPage()) {
      showTabBarRedDot(type);
    }
  };
  // 隐藏 tabBar 红点
  const hideRedDot = (type: TabBarBadgeType) => {
    if (isBarPage()) {
      hideTabBarRedDot(type);
    } else {
      // console.warn("非 tabBar 页面");
    }
  };

  const set = (key: PageType, value: number | undefined) => {
    const config = TabBarConfig[key];
    if (config.type === TabBarType.BADGE) {
      setBadge(TabBarBadgeType[key], value ? value.toString() : "");
    } else {
      showRedDot(TabBarBadgeType[key]);
    }
  };

  const remove = (key: PageType) => {
    const config = TabBarConfig[key];
    if (config.type === TabBarType.BADGE) {
      removeBadge(TabBarBadgeType[key]);
    } else {
      hideRedDot(TabBarBadgeType[key]);
    }
  };

  const checkBadge = () => {
    Object.keys(tabBarStore.badgeStatus).forEach((key: PageType) => {
      if (TabBarConfig[key]) {
        const value = tabBarStore.badgeStatus[key];
        const num = value > 99 ? "99+" : value.toString();
        if (value && value > 0) {
          set(key, num);
        } else {
          remove(key);
        }
      }
    });
  };

  const watchBadge = () => {
    stopWatcher = watch(
      () => tabBarStore.badgeStatus,
      () => {
        checkBadge();
      },
      {
        deep: true,
        immediate: true,
        flush: "post",
      }
    );
  };

  const load = () => {
    if (messageStore.isConected) {
      tabBarStore.getMessageUnread();
    } else {
      tabBarStore.setBadgeStatusByType(PageType.IM, 0);
    }
    watchBadge();
  };

  const unload = () => {
    stopWatcher();
  };

  return {
    load,
    unload,
    checkBadge,
    setBadge,
    removeBadge,
    clearBadge,
    showRedDot,
    hideRedDot,
  };
}
