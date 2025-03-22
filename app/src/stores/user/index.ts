import type { UserState, GameItem, AppAuditInfoProps } from "@/types/store";
import type { userParams } from "@/types/user";
import { defineStore } from "pinia";
import { isArray, isObject, find } from "lodash-es";
import { getPayMethod } from "@/pages/order/js/get-pay-method";
import { ConifgCode, PayPanel } from "@/enums/common";
import { useMainStore } from "@/stores/main";
import {
  checkIdCardVerify,
  collectionProduct,
  delCollectionProduct,
  getJavaMyInfo,
  getMyInfo,
  judgeWhetherCollectionProduct,
  getJavaMyInfoV2,
} from "@/api/user";
import { getConfigByCodes } from "@/api/order";
import { setUserUnread } from "@/utils/storage/msg";
import {
  removeLoginCredential,
  removeUserInfoByNim,
} from "@/components/im/chat/message/card/js/nim";

const requestStatus = {
  configLoading: false,
};

export const useUserStore = defineStore("user", {
  unistorage: true, // 是否持久化
  state: (): UserState => ({
    loading: true, // 页面加载
    userInfo: null,
    platformCurrency: 0,
    gameHistory: [],
    // 商品支付方式列表
    payMethodData: {
      list: [], // 支付方式列表
      way3Charge: [], // 三方支付方式列表
      coinCharge: [], // 余额支付
      hasWay3Charge: false, // 是否有三方支付
      hasCoinCharge: false, // 是否有余额支付
    },
    // 商品默认支付方式
    selectedPayMethod: {
      coinCharge: {}, // 余额支付
      way3Charge: {}, // 三方支付
    },
    // 违约金支付方式列表
    penaltyMethodData: {
      list: [], // 支付方式列表
      way3Charge: [], // 三方支付方式列表
      coinCharge: [], // 余额支付
      hasWay3Charge: false, // 是否有三方支付
      hasCoinCharge: false, // 是否有余额支付
    },
    // 违约金默认支付方式
    selectedPenaltyMethod: {
      coinCharge: {}, // 余额支付
      way3Charge: {}, // 三方支付
    },

    balanceInfo: [], // 提现方式列表
    messageMotification: true, // 是否开启消息推送
    personalized: true,
    appAudit: true,
    appAuditInfo: {
      channel: "",
      version: "",
      status: null,
    },
    isFloatChat: true, //悬浮聊天
    appStoreReview: false, //AppStore审核
    currentPay: PayPanel.Other_PAY, //当前支付
    penaltyInfo: [], //违约金支付列表
    penaltyCB: null, //违约金支付回调
    //号商支付参数
    merchantPayInfo: {},
    remainingCount: 0,
    globalRemainingCount: 0,
    zPagingTo: false,
    togglePreview: false,

    bargainSellerUnread: 0, //收到出价未读数
    bargainBuyerUnread: 0, //砍价未读数
    userUnread: 0, //用户未读数
  }),
  actions: {
    async init() {
      if (!this.userInfo) return;
      if (!this.userInfo.true_name) {
        const card = await checkIdCardVerify({
          uid: this.userInfo.uid,
        }).catch((err) => {
          console.log(err);
        });
        if (card) {
          this.userInfo.true_name = card.true_name;
          this.userInfo.identifyNum = card.identity;
        }
      }
      const info = await getMyInfo();
      if (info && this.userInfo) {
        this.userInfo.user_collection = info.user_collection;
        this.userInfo.consultation_number = info.consultation_number;
        this.userInfo.browsing_number = info.browsing_number;
        this.userInfo.user_contract = info.user_contract;
        this.userInfo.user_product = info.user_product;
        this.userInfo.avatar = info.avatar;
        this.userInfo.nickname = info.nickname || "这家伙很懒";
      }
      this.getUserWalletInfo();
    },

    async getUserWalletInfo() {
      const javaInfo = await getJavaMyInfo();
      if (javaInfo) {
        this.userInfo.user_order = javaInfo.order_statistic_resp.order_total;
        this.userInfo.user_buy_num = javaInfo.order_bargain_resp.buy_num;
        this.userInfo.user_seller_num = javaInfo.order_bargain_resp.seller_num;
        this.platformCurrency = javaInfo.balance_resp.usable_balance;
        // this.platformCurrency = 10;
      }
    },

    async getPayConfig() {
      if (requestStatus.configLoading) {
        return;
      }
      requestStatus.configLoading = true;
      const res = await getConfigByCodes([
        ConifgCode.HOME_SECKILL,
        ConifgCode.CHARGE_METHOD,
        ConifgCode.TRANSFER_CHANNEL,
        ConifgCode.HOME_RAFFLE,
        ConifgCode.PENALTY_PAY_METHOD,
      ]).catch((err) => {
        requestStatus.configLoading = false;
        console.log("getConfig", err);
      });
      if (res) {
        const {
          charge_method,
          transfer_channel,
          home_seckill,
          home_raffle,
          penalty_pay_method,
        } = res;

        // 商品支付
        if (charge_method && charge_method.charge_methods) {
          const payMethodData = getPayMethod(charge_method.charge_methods);
          // console.log("payMethodData", payMethodData);
          this.payMethodData.list = payMethodData.payMethodList;
          this.payMethodData.way3Charge = payMethodData.way3Charge;
          this.payMethodData.coinCharge = payMethodData.coinCharge;
          this.payMethodData.hasWay3Charge = payMethodData.hasWay3Charge;
          this.payMethodData.hasCoinCharge = payMethodData.hasCoinCharge;

          this.selectedPayMethod.way3Charge =
            payMethodData.selectedPayMethod.way3Charge;
          this.selectedPayMethod.coinCharge =
            payMethodData.selectedPayMethod.coinCharge;
        }

        // 违约金支付
        if (penalty_pay_method && penalty_pay_method.charge_methods) {
          const payMethodData = getPayMethod(penalty_pay_method.charge_methods);
          this.penaltyMethodData.list = payMethodData.payMethodList;
          this.penaltyMethodData.way3Charge = payMethodData.way3Charge;
          this.penaltyMethodData.coinCharge = payMethodData.coinCharge;
          this.penaltyMethodData.hasWay3Charge = payMethodData.hasWay3Charge;
          this.penaltyMethodData.hasCoinCharge = payMethodData.hasCoinCharge;

          this.selectedPenaltyMethod.way3Charge =
            payMethodData.selectedPayMethod.way3Charge;
          this.selectedPenaltyMethod.coinCharge =
            payMethodData.selectedPayMethod.coinCharge;
        }

        if (transfer_channel) {
          this.balanceInfo = transfer_channel.transfer_methods.filter(
            (el) => el.status
          );
        }

        if (home_seckill) {
          const mainStore = useMainStore();
          mainStore.setHomeSeckill(home_seckill);
        }
        if (home_raffle) {
          const mainStore = useMainStore();
          mainStore.setHomeRaffle(home_raffle);
        }
      }
      requestStatus.configLoading = false;
    },

    async getMyInfoV2(data: any) {
      const info = await getJavaMyInfoV2(data);
      if (info.order_bargain_resp) {
        this.userInfo.globalRemainingCount =
          info.order_bargain_resp.global_remaining_count;
        this.userInfo.remainingCount = info.order_bargain_resp.remaining_count;
      }
      if (info.order_unread_resp) {
        this.setBargainSellerUnread(
          Number(info.order_unread_resp.bargain_wait_seller)
        ); //出价
        this.setBargainBuyerUnread(
          Number(info.order_unread_resp.bargain_wait_buyer)
        ); //砍价
      }
    },

    //议价卖家
    setBargainSellerUnread(data: number) {
      this.bargainSellerUnread = data;
      this.setUserTabUnread();
    },
    //议价买家
    setBargainBuyerUnread(data: number) {
      this.bargainBuyerUnread = data;
      this.setUserTabUnread();
    },
    setUserTabUnread() {
      const userUnread =
        Number(this.bargainSellerUnread) + Number(this.bargainBuyerUnread);
      this.userUnread = userUnread;
      setUserUnread(userUnread);
    },

    setPenaltyInfo(data: []) {
      this.penaltyInfo = data;
    },

    setMerchantPayInfo(data: any) {
      this.merchantPayInfo = data;
    },
    setCurrentPay(data: PayPanel) {
      this.currentPay = data;
    },

    setFloatChat(data: boolean) {
      this.isFloatChat = data;
    },
    setAppStoreReview(data: boolean) {
      this.appStoreReview = data;
    },
    setAppAudit(flag: boolean) {
      this.appAudit = flag;
    },
    setAppAuditInfo(data: AppAuditInfoProps) {
      this.appAuditInfo = data;
    },
    setLoading(data: boolean) {
      this.loading = data;
    },
    setUserInfo(data: userParams) {
      // 判断当前登录用户与上次登录用户是否一致，不一致清除缓存
      if (data && this.uid && this.uid !== data.uid) {
        removeUserInfoByNim();
      }
      this.userInfo = data;
      uni.setStorageSync("token", data.token);
    },
    setIdentifyNum({ true_name, identifyNum }) {
      this.userInfo.true_name = true_name;
      this.userInfo.identifyNum = identifyNum;
    },
    setGameHistory(data: GameItem | []) {
      if (isArray(data)) {
        this.gameHistory = data;
        return;
      }
      if (isObject(data)) {
        const item = find(this.gameHistory, (game) => game.id == data.id);
        if (item) {
          this.gameHistory.sort((a, b) => {
            if (a.id === item.id) return -1;
            if (b.id === item.id) return 1;
            return 0;
          });
        } else {
          this.gameHistory.unshift(data);
        }
      }
    },
    async setCollectionProduct(product_id) {
      return await collectionProduct({
        product_id,
        device_info: this.userInfo.device_info,
      });
    },
    async delCollectionProduct(product_id) {
      return await delCollectionProduct({
        product_id,
        device_info: this.userInfo.device_info,
      });
    },
    async judgeWhetherCollectionProduct(product_id) {
      return await judgeWhetherCollectionProduct({
        product_id,
        device_info: this.userInfo.device_info,
      });
    },
    logOut() {
      this.userInfo = null;
      this.platformCurrency = 0;
      uni.clearStorageSync();
      removeLoginCredential();
    },
    setMessageMotification(data: boolean) {
      this.messageMotification = data;
    },
    setPersonalized(data: boolean) {
      this.personalized = data;
    },
  },
});
