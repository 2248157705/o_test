export enum ChannelType {
  HUIWEI = "HUIWEI", // 华为应用市场
  XIAOMI = "XIAOMI", // 小米应用商店
  HONOR = "HONOR", // 荣耀应用商店
  OPPO = "OPPO", // OPPO软件商店
  VIVO = "VIVO", // VIVO应用商店
  MEIZHU = "MEIZHU", // 魅族应用中心
  APPSTORE = "APPSTORE", // IOS
  MP_WEIXIN = "MP_WEIXIN", // 微信小程序
  MP_TAOTIAO = "MP_TAOTIAO", // 抖音小程序
  GW = "GW", // 官网
  BAIDU = "BAIDU", // 百度手机助手
  QQ = "QQ", // 应用宝
  COOLAPK = "COOLAPK", // 酷安
  "9_GAME" = "9_GAME", // 阿里分发平台
  "360" = "360", // 360手机助手
  OTHER = "OTHER", // 其它
  H5 = "H5", // H5
}

export enum ConifgCode {
  APP_AUDIT = "app_audit", // app审核配置
  APP_AUDIT_V2 = "app_audit_v2", // app审核配置v2
  CHARGE_METHOD = "charge_method", // 支付方法配置
  H5_CHARGE_METHOD = "h5_charge_method", // 支付方法配置
  TRANSFER_CHANNEL = "transfer_channel", // 提现方法配置
  HOME_SECKILL = "home_seckill", // app首页秒杀入口配置
  HOME_RAFFLE = "home_raffle", // app首页抽奖入口配置
  PENALTY_PAY_METHOD = "penalty_pay_method", //违约金支付
  H5_PAGE_AUDIT = "h5_page_audit", //h5页开关
}

/**
 * 上报渠道
 */
export enum ReportPlatform {
  ANDROID = "ANDROID",
  IOS = "IOS",
  MINI_PROGRAM = "MINI_PROGRAM",
  PC = "PC",
  WEB = "WEB",
  H5 = "H5",
}

/**
 * 上报类型
 */
export enum ReportType {
  EventReport = "EVENT_REPORT",
  Monitor = "MONITOR",
  ERROR = "ERROR",
}
/**
 * 支付类型
 */
export enum PayPanel {
  Other_PAY = "other_pay", //默认支付
  PENALTY_PAY = "PENALTY_PAY", //违约金支付
  MERCHANT_PAY = "MERCHANT_PAY", //号商支付
}

/**
 * 联系号商入口类型
 */
export enum MerchantContactEnter {
  PRODUCT_DETAILS = "PRODUCT_DETAILS", //商品详情
  MERCHANT_ADVERT = "MERCHANT_ADVERT", //号商广告
}

/**
 * 订单申请类型
 */
export enum ApplyOrderType {
  APPLY_ORDER_AFTER_SALE = 1, //申请售后
  APPLY_ORDER_REFUND = 2, //申请退款
  APPLY_ORDER_PAYMENT_CLAIM = 3, //申请理赔
}

/**
 * 应用储存
 */
export enum AppStoreKeys {
  BARGAIN_SELLER_KEY = "BARGAIN_SELLER_KEY", //收到出价
  BARGAIN_BUYER_KEY = "BARGAIN_BUYER_KEY", //砍价
}

/**
 * 议价消息状态
 */
export enum BargainMsgStatus {
  READ = "READ", //已读
  UNREAD = "UNREAD", //未读
}

/**
 * 议价类型
 */
export enum BargainType {
  SELLER = "SELLER", //出价
  BUYER = "BUYER", //砍价
}

/**
 * 议价消息类型
 */
export enum BargainUnReadEnums {
  BARGAIN_WAIT_SELLER = "BARGAIN_WAIT_SELLER", //议价我卖出的
  BARGAIN_WAIT_BUYER = "BARGAIN_WAIT_BUYER", //议价我的砍价
}
