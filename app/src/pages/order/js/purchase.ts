import type { ChargeMethods } from "@/types/order";
import { ref, reactive, computed } from "vue";
// import { delay } from "lodash-es";
import {
  PaymentType,
  OrderStatus,
  PurchaseStatus,
  // PaymentChannel,
} from "@/enums/order";
import {
  getOrderPurchasePreview,
  orderPurchase,
  purchasePayment,
  getOrderStatus,
  orderPurchaseGuarantee,
  purchasePaymentV2,
} from "@/api/order";
import { Payment } from "@/components/payment/payment";
import { loopRequest, closeLoopRequest } from "./loop-request";
import { OpenType } from "@/enums/button";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";
import Events, {
  report,
  ReportStatus,
  ReportPayStatus,
} from "@/utils/report/report";

const wx_app_id = import.meta.env.VITE_APP_WX_H5_PAY_APPID;
const zfb_h5_pay_api = import.meta.env.VITE_APP_ZFB_H5_PAY_HOST;
const zfb_h5_pay_return_url = import.meta.env.VITE_APP_ZFB_H5_PAY_RETURN_URL;

export const payMethodDataMap = {
  [PaymentType.ZFB_APP]: {
    name: "支付宝",
    img: "/static/images/common/icon_zfb_pay.png",
  },
  [PaymentType.ZFB_H5]: {
    name: "支付宝",
    img: "/static/images/common/icon_zfb_pay.png",
  },
  [PaymentType.WX_APP]: {
    name: "微信",
    img: "/static/images/common/icon_wx_pay.png",
  },
  [PaymentType.WX_H5]: {
    name: "微信",
    img: "/static/images/common/icon_wx_pay.png",
  },
  [PaymentType.TCOIN]: {
    name: "余额支付",
    img: "/static/images/common/icon_tcoin_pay.png",
  },
};

export const toOrderDetail = (orderId: string) => {
  uni.redirectTo({
    url: `/pages/order/detail?orderId=${orderId}`,
  });
};

export const toOrderPaySuccess = (orderId: string, type: any) => {
  const messageStore = useMessageStore();

  uni.redirectTo({
    url: `/pages/order/pay-sucess?orderId=${orderId}&type=${type}`,
    complete() {
      if (type === OpenType.GUARANTEE) {
        // 中介担保
        messageStore.setOperationPermissions();
      }
    },
  });
};

export function GoodsPurchase() {
  const order_type = ref(""); // 交易类型
  const { requestPayment, closeWebview } = Payment();
  const userStore = useUserStore();
  const purchasePopupRef = ref(null);
  const product = ref({}); // 商品信息
  const product_id = ref(null); // 商品id
  const insuranceId = ref(null); // 保险id
  const transaction_type = ref(""); // 订单类型
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

  const reportPayData = reactive({
    start_time: 0,
  });

  const reportOrderData = computed(() => {
    const { id, game_id, game_name, product_title } = product.value;
    const { price, orderId } = orderData;
    return {
      orderId: orderId, // 订单ID
      productId: id, // 商品ID
      productTitle: product_title, // // 商品名称
      purchaseNum: 1,
      insuranceId: insuranceId.value, // 保险ID
      couponIds: "", // 优惠券ID
      price: price, // 商品价格
      way3Charge: "", // 三方支付
      coinCharge: "", // 余额支付
      gameId: game_id, // 游戏ID
      game: game_name, // 游戏名称
      transactionType: transaction_type.value, // 订单类型
    };
  });

  const checkOrderStatus = async (orderId: string, payOrderNo: string) => {
    uni.showLoading({
      title: "订单查询中",
      mask: true,
    });
    loopRequest({
      maxCount: 3,
      times: 2000,
      fail: () => {
        resetOrderData();
        uni.hideLoading();
        toOrderDetail(orderId);
        uni.$main.toast("订单查询超时");
      },
      success: () => {
        report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
          ...reportOrderData.value,
          status: ReportPayStatus.SUCCESS,
          dur: new Date().getTime() - reportPayData.start_time,
        });
        resetOrderData();
        uni.hideLoading();
        toOrderPaySuccess(orderId, order_type.value);
      },
      check: async () => {
        const flag = await fetchOrderStatus(orderId, payOrderNo);
        return flag;
      },
      close: () => {
        report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
          ...reportOrderData.value,
          status: ReportPayStatus.TIMEOUT,
        });
        uni.hideLoading();
        resetOrderData();
        uni.log.info("订单轮询查询关闭", orderId, payOrderNo);
      },
    });
  };

  // 确认下单
  const fetchOrderPurchase = async () => {
    const opts = {
      product_id: product_id.value,
      purchase_num: 1,
      insurance_id: insuranceId.value,
    };
    report(Events.ORDER_PURCHASE, opts);
    const data = await orderPurchase(opts).catch((err) => {
      report(Events.ORDER_PURCHASE_STATUS, {
        ...opts,
        errMsg: err,
        status: ReportStatus.FAILED,
      });
      uni.$main.toast(err?.msg);
    });
    report(Events.ORDER_PURCHASE_STATUS, {
      ...opts,
      status: ReportStatus.SUCCESS,
    });
    if (data && data.order_id) {
      const { coinCharge, way3Charge } = userStore.selectedPayMethod;
      orderData.price = data.order_info_po.actual_amount;
      fetchPurchasePaymentV2(data.order_id, {
        coinCharge: coinCharge,
        way3Charge: way3Charge,
      });
    }
  };

  // 中介担保-确认下单
  const fetchOrderPurchaseGuarantee = async () => {
    const opts = {
      product_id: product_id.value,
      purchase_num: 1,
      insurance_id: insuranceId.value,
    };
    report(Events.ORDER_PURCHASE, opts);
    const data = await orderPurchaseGuarantee(opts).catch((err) => {
      report(Events.ORDER_PURCHASE_STATUS, {
        ...opts,
        errMsg: err,
        status: ReportStatus.FAILED,
      });
      uni.$main.toast(err?.msg);
    });
    report(Events.ORDER_PURCHASE_STATUS, {
      ...opts,
      status: ReportStatus.SUCCESS,
    });
    if (data && data.order_id) {
      const { coinCharge, way3Charge } = userStore.selectedPayMethod;
      orderData.price = data.order_info_po.actual_amount;

      fetchPurchasePaymentV2(data.order_id, {
        coinCharge: coinCharge,
        way3Charge: way3Charge,
      });
    }
  };

  // 发起付款
  const fetchPurchasePayment = async (orderId: string) => {
    const { payMethod, code } = userStore.selectedPayMethod.way3Charge;

    const isWxH5 = payMethod === PaymentType.WX_H5;
    const isZfbH5 = payMethod === PaymentType.ZFB_H5;

    let opts = {
      order_id: orderId,
      pay_method: payMethod,
      pay_channel: code,
    };
    if (isWxH5) {
      opts = {
        order_id: orderId,
        pay_method: payMethod,
        pay_channel: code,
        wx_h5_info_type: "Android",
        wx_app_id: wx_app_id,
      };
    }

    if (isZfbH5) {
      opts = {
        order_id: orderId,
        pay_method: payMethod,
        pay_channel: code,
        ext: {
          returnUrl: zfb_h5_pay_return_url,
        },
      };
    }

    console.log(
      "userStore.payMethodData.list",
      userStore.payMethodData.list,
      opts
    );

    const data = await purchasePayment(opts).catch((error) => {
      uni.$main.toast("支付失败");
      console.log("error", error);
    });
    if (data && data.param) {
      let orderInfo = data.param;
      orderData.orderId = orderId;
      orderData.pay_order_no = data.pay_order_no;
      if (isWxH5) {
        orderInfo = JSON.parse(data.param).h5_url;
      }
      if (isZfbH5) {
        orderInfo = `${zfb_h5_pay_api}?${data.param}`;
      }
      const payRes = await requestPayment(payMethod, orderInfo).catch((err) => {
        uni.log.info("err", err);
        if (err?.code === -100) {
          uni.$main.toast("取消支付");
          toOrderDetail(orderId);
        } else if (err.errMsg === "请安装微信后重试") {
          orderData.orderId = "";
          orderData.pay_order_no = "";
          uni.$main.toast(err.errMsg);
        } else {
          uni.$main.toast(err.errMsg || "支付失败");
          toOrderDetail(orderId);
        }
      });
      if (payRes?.status && !isWxH5 && !isZfbH5) {
        checkOrderStatus(orderId, data.pay_order_no);
      }
    }
  };

  // 发起付款 支持三方支付&余额支付
  const fetchPurchasePaymentV2 = async (
    orderId: string,
    cfg: {
      coinCharge: null | ChargeMethods;
      way3Charge: null | ChargeMethods;
    }
  ) => {
    cfg.coinCharge = cfg.coinCharge || userStore.selectedPayMethod.coinCharge;
    cfg.way3Charge = cfg.way3Charge || userStore.selectedPayMethod.way3Charge;

    const coinCharge = cfg.coinCharge;
    const way3Charge = cfg.way3Charge;

    const isWxH5 = way3Charge && way3Charge.payMethod === PaymentType.WX_H5;
    const isZfbH5 = way3Charge && way3Charge.payMethod === PaymentType.ZFB_H5;

    // 是否全额支付且余额足够支付商品总价
    // const isUsedCoinAndEnoughPay = coinCharge && coinCharge.payMethod && userStore.platformCurrency >= orderData.price;

    const opts = {
      order_id: orderId,
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
            return_url: zfb_h5_pay_return_url,
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
        // 如果足够余额支付，就去掉三方支付
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

    const reportData = {
      ...reportOrderData.value,
      way3Charge: opts.way3_charge_item,
      coinCharge: opts.coin_charge_item,
    };

    report(Events.ORDER_PURCHASE_PAYMENT, reportData);

    const data = await purchasePaymentV2(opts).catch((error) => {
      report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
        ...reportData,
        errMsg: error,
        status: ReportStatus.FAILED,
      });
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
          if (err?.code === -100) {
            uni.$main.toast("取消支付");
            report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
              ...reportData,
              status: ReportPayStatus.CANCEL,
            });
            toOrderDetail(orderId);
          } else if (err.errMsg.includes("请安装")) {
            report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
              ...reportData,
              errMsg: err.errMsg,
              status: ReportPayStatus.UNINSTALL,
            });
            uni.$main.toast(err.errMsg);
          } else {
            report(Events.ORDER_PURCHASE_PAYMENT_STATUS, {
              ...reportData,
              errMsg: err.errMsg,
              status: ReportPayStatus.FAILED,
            });
            uni.$main.toast(err.errMsg || "支付失败");
            toOrderDetail(orderId);
          }
        });
        if (payRes?.status && !isWxH5 && !isZfbH5) {
          checkOrderStatus(orderId, data.way3_pay_resp.pay_order_no);
        }
      } else {
        // 余额支付
        checkOrderStatus(orderId, data.coin_pay_resp.pay_order_no);
      }
    }
  };

  const checkH5PayStatus = () => {
    const { way3Charge } = userStore.selectedPayMethod;
    const isWxH5 = way3Charge && way3Charge.payMethod === PaymentType.WX_H5;
    const isZfbH5 = way3Charge && way3Charge.payMethod === PaymentType.ZFB_H5;
    console.log("orderData", orderData, way3Charge);
    closeWebview();
    if (
      (isWxH5 || isZfbH5) &&
      orderData.orderId &&
      orderData.way3_pay_resp.pay_order_no
    ) {
      checkOrderStatus(orderData.orderId, orderData.way3_pay_resp.pay_order_no);
    }
  };

  const clearCheckPayStatus = () => {
    closeLoopRequest();
  };

  // 预下单查询
  const fetchOrderPurchasePreview = async (type) => {
    reportPayData.start_time = new Date().getTime();
    report(Events.ORDER_PURCHASE_PREVIEW, reportOrderData.value);
    const data = await getOrderPurchasePreview({
      product_id: product_id.value,
    }).catch((err) => {
      report(Events.ORDER_PURCHASE_PREVIEW_STATUS, {
        ...reportOrderData.value,
        errMsg: err,
        status: ReportStatus.FAILED,
      });
      uni.log.info("fetchOrderPurchasePreview", err);
      // 重复下单
      if (err?.code && err?.code == PurchaseStatus.ORDER_DUPLICATE) {
        purchasePopupRef.value?.open();
        return;
      } else {
        uni.$main.toast(err?.msg);
      }
    });
    report(Events.ORDER_PURCHASE_PREVIEW_STATUS, {
      ...reportOrderData.value,
      status: ReportStatus.SUCCESS,
    });
    if (data.product && data.product.id) {
      console.warn("type", type);
      if (type.transaction_type === OpenType.GUARANTEE) {
        // 中介担保支付
        fetchOrderPurchaseGuarantee();
      } else {
        fetchOrderPurchase();
      }
    }
  };

  // 获取订单状态
  const fetchOrderStatus = async (orderId: string, payOrderNo: string) => {
    try {
      const data = await getOrderStatus(orderId, payOrderNo);
      if (data.order_id) {
        order_type.value = data.order_type;
        return data.order_status === OrderStatus.PAID;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return {
    transaction_type,
    product,
    orderData,
    product_id,
    insuranceId,
    reportOrderData,
    purchasePopupRef,
    fetchOrderPurchasePreview,
    fetchOrderPurchase,
    fetchPurchasePayment,
    fetchPurchasePaymentV2,
    checkH5PayStatus,
    closeWebview,
    clearCheckPayStatus,
  };
}
