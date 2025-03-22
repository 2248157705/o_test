// import { reactive } from "vue";
import type {
  CreateOrderBargainReq,
  AgainOrderBargainReq,
  HandleOrderBargainReq,
  OrderBargainDetailReq,
  OrderBargainListReq,
} from "@/types/order";
import {
  createOrderBargain,
  againOrderBargain,
  handleOrderBargain,
  orderBargainDetail,
  orderBargainList,
} from "@/api/order";

export function OrderBargain() {
  // 创建出价单
  const fetchCreateOrderBargain = async (opts: CreateOrderBargainReq) => {
    const data = await createOrderBargain(opts);
    return data;
  };

  // 出价or还价
  const fetchAgainOrderBargain = async (opts: AgainOrderBargainReq) => {
    const data = await againOrderBargain(opts);
    return data;
  };

  // 处理出价（同意or拒绝）
  const fetchHandleOrderBargain = async (opts: HandleOrderBargainReq) => {
    const data = await handleOrderBargain(opts);
    return data;
  };

  // 出价详情
  const getOrderBargainDetail = async (opts: OrderBargainDetailReq) => {
    const data = await orderBargainDetail(opts);
    return data;
  };

  // 出价列表
  const getOrderBargainList = async (opts: OrderBargainListReq) => {
    const data = await orderBargainList(opts);
    return data;
  };

  return {
    fetchCreateOrderBargain,
    fetchAgainOrderBargain,
    fetchHandleOrderBargain,
    getOrderBargainDetail,
    getOrderBargainList,
  };
}
