import { SeckillProductSkStatus } from "@/enums/product";

/**
 * SeckillActivityPageListReq
 */
export interface SeckillProductReq {
  /**
   * 活动id
   */
  activityId?: number | null;
  orders?: OrderItem[] | null;
  page?: number | null;
  perPage?: number | null;
  /**
   * 场次id
   */
  timeId?: number | null;
}

/**
 * com.yile.common.model.PageReq.OrderItem
 *
 * OrderItem
 */
export interface OrderItem {
  /**
   * 是否正序排列，默认 true
   */
  asc?: boolean | null;
  /**
   * 需要进行排序的字段
   */
  column?: null | string;
}

/**
 * ApiResponse«PageResponse«SeckillPurchaseResp»»
 */
export interface Response {
  code?: number | null;
  data?: PageResponseSeckillPurchaseResp;
  err?: null | string;
  msg?: null | string;
  requestId?: null | string;
}

/**
 * PageResponse«SeckillPurchaseResp»
 */
export interface PageResponseSeckillPurchaseResp {
  list?: SeckillPurchaseRes[] | null;
  total?: number | null;
}

/**
 * SeckillPurchaseResp
 */
export interface SeckillPurchaseRes {
  /**
   * 活动id
   */
  activityId?: number | null;
  /**
   * 商品ID
   */
  id?: number | null;
  /**
   * 原商品价
   */
  origPrice?: number | null;
  /**
   * 原商品id
   */
  origProductId?: null | string;
  /**
   * 秒杀商品标题
   */
  skName?: null | string;
  /**
   * 秒杀商品编号
   */
  skNo?: null | string;
  /**
   * 秒杀商品价格
   */
  skPrice?: number | null;
  /**
   * 秒杀商品状态
   */
  skStatus?: SeckillProductSkStatus;
  /**
   * 时间配置id
   */
  timeId?: number | null;
}
/**
 * com.yile.trade.core.model.req.seckill.SeckillActivityAppResp.TimeConfig
 *
 * TimeConfig
 */
export interface TimeConfig {
  /**
   * 活动id
   */
  activityId?: number | null;
  /**
   * 配置状态
   */
  configStatus?: null | string;
  /**
   * 结束时间
   */
  endTime?: null | string;
  id?: number | null;
  /**
   * 开始时间
   */
  startTime?: null | string;
  /**
   * 场次标题
   */
  timeTitle?: null | string;

  nowTimeId: string;
}

/**
 * SeckillActivityAppResp
 */
export interface SeckillActivityRes {
  /**
   * 结束时间
   */
  actEndTime?: null | string;
  /**
   * 活动名称
   */
  activityName?: null | string;
  /**
   * 活动编号
   */
  activityNo?: null | string;
  /**
   * 开始时间
   */
  actStartTime?: null | string;
  /**
   * 活动状态
   */
  actStatus?: ActStatus;
  /**
   * 活动配置状态
   */
  configStatus?: ConfigStatus;
  /**
   * 活动介绍 富文本
   */
  content?: null | string;
  /**
   * 创建时间
   */
  createTime?: null | string;
  /**
   * 预热开始时间
   */
  hotStartTime?: null | string;
  /**
   * 活动ID
   */
  id?: number | null;
  /**
   * 场次配置数组
   */
  timeList?: TimeConfig[] | null;
  /**
   * 最后更新时间
   */
  updateTime?: null | string;
}

/**
 * SeckillProductAddPurchaseResp
 */
export interface SeckillProductAddPurchaseRes {
  /**
   * Long orderId;
   */
  addPurchaseResp?: AddPurchaseResp;
}

/**
 * Long orderId;
 *
 * AddPurchaseResp
 */
export interface AddPurchaseResp {
  /**
   * @JsonSerialize(using = ToStringSerializer.class)
   */
  orderId?: number | null;
  /**
   * 总金额
   */
  totalAmount?: number | null;
}

/**
 * SeckillAddPurchaseReq
 */
export interface SeckillBuyReq {
  productId: null | string;
  /**
   * 购买数量
   */
  purchaseNum: number | null;
  /**
   * 秒杀商品编号
   */
  skNo: null | string;
}
