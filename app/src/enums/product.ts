export enum ProductStatus {
  ALL = null, // 全部
  AUDITING = 0, // 审核中
  NOT_APPROVED = 1, // 未通过
  ON_SALE = 2, // 在售中
  OFF_SALE = 3, // 已下架
  SOLD_OUT = 4, // 已出售
  TRADING = 5, // 交易中
}

export enum ProductTypeEnum {
  ACCOUNT = 1, // 账号 默认
  SECKILL = 2, //秒杀
  GUARANTEE = 3, // 担保交易
  VALUATION = 4, // 一键估价
  RECYCLE = 5, // 回收
}

export enum ProductLabelTypeEnum {
  LEAK = 1, // 捡漏
  HOT = 2, // 热门账号
  TOP = 3, // 顶级账号
  H5 = 4, // h5列表
}
export enum CollectionType {
  BROWSING = "browsing", // 足迹
  CONSULTATION = "consultation", // 商品咨询
}
