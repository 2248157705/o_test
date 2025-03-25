import { AppStoreKeys, BargainMsgStatus, BargainType } from "@/enums/common";
import { checkIsBarPage, getCurPage } from "@/utils/login";

export const getStoreWithKey = (key) => {
  const objStr = uni.getStorageSync(key);
  let obj = {};
  if (objStr) {
    try {
      obj = JSON.parse(objStr);
    } catch (e) {
      console.log("error getStoreWithKey");
    }
  }
  return obj;
};

export const markBargainMsgUnRead = (bargainNo, type) => {
  const storeKey =
    type === BargainType.SELLER
      ? AppStoreKeys.BARGAIN_SELLER_KEY
      : AppStoreKeys.BARGAIN_BUYER_KEY;
  const bargainSell: [string: string] = getStoreWithKey(storeKey);
  // const bargainStatus = bargainSell[bargainNo];
  // if (!bargainStatus) {
  bargainSell[bargainNo] = BargainMsgStatus.UNREAD;
  uni.setStorageSync(storeKey, JSON.stringify(bargainSell));
  // }
};

export const reloadBargainMsgUnread = (type: BargainType) => {
  const storeKey =
    type === BargainType.SELLER
      ? AppStoreKeys.BARGAIN_SELLER_KEY
      : AppStoreKeys.BARGAIN_BUYER_KEY;
  const bargainSell = getStoreWithKey(storeKey);
  let sellerCount = 0;
  for (const bargainKey in bargainSell) {
    const bargainVal = bargainSell[bargainKey];
    if (bargainVal && bargainVal === BargainMsgStatus.UNREAD) {
      sellerCount++;
    }
  }
  return sellerCount;
};
// Seller
export const setBargainMsgAllRead = (type: BargainType) => {
  const storeKey =
    type === BargainType.SELLER
      ? AppStoreKeys.BARGAIN_SELLER_KEY
      : AppStoreKeys.BARGAIN_BUYER_KEY;
  const bargainSell = getStoreWithKey(storeKey);
  for (const bargainKey in bargainSell) {
    bargainSell[bargainKey] = BargainMsgStatus.READ;
  }
  uni.setStorageSync(storeKey, JSON.stringify(bargainSell));
};

//我的角标
export const setUserUnread = (unread: number) => {
  const page = getCurPage();
  if (checkIsBarPage(page)) {
    if (unread === 0) {
      uni.removeTabBarBadge({
        index: 4,
      });
    } else {
      uni.setTabBarBadge({
        index: 4,
        text: unread > 99 ? "99+" : unread.toString(),
      });
    }
  }
};
