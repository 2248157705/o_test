import type {
  SeckillProductReq,
  SeckillPurchaseRes,
  SeckillActivityRes,
} from "@/types/seckill";
import { request } from "../fetch";

const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

/**
 * 查询抽奖详情
 * @returns
 */
export const getRaffleActivityDetail = (id: number) => {
  return request.get<SeckillActivityRes>(
    `${baseUrl}/client/raffle/activityDetail`,
    { id },
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
/**
 * 抽奖下单
 * @returns
 */
export const getRaffleAddPurchase = (data) => {
  return request.post<SeckillActivityRes>(
    `${baseUrl}/client/raffle/addPurchase`,
    data,
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};

/**
 * 查询抽奖商品列表
 * @returns
 */
export const getRaffleProduct = (data: SeckillProductReq) => {
  return request.post<SeckillPurchaseRes[]>(
    `${baseUrl}/client/raffle/productPageList`,
    data,
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
/**
 * 查询抽奖商品列表
 * @returns
 */
export const getRaffleProductDetail = (raffleNo: string) => {
  return request.get<SeckillPurchaseRes[]>(
    `${baseUrl}/client/raffle/productDetail`,
    { raffleNo },
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
/**
 * 查询抽奖记录列表
 * @returns
 */
export const getRaffleOrderPageList = (data) => {
  return request.post<SeckillPurchaseRes[]>(
    `${baseUrl}/client/raffle/raffleOrderPageList`,
    data,
    {
      header: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    }
  );
};
