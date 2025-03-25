import { useUserStore } from "@/stores/user";
// import type { ChargeMethods } from "@/types/order";

import { orderPenaltyPayment, orderPenaltyStatus } from "@/api/order";
import {
  PaymentType,
  OrderStatus,
  // PurchaseStatus,
} from "@/enums/order";
import { Payment } from "@/components/payment/payment";
import { loopRequest, closeLoopRequest } from "./loop-request";
import { reactive } from "vue";
import { useMessageStore } from "@/stores/message";

const wx_app_id = import.meta.env.VITE_APP_WX_H5_PAY_APPID;

export const PenaltyPayment = () => {
  const { requestPayment, closeWebview } = Payment();
  const userStore = useUserStore();
  const messageStore = useMessageStore();

  const orderData = reactive({
    price: 0, //商品价格
    orderId: "", // 订单ID
    group_pay_order_no: "", // 组合支付订单号
    way3_pay_resp: {
      param: "", // 三方支付参数
      pay_order_no: "", // 三方支付订单号
    },
    coin_pay_resp: {
      param: "", // 余额支付参数
      pay_order_no: "", // 余额支付订单号
    },
    group_pay_tag: false, // 是否组合支付
    group_pay_remnant_amount: 0, // 组合支付剩余未支付金额
    penaltyId: 0,
  });

  const resetOrderData = () => {
    orderData.orderId = "";
    orderData.group_pay_order_no = "";
    orderData.way3_pay_resp = {
      param: "",
      pay_order_no: "",
    };
    orderData.coin_pay_resp = {
      param: "",
      pay_order_no: "",
    };
  };

  const checkOrderStatus = async (orderId: string, penaltyId: number) => {
    uni.showLoading({
      title: "订单查询中",
      mask: true,
    });
    await uni.$u.sleep(2000);
    loopRequest({
      maxCount: 3,
      times: 2000,
      fail: () => {
        resetOrderData();
        uni.hideLoading();
        uni.$main.toast("订单查询超时");
      },
      success: () => {
        resetOrderData();
        messageStore.setOperationPermissions();
        uni.hideLoading();
        //违约金支付回调
        if(userStore.setPenaltyCB){
          userStore.setPenaltyCB()
        }
      },
      check: async () => {
        const flag = await fetchOrderStatus(orderId, penaltyId);
        return flag;
      },
      close: () => {
        uni.hideLoading();
        resetOrderData();
        uni.log.info("订单轮询查询关闭", orderId, penaltyId);
      },
    });
  };
  // 获取订单状态
  const fetchOrderStatus = async (
    orderId: string,
    id: string | number
    // pay_order_no: string
  ) => {
    try {
      orderId = orderId.toString();
      const data = await orderPenaltyStatus({
        order_id: orderId + "",
        id: id + "",
        //   pay_order_no,
      });
      if (data.order_id) {
        return data.penalty_status === OrderStatus.FINISHED;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
  const checkH5PayStatus = () => {
    const { payMethod } = userStore.selectedPayMethod.way3Charge;

    const isWxH5 = payMethod === PaymentType.WX_H5;
    const isZfbH5 = payMethod === PaymentType.ZFB_H5;
    console.log("orderData", orderData, payMethod);
    closeWebview();
    if (
      (isWxH5 || isZfbH5) &&
      orderData.orderId &&
      orderData.way3_pay_resp.pay_order_no
    ) {
      checkOrderStatus(orderData.orderId, orderData.penaltyId);
    }
  };
  const clearCheckPayStatus = () => {
    closeLoopRequest();
  };
  // 发起付款 支持三方支付&余额支付
  const fetchPurchasePayment = async (
    orderId: string,
    penaltyId: number,
    penalty_amount: number
    // cfg: {
    //   coinCharge: null | ChargeMethods;
    //   way3Charge: null | ChargeMethods;
    // }
  ) => {
    const { coinCharge, way3Charge } = userStore.selectedPenaltyMethod;
    orderData.penaltyId = penaltyId;
    orderData.price = penalty_amount;

    const isWxH5 = way3Charge && way3Charge.payMethod === PaymentType.WX_H5;
    const isZfbH5 = way3Charge && way3Charge.payMethod === PaymentType.ZFB_H5;
    const opts = {
      order_id: orderId + "",
      id: penaltyId + "",
    };
    // 三方支付
    if (way3Charge && way3Charge.payMethod) {
      if (isWxH5) {
        opts.way3_charge_item = {
          amount: 0,
          pay_method: way3Charge.payMethod,
          pay_channel: way3Charge.code,
          ext: {
            wxH5InfoType: "Android",
            wxAppId: wx_app_id,
          },
        };
      } else if (isZfbH5) {
        opts.way3_charge_item = {
          amount: 0,
          pay_method: way3Charge.payMethod,
          pay_channel: way3Charge.code,
          ext: {
            return_url: "https://h5shop.sh28.vip",
            method: "GET",
          },
        };
      } else {
        opts.way3_charge_item = {
          amount: 0,
          pay_method: way3Charge.payMethod,
          pay_channel: way3Charge.code,
          ext: {},
        };
      }
    }
    if (coinCharge && coinCharge.payMethod) {
      let amount = 0;
      if (userStore.platformCurrency >= orderData.price) {
        amount = orderData.price;
        delete opts.way3_charge_item;
      } else {
        amount = userStore.platformCurrency;
      }
      opts.coin_charge_item = {
        amount: amount,
        pay_method: coinCharge.payMethod,
        pay_channel: coinCharge.code,
        ext: {},
      };
    }

    console.log("userStore.payMethodData.list", opts);

    const data = await orderPenaltyPayment(opts).catch((error) => {
      uni.$main.toast("支付失败");
      console.log("error", error);
    });
    if (data && data.group_pay_order_no) {
      orderData.orderId = orderId;
      orderData.group_pay_order_no = data.group_pay_order_no;
      orderData.way3_pay_resp = data.way3_pay_resp;
      orderData.coin_pay_resp = data.coin_pay_resp;

      // 三方支付 + 余额支付
      if (opts.way3_charge_item) {
        let orderInfo = data.way3_pay_resp.param;
        if (isWxH5) {
          orderInfo = JSON.parse(data.way3_pay_resp.param).h5_url;
        } else if (isZfbH5) {
          orderInfo = data.way3_pay_resp.param;
        }

        const payRes = await requestPayment(
          way3Charge.payMethod,
          orderInfo
        ).catch((err) => {
          uni.log.info("err", err);
          // checkOrderStatus2(orderId, data.pay_order_no);
          if (err?.code === -100) {
            uni.$main.toast("取消支付");
          } else if (err.errMsg === "请安装微信后重试") {
            resetOrderData();
            uni.$main.toast(err.errMsg);
          } else {
            uni.$main.toast(err.errMsg || "支付失败");
          }
        });
        if (payRes?.status && !isWxH5 && !isZfbH5) {
          checkOrderStatus(orderId, orderData.penaltyId);
        }
      } else {
        // 余额支付
        checkOrderStatus(orderId, orderData.penaltyId);
      }
    }
  };
  return {
    fetchPurchasePayment,
    checkH5PayStatus,
    clearCheckPayStatus,
  };
};
