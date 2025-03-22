import { reactive } from "vue";
import { PaymentType } from "@/enums/order";
import { isInstallMx, isInstallZfb } from "./login";

export function Payment() {
  const webviewData = reactive({
    wxH5PayEl: null,
    zfbH5PayEl: null,
  });

  const requestPayment = (type: PaymentType, orderInfo) => {
    if (type === PaymentType.isInstallZfb) {
      return aliPay(orderInfo);
    } else if (type === PaymentType.WX_APP) {
      return wxPay(orderInfo);
    } else if (type === PaymentType.WX_H5) {
      return wxH5Pay(orderInfo);
    } else if (type === PaymentType.ZFB_H5) {
      return zfbH5Pay(orderInfo);
    } else {
      return aliPay(orderInfo);
    }
  };

  const aliPay = (orderInfo) => {
    uni.log.info("orderInfo", orderInfo);

    return new Promise((resolve, reject) => {
      if (!isInstallZfb()) {
        reject({
          status: false,
          errMsg: "请安装支付宝后重试",
        });
      }
      uni.requestPayment({
        provider: "alipay",
        orderInfo: orderInfo, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
        success: function (res) {
          uni.log.info("aliPay success:" + res);
          resolve({
            status: true,
            data: res,
          });
        },
        fail: function (err) {
          uni.log.info("aliPay fail:" + err);
          reject({
            status: false,
            ...err,
          });
        },
      });
    });
  };

  const wxPay = (orderInfo) => {
    return new Promise((resolve, reject) => {
      if (!isInstallMx()) {
        reject({
          status: false,
          errMsg: "请安装微信后重试",
        });
      }
      uni.requestPayment({
        provider: "wxpay",
        orderInfo: orderInfo, //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
        success: function (res) {
          uni.log.info("success:" + JSON.stringify(res));
          resolve({
            status: true,
            data: res,
          });
        },
        fail: function (err) {
          uni.log.info("fail:" + JSON.stringify(err));
          reject({
            status: false,
            ...err,
          });
        },
      });
    });
  };

  const wxH5Pay = (orderInfo: string) => {
    return new Promise((resolve, reject) => {
      if (!isInstallMx()) {
        reject({
          status: false,
          errMsg: "请安装微信后重试",
        });
      }
      try {
        const domain = import.meta.env.VITE_APP_WX_H5_DOMAIN;
        webviewData.wxH5PayEl = plus.webview.create("", domain, {
          height: uni.getSystemInfoSync().windowHeight,
          width: "750rpx",
        });
        webviewData.wxH5PayEl.loadURL(orderInfo, { Referer: domain });
        resolve({
          status: true,
        });
      } catch (error) {
        reject({
          status: false,
          errMsg: error,
        });
      }
    });
  };

  const zfbH5Pay = (orderInfo: string) => {
    return new Promise((resolve, reject) => {
      if (!isInstallZfb()) {
        reject({
          status: false,
          errMsg: "请安装支付宝后重试",
        });
      }
      try {
        const domain = import.meta.env.VITE_APP_ZFB_H5_PAY_RETURN_URL;
        webviewData.zfbH5PayEl = plus.webview.create("", "", {
          height: uni.getSystemInfoSync().windowHeight,
          width: "750rpx",
        });
        webviewData.zfbH5PayEl.loadURL(orderInfo, { Referer: domain });
        resolve({
          status: true,
        });
      } catch (error) {
        reject({
          status: false,
          errMsg: error,
        });
      }
    });
  };

  const closeWebview = () => {
    if (webviewData.zfbH5PayEl) {
      plus.webview.close(webviewData.zfbH5PayEl);
      webviewData.zfbH5PayEl = null;
    }
    if (webviewData.wxH5PayEl) {
      plus.webview.close(webviewData.wxH5PayEl);
      webviewData.wxH5PayEl = null;
    }
  };

  return {
    webviewData,
    requestPayment,
    wxH5Pay,
    aliPay,
    wxPay,
    closeWebview,
  };
}
