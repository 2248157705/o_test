import { payMethodDataMap } from "@/pages/order/js/purchase";
import { PaymentType } from "@/enums/order";

export function getPayMethod(items: any[]) {
  const payMethodList = []; // 支付列表
  const way3Charge = []; // 三方支付
  const coinCharge = []; // 余额支付
  const selectedPayMethod = {
    // 默认支付方式
    coinCharge: {},
    way3Charge: {},
  };

  items.forEach((el) => {
    if (el.status) {
      const payData = el.methods.find((sub) => sub.status);
      if (payData) {
        const cfg = {
          code: el.code,
          name: payMethodDataMap[payData.pay_method].name,
          payMethod: payData.pay_method,
          img: payMethodDataMap[payData.pay_method].img,
        };
        payMethodList.push(cfg);

        if (payData.pay_method === PaymentType.TCOIN) {
          coinCharge.push(cfg);
        } else {
          way3Charge.push(cfg);
        }
      }
    }
  });

  // 优先默认选中三方支付，其次是余额支付
  if (way3Charge.length > 0) {
    selectedPayMethod.way3Charge = way3Charge[0];
  } else if (coinCharge.length > 0) {
    selectedPayMethod.coinCharge = coinCharge[0];
  }

  return {
    payMethodList,
    coinCharge,
    way3Charge,
    hasWay3Charge: way3Charge.length > 0, // 是否有三方支付
    hasCoinCharge: coinCharge.length > 0, // 是否有余额支付
    selectedPayMethod,
  };
}
