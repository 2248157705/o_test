import { request } from "../fetch";
import type {
  LoginCredentialRes,
  SelfConsultationTidRes,
  QuickInquiryReq,
  PersonMerchantContactRes,
  ProductRecoveryRefundRes,
  ProductRecoveryRequestConfirmReceiptCardReq,
  ProductPecoveryConfirmProductReq,
} from "@/types/chat";
import type { OrderReq } from "@/types/order";

export const quickInquiryMenuApi = "/client/im/team/quickInquiryMenu";

export const getLoginCredential = (data: any) => {
  return request.post<LoginCredentialRes>(
    "/client/im/getLoginCredential",
    data,
    {
      showLoading: false,
    }
  );
};
export const getSelfConsultationTid = () => {
  return request.post<SelfConsultationTidRes>(
    "/client/im/team/getSelfConsultationTid",
    {},
    {
      showLoading: false,
    }
  );
};
/**
 * 根据订单号获取售后群ID
 * @param opts
 * @returns
 */
export const getAfterSaleTidByOrderId = (opts: OrderReq) => {
  return request.post("/client/im/team/getTidByOrderId", opts, {
    showLoading: false,
  });
};
// 群快捷菜单
export const getTeamQuickInquiryMenu = () => {
  return request.post(
    quickInquiryMenuApi,
    {},
    {
      showLoading: false,
    }
  );
};

// 群快捷询问
export const getTeamQuickInquiry = (data: QuickInquiryReq) => {
  return request.post("/client/im/team/quickInquiry", data, {
    showLoading: false,
  });
};
// 中介担保-商品确认
export const securedTransactionConfirmProduct = (data: any) => {
  return request.post<SecuredTransactionConfirmProductRes>(
    "/client/im/team/securedTransaction/confirm_product",
    data,
    {
      showLoading: false,
    }
  );
};
// 联系号商
export const personMerchantContact = (data: any) => {
  return request.post<PersonMerchantContactRes>(
    "/client/im/person/merchant/contact",
    data,
    {
      showLoading: false,
    }
  );
};
// 号商退款
export const productRecoveryRefund = (data: any) => {
  return request.post<ProductRecoveryRefundRes>(
    "/client/im/ticket/product_recovery/confirm_refund",
    data,
    {
      showLoading: false,
    }
  );
};

// 号商交易卖家发送[请求商家确认收货]卡片
export const productRecoveryRequestConfirmReceiptCard = (
  data: ProductRecoveryRequestConfirmReceiptCardReq
) => {
  return request.post(
    "/client/im/ticket/product_recovery/request_confirm_receipt_card/send",
    data,
    {
      showLoading: false,
    }
  );
};

// 消息卡片label配置
export const getMessageCardFieldLabel = () => {
  return request.post(
    "/client/im/getMessageCardFieldLabel",
    {},
    {
      showLoading: false,
    }
  );
};
// 消息卡片号商是否同意并支付
export const productPecoveryConfirmProduct = (
  data: ProductPecoveryConfirmProductReq
) => {
  return request.post(
    "/client/im/ticket/product_recovery/confirm_product",
    data,
    {
      showLoading: false,
    }
  );
};

// 机器人问答列表（换一换）
export const getRobotQaList = (data: ProductPecoveryConfirmProductReq) => {
  return request.post("/client/im/team/robot_qa/list", data, {
    showLoading: false,
  });
};

// 服机器人询问
export const robotQaAsk = (data: ProductPecoveryConfirmProductReq) => {
  return request.post("/client/im/team/robot_qa/ask", data, {
    showLoading: false,
  });
};

// 获取会话列表
export const conversationList = (data: ProductPecoveryConfirmProductReq) => {
  return request.post("/client/im/person/conversation/list", data, {
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      // "props-style": "underline",
    },
    showLoading: false,
  });
};

// 根据订单ID获取售后群ID
export const getPostSaleServiceTidByOrderId = (
  data: ProductPecoveryConfirmProductReq
) => {
  return request.post("/client/im/team/getPostSaleServiceTidByOrderId", data, {
    showLoading: false,
  });
};

// 获取商品渲染内容
export const getIMProductInfo = (data: ProductPecoveryConfirmProductReq) => {
  return request.post("/client/product/getProductInfo", data, {
    showLoading: false,
  });
};

// 根据群ID获取工单详情
export const getTicketDetailByTid = (data: { tid: string }) => {
  return request.post("/client/im/team/getTicketDetailByTid", data, {
    showLoading: false,
  });
};
