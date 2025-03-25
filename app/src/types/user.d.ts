import type { DeviceInfo } from "./fetch";

export interface userParams {
  phone: string;
  account: string;
  dashboard_id: string;
  extend1: string;
  is_bind_phone: number;
  is_svip: number;
  login_time: number;
  platform_currency: number;
  register_time: number;
  social_account: string;
  social_avatar: string;
  social_type: string;
  avatar?: string;
  source: number;
  token: string;
  uid: number;
  vip_end_time: number;
  true_name: string;
  identifyNum: string;
  device_info: DeviceInfo;
  user_collection: number;
  user_contract: number;
  user_product: number;
  user_order: number;
  user_buy_num: number;
  user_seller_num: number;
  consultation_number: number;
  browsing_number: number;
}

export interface idCardVerifyReq {
  userName: string;
  identifyNum: string;
  uid: string;
}

export interface CollectionProductReq {
  product_id: string;
  device_info: DeviceInfo;
}

export interface CollectionListReq {
  page: string;
  per_page: string;
  sort_field: string;
  sort_direction: string;
  device_info: DeviceInfo;
}
export interface CollectionListRes {
  page: number;
  per_page: number;
  total: number;
  data: {
    product_id: string;
    uid: number;
    created_at: number;
    product_covert?: any;
    product_title: string;
    product_price: string;
    status_type: number;
  };
}

export interface RecordReq {
  page: number;
  per_page: number;
  device_info: DeviceInfo;
}

export interface MyWalletRes {
  uid: string;
  currency: string;
  usableBalance: string;
  freezeBalance: string;
  status: "NORMAL" | "FREEZE";
}

export interface DeviceInfo {
  device_id?: string;
  client_os?: string;
  client_name?: string;
  client_system?: string;
  app_client_version?: string;
  network_type?: string;
}

export interface MyInfoRes {
  uid: number;
  nickname?: any;
  avatar?: any;
  phone: string;
  user_collection: number;
  user_contract: number;
  user_product: number;
}

export interface BalanceList {
  /**
   * 时间
   */
  created_at: number;
  /**
   * 货币类型:1RMB
   */
  currency_type: number;
  /**
   * 变更数量
   */
  modify_count: number;
  /**
   * 变更类型:0减少,1增加
   */
  modify_type: number;
  /**
   * 关联订单id,没有特殊场景不用展示
   */
  order_id: string;
  /**
   * 备注
   */
  remarks: string;
  /**
   * 场景:1-充值、2-提现、3-卖商品
   */
  scene: number;
}
export interface BalanceRecordRes {
  data: BalanceList[];
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页条数
   */
  per_page: number;
  /**
   * 总条数
   */
  total: number;
}
export interface WithdrawalList {
  /**
   * 金额(元)
   */
  amount: number;
  /**
   * 时间
   */
  created_at: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 状态:0提现中,2提现成功,3提现失败
   */
  status: number;
  /**
   * 提现订单id
   */
  transfer_order_id: string;
}

export interface BalanceRecordRes {
  data: BalanceList[];
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页条数
   */
  per_page: number;
  /**
   * 总条数
   */
  total: number;
}
export interface WithdrawalRecordRes {
  data: WithdrawalList[];
  /**
   * 当前页
   */
  page: number;
  /**
   * 每页条数
   */
  per_page: number;
  /**
   * 总条数
   */
  total: number;
}

export interface BindPayAccountReq {
  /**
   * 应用id
   */
  app_id: string;
  /**
   * 绑定账号:1默认
   */
  bind_pay_account: number;
  /**
   * code
   */
  code: string;
  device_info?: DeviceInfo;
  /**
   * 来源:微信WEIXIN
   */
  source: string;
}

export interface BindPayAccountRes {}

export interface idCardVerifyReq {
  userName: string;
  identifyNum: string;
  uid: string;
}

export interface ContractRes {
  id: number;
  order_id: string;
  product_id: string;
  product_account: string;
  game_id: number;
  sign_task_id: string;
  created_at: number;
  buyer_name: string;
  seller_name: string;
  game_name: string;
  game_icon: string;
  sign_type: number;
}
export interface ContractInfoRes {
  id: number;
  order_id: string;
  product_id: string;
  product_account: string;
  game_id: number;
  sign_task_id: string;
  seller_id: number;
  buyer_id: number;
  created_at: number;
  seller_sign_time?: any;
  buyer_sign_time?: any;
  buyer_name: string;
  seller_name: string;
  game_name: string;
}

export interface unBindPayAccountRes {
  app_id: string;
  device_info: any;
  account_source: string;
}
export interface MerchantUserListRes {
  game_id: string;
  page: string;
  per_page: string;
}

export interface MerchantUserListReq {
  nickname: string;
  avatar: string;
  merchant_name: string;
  uid: number;
  position_title: string;
  position_subtitle: string;
}
export interface FeedbackReq {
  /**
   * 被投诉对象类型，提交类型为2时必填
   */
  defendant_type?: string;
  /**
   * 被投诉对象id
   */
  defendant_uid?: string;
  /**
   * 类型:1保险问题,2活动,3服务响应效率,4售前,5售后,6其他问题
   */
  feedback_type: number;
  /**
   * 提问
   */
  problem: string;
  /**
   * 提问用户,没登录传0
   */
  problem_uid: number;
  /**
   * 提交类型：1意见反馈,2投诉服务
   */
  submit_type: number;
}

export interface GetServiceStaffListReq {
  /**
   * 服务人员类型
   */
  staff_type: number; // 1 | 2
}

export interface GetFeedbackTypeListReq {
  /**
   * 服务人员类型
   */
  submit_type: number; // 1 | 2
}
