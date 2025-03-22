import type {
  OrderListReq,
  OrderListRes,
  OrderPurchasePreviewReq,
  OrderPurchasePreviewRes,
  OrderPurchaseReq,
  OrderPurchaseRes,
  PurchasePaymentReq,
  PurchasePaymentRes,
  UpdatePurchaseStatusReq,
  UpdatePurchaseStatusRes,
  PurchaseRefundApplyReq,
  PurchaseRefundApplyRes,
  CreateBalancePayoutsReq,
  CreateOrderBargainReq,
  AgainOrderBargainReq,
  HandleOrderBargainReq,
  OrderBargainDetailReq,
  OrderBargainListReq,
  OrderBargainListRes,
  OrderPenaltyPaymentRes,
  OrderPenaltyStatusRes,
  RankingRes,
  RateConfigRes,
  RateConfigReq,
} from "@/types/order";
import { ConifgCode } from "@/enums/common";
import { request } from "../fetch";

const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

/**
 * 获取订单详情
 * @param orderId
 * @returns
 */
export const getOrderDetail = (orderId: string) => {
  return request.get(`${baseUrl}/client/order/detail`, { order_id: orderId });
};

/**
 * 获取订单状态
 * @param orderId
 * @returns
 */
export const getOrderStatus = (orderId: string, pay_order_no: string) => {
  return request.get(
    `${baseUrl}/client/order/status`,
    {
      order_id: orderId,
      pay_order_no: pay_order_no,
    },
    {
      showLoading: false,
    }
  );
};

/**
 * 获取订单列表
 * @param data
 * @returns
 */
export const getOrderList = (data: OrderListReq) => {
  return request.post<OrderListRes>(`${baseUrl}/client/order/list`, data, {
    showLoading: false,
  });
};

/**
 * 预下单查询
 * @param data
 * @returns
 */
export const getOrderPurchasePreview = (data: OrderPurchasePreviewReq) => {
  return request.get<OrderPurchasePreviewRes>(
    `${baseUrl}/client/order/purchase/preview`,
    data
  );
};

/**
 * 获取包赔服务列表
 * @param data
 * @returns
 */
export const getQueryProductConfig = (data: OrderPurchasePreviewReq) => {
  return request.get<OrderPurchasePreviewRes>(
    `${baseUrl}/client/order/purchase/queryProductConfig`,
    data
  );
};

/**
 * 确认下单
 * @param data
 * @returns
 */
export const orderPurchase = (data: OrderPurchaseReq) => {
  return request.post<OrderPurchaseRes>(
    `${baseUrl}/client/order/purchase`,
    data
  );
};
/**
 * 中介担保下单
 * @param data
 * @returns
 */
export const orderPurchaseGuarantee = (data: OrderPurchaseReq) => {
  return request.post(`${baseUrl}/client/order/purchase/guarantee`, data);
};

/**
 * 发起付款，只支持三方支付
 * @param data
 * @returns
 */
export const purchasePayment = (data: PurchasePaymentReq) => {
  return request.post<PurchasePaymentRes>(
    `${baseUrl}/client/order/purchase/payment`,
    data
  );
};

/**
 * 发起付款v2，支持余额+三方支付
 * @param data
 * @returns
 */
export const purchasePaymentV2 = (data: PurchasePaymentV2Req) => {
  return request.post<PurchasePaymentRes>(
    `${baseUrl}/client/order/purchase/payment.v2`,
    data
  );
};

/**
 * 确认收货
 * @param data
 * @returns
 */
export const updatePurchaseStatus = (data: UpdatePurchaseStatusReq) => {
  return request.post<UpdatePurchaseStatusRes>(
    `${baseUrl}/client/order/purchase/status`,
    data
  );
};

/**
 * 退款申请
 * @param data
 * @returns
 */
export const purchaseRefundApply = (data: PurchaseRefundApplyReq) => {
  return request.post<PurchaseRefundApplyRes>(
    `${baseUrl}/client/order/purchase/refund/apply`,
    data
  );
};

/**
 * 售后申请
 * @param data
 * @returns
 */
export const afterSaleApply = (data: PurchaseRefundApplyReq) => {
  return request.post(`${baseUrl}/client/order/purchase/afterSale/apply`, data);
};

/**
 * 发起提现
 * @param data
 * @returns
 */
export const createBalancePayouts = (data: CreateBalancePayoutsReq) => {
  return request.post(`${baseUrl}/client/balance/createBalancePayouts`, data);
};

/**
 * 分页查询提现记录
 * @param data
 * @returns
 */
export const getBalancePayoutsList = (data: BalancePayoutsListReq) => {
  return request.post(`${baseUrl}/client/balance/payoutsPageList`, data);
};

/**
 * 分页查询余额记录
 * @param data
 * @returns
 */
export const getBalanceRolloverPageList = (data: BalancePayoutsListReq) => {
  return request.post(
    `${baseUrl}/client/balance/balanceRolloverPageList`,
    data
  );
};

/**
 * 创建出价单
 * @param data
 * @returns
 */
export const createOrderBargain = (data: CreateOrderBargainReq) => {
  return request.post(`${baseUrl}/client/orderBargain/create`, data);
};

/**
 * 出价or还价
 * @param data
 * @returns
 */
export const againOrderBargain = (data: AgainOrderBargainReq) => {
  return request.post(`${baseUrl}/client/orderBargain/bidAgain`, data);
};

/**
 * 处理出价（同意or拒绝）
 * @param data
 * @returns
 */
export const handleOrderBargain = (data: HandleOrderBargainReq) => {
  return request.post(`${baseUrl}/client/orderBargain/handleBid`, data);
};

/**
 * 出价详情
 * @param data
 * @returns
 */
export const orderBargainDetail = (data: OrderBargainDetailReq) => {
  return request.get(`${baseUrl}/client/orderBargain/detail`, data);
};

/**
 * 出价列表
 * @param data
 * @returns
 */
export const orderBargainList = (data: OrderBargainListReq) => {
  return request.post<OrderBargainListRes>(
    `${baseUrl}/client/orderBargain/pageList`,
    data
  );
};

/**
 * 根据商品id查询议价详情（买家）
 * @param data
 * @returns
 */
export const queryByProductId = (product_id: string) => {
  return request.get<OrderBargainListRes>(
    `${baseUrl}/client/orderBargain/queryByProductId`,
    { product_id },
    {
      showLoading: false,
    }
  );
};

/**
 * 查询配置
 * @param code
 * @returns
 */
export const getConfig = (code: ConifgCode) => {
  return request.get(
    `${baseUrl}/client/config/get`,
    { code },
    {
      showLoading: false,
    }
  );
};

/**
 * 查询批量配置
 * @param code
 * @returns
 */
export const getConfigByCodes = (codes: string[]) => {
  return request.post(`${baseUrl}/client/config/getByCodes`, { codes });
};

/**
 * 违约金订单发起付款
 * @param data
 * @returns
 */
export const orderPenaltyPayment = (data: OrderPenaltyPaymentRes) => {
  return request.post(`${baseUrl}/client/orderPenalty/payment`, data);
};
/**
 * 获取违约金订单状态
 * @param orderId: 订单id; id: 违约金订单Id
 * @returns
 */
export const orderPenaltyStatus = (data: OrderPenaltyStatusRes) => {
  return request.post(`${baseUrl}/client/orderPenalty/status`, data);
};

/**
 * 获取昨日排行统计
 * @returns
 */
export const getOrderRanking = () => {
  return request.get<RankingRes>(`${baseUrl}/client/order/ranking`);
};
/**
 * 查询费率配置
 * @returns
 */
export const getRateConfig = (data: RateConfigRes) => {
  return request.post<RateConfigReq>(
    `${baseUrl}/client/orderRate/rateConfig`,
    data
  );
};

/**
 * 理赔申请
 * @returns
 */
export const claimsApply = (data: PurchaseRefundApplyReq) => {
  return request.post<RateConfigReq>(
    `${baseUrl}/client/order/purchase/afterSale/claims`,
    data
  );
};

/**
 * 清除未读
 * @returns
 */
export const bargainClearUnread = (data: PurchaseRefundApplyReq) => {
  return request.post<RateConfigReq>(`${baseUrl}/client/my/clearUnread`, data);
};
