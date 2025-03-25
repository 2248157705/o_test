import type { MessageState } from "@/types/store";
import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user";

export enum ConectedStatus {
  YES = 1, // 已登录
  NO = 0, // 未登录
}

export enum NetworkStatus {
  ONLINE = "ONLINE", // 网络正常
  OFFLINE = "OFFLINE", // 网络不可用
}

export enum PaymentStatus {
  PAYED = "PAYED", // 支付
  REFUND = "REFUND", // 拒绝
}

export enum ConfirmStatus {
  AGREE = "AGREE", // 同意
  REFUND = "REFUND", // 拒绝
}

export const useMessageStore = defineStore("message", {
  // unistorage: true,
  unistorage: {
    paths: [
      "loginCredential",
      "lastUsedPatTime",
      "selfConsultationTid",
      "operationPermissions",
      "serviceSessionRes",
      "sessionMsgBtnKey",
    ], // 需要缓存的路径，这里设置 foo 和 nested 下的 data 会被缓存
  },
  state: (): MessageState => ({
    message: "message",
    teamExt: {},
    networkStatus: NetworkStatus.ONLINE,
    isConected: ConectedStatus.NO, // 0: 退登，1： 连接成功
    loginCredential: null,
    productCardData: {}, // 商品卡片数据
    lastMsgs: {},
    teamQuickInquiryMenu: null,
    lastUsedPatTime: {}, // 最后使用催一催时间
    selfConsultationTid: "", //咨询群id
    operationPermissions: {}, // 卡片按钮权限
    sessionMsgBtnKey: "", // 会话按钮KEY
    messageCardFieldLabel: [],
    pageScroll: 0,
    serviceSessionRes: {
      sessionList: [], // 会话列表
    },
    chatMsgStatus: {
      enter: [], // 录入商品
      payment: null, // 支付 PaymentStatus
      payment_penalty: false, // 支付违约金
      order_refund: null, // 商品退款 ConfirmStatus
      confirm_receipt: false, // 确认收货
      contract_seller: false, // 卖家签署合同
      contract_buyer: false, // 买家签署合同
      confirm_info_buyer: [], // 买家确认信息
    },
  }),
  actions: {
    setServiceSessionRes(arr: any[]) {
      this.serviceSessionRes = {
        sessionList: arr,
      };
    },
    resetServiceSessionRes() {
      this.serviceSessionRes = {
        sessionList: [],
      };
    },
    setMessageCardFieldLabel(data: any) {
      this.messageCardFieldLabel = data || [];
    },
    setOperationPermissions(type, flag: boolean = true) {
      if (
        this.sessionMsgBtnKey &&
        this.sessionMsgBtnKey.indexOf("undefined") < 0
      ) {
        const userStore = useUserStore();
        const key = `${userStore.userInfo?.account}_${this.sessionMsgBtnKey}`;
        this.operationPermissions[key] = flag;
      }
    },
    // 退出登录重新赋值
    setOperationPermissionsAfresh(data: any) {
      this.operationPermissions = data;
    },
    removeOperationPermissions() {
      this.operationPermissions = {};
    },
    setSessionMsgBtnKey(key: string) {
      this.sessionMsgBtnKey = key;
    },
    setSelfConsultationTid(tid: string) {
      this.selfConsultationTid = tid;
    },
    setLastUsedPatTime(data: any) {
      this.lastUsedPatTime = data;
    },
    setTeamQuickInquiryMenu(data: any) {
      this.teamQuickInquiryMenu = data;
    },
    setLastMsgs(lastMsgs: any) {
      this.lastMsgs = lastMsgs;
    },
    setMessage(data: any) {
      this.message = data;
    },
    setProductCard(data: any) {
      this.productCardData = data;
    },
    setTeamExt(data: any) {
      console.log("setTeamExt----", data);
      this.teamExt = data;
    },
    setIsConected(isConected: ConectedStatus) {
      this.isConected = isConected;
    },
    setLoginCredential(loginCredential: any) {
      this.loginCredential = loginCredential;
    },
    removeLoginCredential() {
      this.isConected = ConectedStatus.NO;
      this.loginCredential = null;
      this.selfConsultationTid = "";
      // 不清除消息卡片按钮权限
      this.setOperationPermissionsAfresh(this.operationPermissions);
      uni.$UIKitStore?.destroy();
      uni.$UIKitNIM?.destroy();
      uni.$UIKitNIM?.disconnect();

      uni.$UIKitNIM = null;
      uni.$UIKitStore = null;
    },
    setNetworkStatus(status: NetworkStatus) {
      this.networkStatus = status;
    },
    setChatMsgStatus(values) {
      this.chatMsgStatus = values;
    },
    clearChatMsgStatus() {
      this.chatMsgStatus = {
        enter: [], // 录入商品
        payment: null, // 支付 PaymentStatus
        payment_penalty: false, // 支付违约金
        order_refund: null, // 商品退款 ConfirmStatus
        confirm_receipt: false, // 确认收货
        contract_seller: false, // 卖家签署合同
        contract_buyer: false, // 买家签署合同
        confirm_info_buyer: [], // 买家确认信息
      };
    },
  },
  getters: {
    getOperationPermissions: (state) => (_key) => {
      try {
        const userStore = useUserStore();
        const key = `${userStore.userInfo?.account}_${_key}`;
        return state.operationPermissions[key];
      } catch (error) {
        console.error("error", error);
        return false;
      }
    },
  },
});
