import { ProductConfirmStatus } from "@/components/im/utils/enums";

export interface LoginCredentialRes {
  data: { app_key: string; accid: string; token: string };
}
export interface SelfConsultationTidRes {
  data: { tid: string };
}
export interface SelfConsultationTidRes {
  data: { tid: string };
}

export interface QuickInquiryReq {
  tid: string;
  keyword: string;
}
export interface PersonMerchantContactRes {
  data: { merchant_uid: string };
}
export interface ProductRecoveryRefundRes {
  data: { ticket_id: number | string; status: string; reason: string };
}
export interface ProductRecoveryRequestConfirmReceiptCardReq {
  ticket_id: number | string;
}
export interface ProductPecoveryConfirmProductReq {
  ticket_id: number | string;
  product_id: product_id;
  status: ProductConfirmStatus;
  reason: string;
}

export interface SecuredTransactionConfirmProductRes {
  data: {
    product_id: string;
    status: ProductConfirmStatus;
    ticket_id: number;
    reason: string;
  };
}

export interface ProductMsg {
  product_id: string | number;
  product_covert: string;
  product_title: string;
  product_price: string;
}
