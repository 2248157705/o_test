import type {
  SeckillProductReq,
  SeckillPurchaseRes,
  SeckillActivityRes,
  SeckillProductAddPurchaseRes,
  SeckillBuyReq,
} from "@/types/seckill";
import { request } from "../fetch";

const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

/**
 * 查询秒杀商品列表
 * @returns
 */
export const getSeckillProduct = (data: SeckillProductReq) => {
  return request.post<SeckillPurchaseRes[]>(
    `${baseUrl}/client/seckill/productPageList`,
    data,
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
/**
 * 查询秒杀详情
 * @returns
 */
export const getSeckillActivityDetail = (id: number) => {
  return request.get<SeckillActivityRes>(
    `${baseUrl}/client/seckill/activityDetail`,
    { id },
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};

/**
 * 查询秒杀详情
 * @returns
 */
export const getSeckillOrderId = (data: SeckillBuyReq) => {
  return request.post<SeckillProductAddPurchaseRes>(
    `${baseUrl}/client/seckill`,
    data,
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
