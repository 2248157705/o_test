export enum OrderStatus {
  AFTER_SALE_COMPLETED = "AFTER_SALE_COMPLETED", // 售后成功
  AFTER_SALE_REJECTED = "AFTER_SALE_REJECTED", // 拒绝售后
  AFTER_SALE_REQUESTED = "AFTER_SALE_REQUESTED", // 售后中
  AFTER_SALE_PROCESSING = "AFTER_SALE_PROCESSING", // 售后处理已完结
  CLOSED = "CLOSED", // 交易关闭
  FINISHED = "FINISHED", // 交易完成
  INIT = "INIT", // 初始状态
  PAID = "PAID", // 已支付
  REFUND_COMPLETED = "REFUND_COMPLETED", // 已退款
  REFUND_REJECTED = "REFUND_REJECTED", // 退款拒绝
  REFUND_REQUESTED = "REFUND_REQUESTED", // 退款中
  SENDING = "SENDING", // 发货中
  UNPAID = "UNPAID", // 未支付
  WAIT_RECEIVE = "WAIT_RECEIVE", // 待收货
  WAIT_SEND = "WAIT_SEND", // 待发货
  CLAIMS_REQUESTED = "CLAIMS_REQUESTED", // 理赔处理中
  CLAIMS_PROCESSING = "CLAIMS_PROCESSING", // 理赔执行中
  CLAIMS_COMPLETED = "CLAIMS_COMPLETED", // 理赔完成
  CLAIMS_REJECTED = "CLAIMS_REJECTED", //理赔被拒绝
}

export enum PurchaseStatus {
  ORDER_DUPLICATE = 500301, // (500301, "重复下单"),
  ORDER_NOT_EXIST = 500302, // "订单不存在"),
  ORDER_STATUS_INCORRECT = 500303, //(500303, "订单状态不正确"),
  ORDER_AUTH_FAIL = 500304, //(500304, "订单无权限修改"),
  ORDER_HANDLE_FAIL = 500305, //(500305, "订单状态修改失败"),
  BUY_OWN_GOODS = 500306, //(500306, "不能购买自己的商品"),
}
export enum GoodsStatus {
  PRODUCT_NOT_EXIST = 500201, // (500201, "商品信息不存在"),
  PRODUCT_SOLD_OUT = 500202, //(500202, "商品已售罄"),
  DECREASE_PRODUCT_INVENTORY_FAIL = 500203, //(500203, "商品扣减库存失败"),
  PRODUCT_OUT_OF_STOCK = 500204, // (500204, "该商品暂无库存"),
}

/**
 * 支付方式
 */
export enum PaymentType {
  WX_APP = "WX_APP",
  WX_H5 = "WX_H5",
  ZFB_APP = "ZFB_APP",
  ZFB_H5 = "ZFB_H5",
  TCOIN = "TCOIN",
}

/**
 * 支付渠道
 */
export enum PaymentChannel {
  WHXLWLKJ_WX = "WHXLWLKJ_WX", // 武汉霄郦网络科技有限公司-微信
  GXPXSKKJ_ZFB = "GXPXSKKJ_ZFB", // 广西平行时空科技有限公司-支付宝正式环境
  GXPXSKKJ_ZFB_TEST = "GXPXSKKJ_ZFB_TEST", // 广西平行时空科技有限公司-支付宝测试沙箱环境
}

/**
 * 提现方式
 */
export enum ChannelType {
  WX = "WX",
  ZFB = "ZFB",
}

/**
 * 提现方式
 */
export enum TransChannel {
  WX = "WX",
  ZFB = "GXPXSKKJ_ZFB",
}

/**
 * 售后原因类型
 */
export enum RefundApplyType {
  NONE = 1, // 无理由
  NO_WANT = 2, // 不想要了
  SELLER_NO_DELIVER = 3, // 卖家不发货
  WANT_BUY_OTHER = 4, // 想买其他
  ACCOUNT_RETRIEVED = 21, // 账号被找回
  ACCOUNT_FROZEN = 22, // 账号被冻结
  ACCOUNT_BLOCKED = 23, // 账号被封禁
  REFUND_BY_CONSENSUS = 24, // 协商一致退款
  OTHER_REASON = 25, // 其他原因
}

/**
 * 议价状态
 */
export enum BargainStatus {
  WAIT_SELLER = "wait_seller", // 待卖家处理
  WAIT_BUYER = "wait_buyer", // 待买家处理
  BUY_AGREE = "buy_agree", // 买家已同意
  SELLER_AGREE = "seller_agree", // 卖家已同意
  SELLER_REFUSE = "seller_refuse", // 卖家已拒绝
  LAPSE = "lapse", // 失效
  FINISH = "finish", // 完成，议价单已失效
}

/**
 * 费率配置
 */
export enum RateConfigStatus {
  SERVICE_CHARGE = "SERVICE_CHARGE", // 寄售服务费
  PENALTY = "PENALTY", //违约金费率
  GUARANTEE = "GUARANTEE", // 保障金费率
  RECYCLING = "RECYCLING", // 回收
}
/**
 * 订单类型
 */
export enum OrderType {
  GUARANTEE = "GUARANTEE", // 担保订单
  NORMAL = "NORMAL", // 普通寄售订单
  RAFFLE = "RAFFLE", // 抽奖订单
  SECKILL = "SECKILL", // 秒杀订单
  RECYCLING = "RECYCLING", // 回收订单
}

/**
 * 支付状态
 */
export enum PayStatus {
  ING = "ING",
  SUCCESS = "SUCCESS",
  FAIL = "FAIL",
}

/**
 * 保险类型
 */
export enum InsuranceType {
  NO_BUY = "NO_BUY",
}

/**
 * 保险状态
 */
export enum InsuranceStatus {
  ON_SHELVES = "ON_SHELVES",
}
