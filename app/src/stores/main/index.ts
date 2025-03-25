import type { RankingObj } from "@/types/order";
import { getOrderRanking } from "@/api/order";
import { defineStore } from "pinia";

type Seckill = {
  code: string;
  title: string;
  activity_id: string;
  enable: boolean;
};
type PermissionPopup = {
  visible: boolean;
  text?: string;
};
type MainStore = {
  showToast: boolean;
  loading: boolean;
  showToastTime: any;
  showLoadingTime: any;
  toastMsg: string;
  yesterdaySum: number | string;
  ranking: RankingObj[];
  homeSeckill: Seckill;
  homeRaffle: Seckill;
  realPopupVisible: boolean;
  permissionPopup: PermissionPopup;
};
export const useMainStore = defineStore("main", {
  state: (): MainStore => ({
    showToast: false,
    loading: false,
    showToastTime: null,
    toastMsg: "",
    yesterdaySum: "",
    ranking: [],
    homeSeckill: {},
    homeRaffle: {},
    realPopupVisible: false,
    cameraPermissionPopupVisible: false,
  }),
  actions: {
    async getRanking() {
      const data = await getOrderRanking();
      this.ranking = data.list;
      this.yesterdaySum = data.yesterday_sum;
    },
    setHomeSeckill(data: Seckill) {
      this.homeSeckill = data;
    },
    setHomeRaffle(data: Seckill) {
      this.homeRaffle = data;
    },
    toast(msg: string) {
      clearTimeout(this.showToastTime);
      this.showToast = true;
      this.toastMsg = msg;
      this.showToastTime = setTimeout(() => {
        this.showToast = false;
        clearTimeout(this.showToastTime);
      }, 2000);
    },
    showLoading() {
      this.loading = true;
    },
    clearToast() {
      this.showToast = false;
      clearTimeout(this.showToastTime);
    },
    hideLoading() {
      this.loading = false;
    },
    toggleRealPopup(bool: boolean) {
      this.realPopupVisible = bool;
    },
    setPermissionPopup(data: PermissionPopup) {
      this.permissionPopup = data;
    },
  },
});
