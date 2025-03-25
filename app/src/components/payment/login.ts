import { bindPayAccount } from "@/api/user";
import { thirdLogin } from "@/api/login";
import { dyAuth } from "@/utils/douyin/index";

export function isInstallMx() {
  return plus.runtime.isApplicationExist({
    pname: "com.tencent.mm",
    action: "weixin://",
  });
}

export function isInstallQQ() {
  return plus.runtime.isApplicationExist({
    pname: "com.tencent.mobileqq",
    action: "mqq://",
  });
}

export function isInstallZfb() {
  return plus.runtime.isApplicationExist({
    pname: "com.eg.android.AlipayGphone",
    action: "alipays://",
  });
}

export function isInstallDy() {
  return plus.runtime.isApplicationExist({
    pname: "com.ss.android.ugc.aweme",
    action: "snssdk1128://",
  });
}

export function Login() {
  const getWxLogin = () => {
    return new Promise((reslove, reject) => {
      if (!isInstallMx()) {
        reject("请安装微信后重试");
      }
      uni.login({
        provider: "weixin",
        onlyAuthorize: true, // 微信登录仅请求授权认证
        success: async function (event) {
          uni.log.info("uni.login success", event);
          reslove(event);
        },
        fail: function (err) {
          uni.log.info("uni.login fail", err);
          reject(err);
        },
      });
    });
  };

  const wxBind = () => {
    return new Promise((reslove, reject) => {
      getWxLogin()
        .then(async (data) => {
          const res = await bindPayAccount({
            app_id: import.meta.env.VITE_APP_WX_APPID,
            bind_pay_account: 1,
            code: data.code,
            account_source: "WEIXIN",
          }).catch((err) => {
            reject({
              status: false,
              errMsg: err,
            });
          });
          uni.log.info("uni.login bindPayAccount---", res);
          if (res) {
            reslove({
              status: true,
              data: res,
            });
          } else {
            reject({
              status: false,
              errMsg: res,
            });
          }
        })
        .catch((err) => {
          reject({
            status: false,
            errMsg: err,
          });
        });
    });
  };

  // 微信登录
  const wxLogin = (opts: {
    params: any;
    authFn: () => void;
    sdkFn: () => void;
  }) => {
    getWxLogin()
      .then(async (data) => {
        opts.sdkFn({
          status: true,
        });
        const res = await thirdLogin({
          app_id: import.meta.env.VITE_APP_WX_APPID,
          code: data.code,
          source: "WEIXIN",
          agree: 1,
          ...opts.params,
        }).catch((err) => {
          console.log("getWxLogin api error ", err);
          opts.authFn({
            status: false,
            errMsg: err?.msg,
          });
        });
        uni.log.info("uni.login thirdLogin---", res);
        if (res) {
          opts.authFn({
            status: true,
            data: res,
          });
        }
      })
      .catch((err) => {
        console.log("getWxLogin sdk error ", err);
        opts.sdkFn({
          status: false,
          errMsg: err,
        });
      });
  };

  // 抖音登录
  const dyLogin = (opts: {
    params: any;
    authFn: () => void;
    sdkFn: () => void;
  }) => {
    if (!isInstallDy()) {
      return opts.sdkFn({
        status: false,
        errMsg: "请安装抖音后重试",
      });
    }
    dyAuth(
      {
        scope: "user_info",
        state: "",
        optionalScope0: "",
        optionalScope1: "",
      },
      (data: {
        errorCode: number;
        authCode: string;
        state: string;
        msg: string;
      }) => {
        uni.log.info("dyLogin", data);
        if (data && data.errorCode === 0) {
          opts.sdkFn({
            status: true,
          });
          thirdLogin({
            app_id: import.meta.env.VITE_APP_DOUYIN_APPID,
            code: data.authCode,
            source: "DOUYIN",
            agree: 1,
            ...opts.params,
          })
            .then((res) => {
              uni.log.info("uni.login thirdLogin---", res);
              if (res) {
                opts.authFn({
                  status: true,
                  data: res,
                });
              }
            })
            .catch((err) => {
              opts.authFn({
                status: false,
                errMsg: err?.msg,
              });
            });
        } else {
          opts.sdkFn({
            status: false,
            errMsg: res?.msg,
          });
        }
      }
    );
  };

  return {
    wxLogin,
    wxBind,
    dyLogin,
  };
}
