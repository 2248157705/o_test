export const isProd = import.meta.env.VITE_APP_ENV === "prod";
export const isDev = import.meta.env.VITE_APP_ENV === "test";
export const isAgreePrivacy = plus.runtime.isAgreePrivacy(); // 是否同意隐私政策

export const commonEvent = {
  GLOBAL_VIEW: "global_view", //点击全局视图
};
