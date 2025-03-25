import { request } from "../fetch";
import {
  CreateProductReq,
  createProductRes,
  SellerProductReq,
  SellerProductRes,
  ProductBrowsingHistoryReq,
  DeleteRecordsReq,
} from "@/types/product";
const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

export const createProduct = (data: CreateProductReq) => {
  return request.post<createProductRes>("/client/product/createProduct", data);
};

export const editProduct = (data: CreateProductReq) => {
  return request.post<CreateProductRes>("/client/product/editProduct", data);
};

export const getProductList = (data) => {
  return request.post("/client/product/getProductList", data, {
    showLoading: data?.showLoading,
  });
};

// 捡漏专区
export const getDetectProductList = (data) => {
  return request.post("/client/product/getDetectProductList", data);
};
export const getIndexProductList = (data) => {
  return request.post("/client/product/getIndexProductList", data, {
    showLoading: data?.showLoading,
  });
};
export const getProductInfo = (data: { productId: string }) => {
  return request.post("/client/product/getProductInfo", data, {
    showLoading: false,
  });
};

// 获取发布的商品列表
export const getSellerProductList = (data: SellerProductReq) => {
  return request.post<SellerProductRes[]>(
    "/client/product/getSellerProductList",
    data
  );
};

// 下架商品
export const offShelfProduct = (productId: string) => {
  return request.post("/client/product/offShelfProduct", { productId });
};

// 获取获取商品列表搜索词条
export const generateSearchRecommendKey = () => {
  return request.post("/client/product/generateSearchRecommendKey", null, {
    showLoading: false,
  });
};

//足迹&商品咨询列表
export const getProductBrowsingHistory = (data: ProductBrowsingHistoryReq) => {
  return request.post("/client/product/productBrowsingHistory", data);
};

//删除足迹&商品咨询
export const deleteProductRecords = (data: DeleteRecordsReq) => {
  return request.post("/client/product/deleteRecords", data);
};

//商品咨询记录录入
export const setConsultationRecords = (productId: string) => {
  return request.post("/client/product/setConsultationRecords", { productId });
};

//获取估价商品列表
export const getEstimateProductList = (data) => {
  return request.post("/client/product/getEstimateProductList", data);
};

//获取估价商品详情

export const getEstimateProductInfo = (estimateId: string) => {
  return request.post("/client/product/getEstimateProductInfo", { estimateId });
};
//商品估价录入
export const createEstimateProduct = (data: CreateProductReq) => {
  return request.post<createProductRes>(
    "/client/product/createEstimateProduct",
    data
  );
};
//商品录入快捷语
export const getQuickWords = (data) => {
  return request.post("/client/product/getQuickWords", data);
};
//商品修改价格
export const editProductPrices = (data) => {
  return request.post("/client/product/editProductPrices", data);
};
//商品议价状态
export const editProductBargainStatus = (data) => {
  return request.post("/client/product/editProductBargainStatus", data);
};
//获取商品适用的服务费营销规则
export const getProductRule = (data) => {
  return request.post(
    `${baseUrl}/client/mktServiceCharge/getProductRule`,
    data
  );
};
//获取商品保存的服务费营销规则
export const getCurProductRule = (data) => {
  return request.post(
    `${baseUrl}/client/mktServiceCharge/getCurProductRule`,
    data
  );
};
