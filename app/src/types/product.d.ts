import { CollectionType } from "@/enums/product";

export interface CreateProductReq {
  gameId: number;
  productType: number;
  productPrice: number;
  productDesc: string;
  productAccount: string;
  userPhone: string;
  userQQ: string;
  userWechat: string;
  goodsInfo: any;
}

export interface CreateProductRes {
  product_id: number;
}

export interface SellerProductReq {
  statusType: 0 | 1 | 2 | 3 | 4;
  orderBy: "asc" | "desc";
}
export interface SellerProductRes {
  product_id: string;
  product_covert: string;
  product_introduction: string;
  product_price: string;
  status_type: number;
  seller_id: number;
  onsell_type: number;
  product_type: number;
  sort: number;
  game_id: number;
  saleable_time: number;
  product_title: string;
}

export interface ProductBrowsingHistoryReq {
  collectionType: CollectionType;
  orderBy?: string;
  orderByKey?: string;
  page?: number;
  perPage?: number;
}

export interface DeleteRecordsReq {
  collectionType: CollectionType;
  productId: string;
}

export interface ProductItem {
  id: number;
  uid: number;
  product_id: string;
  product_covert: string;
  game_id: number;
  game_name: string;
  status_type: number;
  onsell_type: number;
  product_type: number;
  screenshot_type: number;
  product_price: string;
  product_title: string;
  product_desc: string;
  created_at: number;
  product_account: string;
  user_phone: string;
  user_qq: string;
  user_wechat: string;
  goods_info: string;
  screenshot_info: string;
  produce_quantity: number;
  stock_count: number;
  seller_id: number;
  product_introduction: string;
  sort: number;
  saleable_time: number;
  popularity: number;
  product_label: number[];
  collection_number: number;
}
