import type { userParams } from "./user";
import type { DeviceInfo } from "./fetch";
import type { ChargeMethods, TransferChannel } from "./order";
import { PayPanel } from "@/enums/common";

export interface GameItem {
  id: number;
  category_id: number;
  game_name: string;
  icon: string;
  sort: number;
  initial_key: string;
}

export interface AppAuditInfoProps {
  channel?: string;
  version?: string;
  status?: boolean;
}
export interface UserState {
  userInfo: userParams;
  platformCurrency: number;
  gameHistory: GameItem[];
  deviceInfo: DeviceInfo;
  messageMotification: boolean;
  personalized: boolean;
  appAudit: boolean;
  appAuditInfo: AppAuditInfoProps;
  payMethodData: {
    list: ChargeMethods[]; // 全部支付方式列表
    way3Charge: ChargeMethods[]; // 三方支付方式列表
    coinCharge: ChargeMethods[]; // 余额支付
    hasWay3Charge: boolean; // 是否有三方支付
    hasCoinCharge: boolean; // 是否有余额支付
  };
  balanceInfo: TransferChannel[];
  selectedPayMethod: {
    way3Charge: ChargeMethods;
    coinCharge: ChargeMethods;
  };
  currentPay: PayPanel;
  penaltyInfo: ChargeMethods[];
  remainingCount: Number;
  globalRemainingCount: Number;
}

export interface GameState {
  gameList: GameItem[];
  gameAllList: GameItem[];
  buyGameList: GameItem[];
  gameDetail: any;
}

export interface ProductData {
  id: number;
  uid: number;
  product_id: string;
  product_covert: string;
  game_id: number;
  game_name: string;
  status_type: number;
  onsell_type: number;
  product_type: number;
  screenshot_type: number;
  product_price: string;
  product_title: string;
  product_desc: string;
  created_at: number;
  product_account: string;
  user_phone: string;
  user_qq: string;
  user_wechat: string;
  goods_info: string;
  screenshot_info: string;
  produce_quantity: number;
  stock_count: number;
}
export interface ProductState {
  productList: ProductData[];
  lookingProduct: ProductData;
}

export interface MessageState {
  message: string;
  teamExt: any;
  isConected: number;
  loginCredential: any;
  productCardData: any;
  lastMsgs: any;
  teamQuickInquiryMenu: any;
  lastUsedPatTime: any;
  enterSessionTime: number;
  selfConsultationTid: string;
  operationPermissions: any;
  sessionMsgBtnKey: string;
  messageCardFieldLabel: any;
  pageScroll: number;
}
