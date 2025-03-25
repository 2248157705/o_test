import { defineStore } from "pinia";
import { getProductList, getSellerProductList } from "@/api/product";
import type { ProductState, ProductData } from "@/types/store";
import type { SellerProductReq } from "@/types/product";

export const useProductStore = defineStore("product", {
  state: (): ProductState => ({
    productList: [],
    lookingProduct: {},
  }),
  actions: {
    async getProductList() {
      const { data } = await getProductList();
      this.productList = data;
    },
    async getSellerProductList(param: SellerProductReq) {
      return await getSellerProductList(param);
    },
    setLookingProduct(data: ProductData) {
      this.lookingProduct = data;
    },
  },
});
