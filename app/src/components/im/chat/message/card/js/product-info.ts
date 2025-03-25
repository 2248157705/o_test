import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user";
import { getIMProductInfo } from "@/api/chat";
import { ProductTypeEnum } from "@/enums/product";

export const ProductInfoUtil = () => {
  const userStore = useUserStore();

  const productInfo = ref({});

  // 是否买家
  const isBuyer = computed(() => {
    const uid = userStore?.userInfo?.uid;
    return productInfo.value?.uid != uid;
  });

  // 是否卖家
  const isSeller = computed(() => {
    const uid = userStore?.userInfo?.uid;
    return productInfo.value?.uid == uid;
  });

  // 用户截图信息
  const userScreenshotInfo = computed(() => {
    const screenshot = {
      real_name_pic: "", // 实名截图
      contract_pic: "", // 网购或外卖订单截图 只允许卖家查看
    };
    if (productInfo.value?.screenshot_info) {
      const data = JSON.parse(productInfo.value.screenshot_info);
      if (data && Array.isArray(data) && data.length > 0) {
        data.forEach((el) => {
          if (Object.keys(el).includes("real")) {
            screenshot.real_name_pic = el.real;
          } else if (Object.keys(el).includes("other_order")) {
            screenshot.contract_pic = el.other_order;
          } else if (Object.keys(el).includes("contract")) {
            screenshot.contract_pic = el.contract;
          }
        });
      }
    }
    return screenshot;
  });

  // 获取IM商品信息
  const fetchIMProductInfo = async (opts: { productId: string }) => {
    const { uid } = userStore.userInfo;
    const res = await getIMProductInfo({
      show_screenshot: 1,
      uid,
      ...opts,
    }).catch((err) => {
      console.error("fetchIMProductInfo", err);
    });
    if (
      res &&
      res.screenshot_info &&
      [ProductTypeEnum.GUARANTEE, ProductTypeEnum.RECYCLE].includes(
        res.product_type
      )
    ) {
      productInfo.value = res;
    }
  };

  return {
    productInfo,
    isBuyer,
    isSeller,
    userScreenshotInfo,
    fetchIMProductInfo,
  };
};
