import {
  OrderStatus,
  PaymentType,
  RefundApplyType,
  BargainStatus,
  ChannelType,
  TransChannel,
  RateConfigStatus,
} from "@/enums/order";

export interface OrderReq {
  order_id: string;
}

export interface OrderListReq {
  keyword?: string;
  orders?: {
    asc?: boolean;
    column?: string;
  }[];
  order_status?: OrderStatus[];
  page_no?: number;
  page_size?: number;
}

export interface ChargeMethods {
  code: PaymentChannel;
  name: string;
  payMethod: PaymentType;
  img: string;
  status: boolean;
}

export interface TransferChannel {
  channel_type: ChannelType;
  code: PaymentChannel;
  name: string;
  status: boolean;
}

export interface OrderListRes {}

export interface OrderPurchasePreviewReq {
  product_id: string;
}
export interface OrderPurchasePreviewRes {}

export interface OrderPurchaseReq {
  //优惠券Ids
  coupon_ids?: string[];
  //保险Id
  insurance_id?: number;
  product_id: string;
  //购买数量
  purchase_num?: number;
}
export interface OrderPurchaseRes {}

export interface PurchasePaymentReq {
  order_id: string;
  pay_method: PaymentType;
  pay_channel: PaymentChannel;
  wx_app_id?: string;
  wx_h5_info_type?: string;
  ext?: { [key: string]: any };
}

export interface PurchasePaymentV2Req {
  order_id: string;
  coin_charge_item?: {
    /**
     * 余额支付时候要传，可选
     */
    amount: number;
    /**
     * 支付参数拓展Json字段
     */
    ext?: { [key: string]: any };
    /**
     * 支付渠道
     */
    pay_channel: PaymentChannel;
    /**
     * 支付方式
     */
    pay_method: PaymentType;
  };
  way3_charge_item?: {
    /**
     * 余额支付时候要传，可选
     */
    amount: number;
    /**
     * 支付参数拓展Json字段
     */
    ext?: { [key: string]: any };
    /**
     * 支付渠道
     */
    pay_channel: PaymentChannel;
    /**
     * 支付方式
     */
    pay_method: PaymentType;
  };
}

export interface OrderPurchasePreviewRes {}

export interface UpdatePurchaseStatusReq {
  order_id: string;
  //修改订单的状态
  to_order_status: OrderStatus;
}
export interface UpdatePurchaseStatusRes {}

export interface PurchaseRefundApplyReq {
  //申请说明
  apply_desc?: string;
  order_id: string;
  //退款原因分类
  reason?: RefundApplyType;
}
export interface PurchaseRefundApplyRes {}

export interface CreateBalancePayoutsReq {
  //提现金额
  price: number;
  //真实姓名
  real_name?: string;
  identity?: string;
  channel_type: ChannelType;
  trans_channel: TransChannel;
}

export interface BalancePayoutsListReq {
  orders?: {
    //是否正序排列，默认 true
    asc?: boolean;
    //需要进行排序的字段
    column: string;
  }[];
  page?: number;
  per_page?: number;
}

export interface CreateOrderBargainReq {
  price: number;
  product_id: null;
}

export interface AgainOrderBargainReq {
  //议价单号
  bargain_no: string;
  price: number;
}

export interface HandleOrderBargainReq {
  bargain_no: string;
  //出价记录id
  bargain_record_id: string;
  //拒绝原因
  reason?: string;
  //处理状态
  status: string;
}

export interface OrderBargainDetailReq {
  bargain_no: string;
}

export interface OrderBargainListReq {
  bargain_status?: BargainStatus;
  orders?: {
    asc: boolean;
    //需要进行排序的字段
    column: string;
  }[];
  page?: number;
  // 1我收到的议价，2我发起的议价
  page_type?: number;
  per_page?: number;
}
export interface Product {
  id?: any;
  uid?: any;
  product_id?: string;
  product_covert: string;
  game_id?: number;
  game_name: string;
  status_type: number;
  onsell_type: number;
  product_type: number;
  screenshot_type: number;
  product_price: number;
  product_title: string;
  product_desc: string;
  product_account: string;
  user_phone: string;
  user_qq: string;
  user_wechat: string;
  goods_info: string;
  screenshot_info: string;
  produce_quantity?: any;
  stock_count?: any;
}

export interface Now_record {
  id: string;
  price: number;
  bidder: string;
  status: string;
  reason?: any;
  create_time: string;
  expiration_time: string;
}

export interface Record {
  id: string;
  price: number;
  bidder: string;
  status: string;
  reason?: any;
  create_time: string;
  expiration_time: string;
}

export interface Bid_history {
  now_record: Now_record;
  records: Record[];
}

export interface OrderBargainListRes {
  id: string;
  bargain_no: string;
  bargain_status: string;
  price: number;
  bidder: string;
  reason?: any;
  product: Product;
  seller_id: number;
  buyer_id: number;
  bid_history: Bid_history;
}

// 违约金订单发起付款
export interface OrderPenaltyPaymentRes {
  penaltyId: string;
  order_id: string;
    pay_method: PaymentType;
    pay_channel: PaymentChannel;
    wx_app_id?: string;
    wx_h5_info_type?: string;
    ext?: { [key: string]: any };
}

// 获取违约金订单状态
export interface OrderPenaltyStatusRes {
  orderId: string;
  id?: string;
}

// 排行榜
export interface RankingObj {
  game_id: string;
  game_name: string;
  icon: string;
  order_num: number;
}

export interface RankingRes {
  yesterday_sum: number;
  list: RankingObj[];
}

export interface RateConfigRes {
  order_id?: number;
  biz_type: RateConfigStatus;
}
export interface RateConfigReq {
  id: number;
  biz_type: RateConfigStatus;
  rate_formula: string;
  start_time: string;
  end_time: string;
  create_time: string;
  update_time: string;
  amount: number;
  rates_value: number;
}
