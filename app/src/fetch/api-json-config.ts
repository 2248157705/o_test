/* eslint-disable @typescript-eslint/no-unused-vars */
import { has, isEqual } from "lodash-es";
import { isProd } from "@/utils/config";

enum RequestMethods {
  GET = "GET",
  POST = "POST",
}

export const apiJsonHost =
  import.meta.env.VITE_APP_CDN_HOST +
  (isProd ? "/mapper/prod" : "/mapper/test");

export const api = {
  game_list: "/client/game/getGameList", // 游戏列表
  game_detail: "/client/game/getGameDetail", // 游戏信息
  order_ranking: "/client/order/ranking", // 排行榜
  banner_list: "/client/banner/list", // 轮播图
  product_list: "/client/product/getProductList", // 商品列表
  product_search_key: "/client/product/generateSearchRecommendKey", // 获取商品列表搜索词条
  common_config: "/client/config/getByCodes", // 获取全局配置
};

export const isEqualKey = (keys: string[], data: any) => {
  const dataKeys = Object.keys(data);
  if (dataKeys.length !== keys.length) {
    return false;
  } else {
    return isEqual(keys, dataKeys);
  }
};

/**
 * 接口json配置
 */
export const apiJsonConfig = {
  [api.game_list]: {
    disabled: false,
    api_url: api.game_list,
    method: RequestMethods.POST,
    getJsonUrl: () => {
      return "/client/game/getGameList.json";
    },
    isFetchJson: (params) => {
      return (
        !params ||
        Object.keys(params).length === 0 ||
        isEqual(params, {
          page: 1,
          per_page: 8,
        })
      );
    },
  },
  [api.order_ranking]: {
    disabled: false,
    api_url: api.order_ranking,
    method: RequestMethods.GET,
    getJsonUrl: () => {
      return "/client/order/ranking.json";
    },
    isFetchJson: null,
  },
  [api.banner_list]: {
    disabled: false,
    api_url: api.banner_list,
    method: RequestMethods.POST,
    getJsonUrl: (params) => {
      if (isEqualKey(["display_terminal"], params)) {
        return `/client/banner/list/display_terminal/${params.display_terminal}.json`;
      } else {
        return "";
      }
    },
    isFetchJson: null,
  },
  [api.game_detail]: {
    disabled: false,
    api_url: api.game_detail,
    method: RequestMethods.POST,
    getJsonUrl: (params) => {
      if (isEqualKey(["gameId", "estimate"], params)) {
        return `/client/game/getGameDetail/${params.gameId}/estimate/${params.estimate}.json`;
      } else if (isEqualKey(["gameId"], params)) {
        return `/client/game/getGameDetail/${params.gameId}.json`;
      }
      return "";
    },
    isFetchJson: null,
  },
  [api.product_list]: {
    disabled: false,
    api_url: api.product_list,
    method: RequestMethods.POST,
    getJsonUrl: (params = {}) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { uid, ...rest } = params;
      rest.orderBy = rest.orderBy || "desc";
      rest.orderByKey = rest.orderByKey || "popularity";
      const orderFlag =
        rest.orderBy === "desc" && rest.orderByKey === "popularity";
      if (
        isEqualKey(
          [
            "page",
            "perPage",
            "orderBy",
            "orderByKey",
            "gameId",
            "productLabel",
          ],
          rest
        ) &&
        orderFlag
      ) {
        return `/client/product/getProductList/${params.gameId}/productLabel/${params.productLabel}.json`;
      } else if (
        isEqualKey(
          ["page", "perPage", "orderBy", "orderByKey", "gameId"],
          rest
        ) &&
        orderFlag
      ) {
        return `/client/product/getProductList/${params.gameId}.json`;
      }
      return "";
    },
    isFetchJson: (params = {}) => {
      if (
        has(params, "page") &&
        has(params, "perPage") &&
        has(params, "gameId") &&
        params?.page === 1
      ) {
        return true;
      }
      return false;
    },
  },
  [api.product_search_key]: {
    disabled: false,
    api_url: api.product_search_key,
    method: RequestMethods.POST,
    getJsonUrl: () => {
      return `/client/product/generateSearchRecommendKey.json`;
    },
    isFetchJson: null,
  },
  [api.common_config]: {
    disabled: false,
    api_url: api.common_config,
    method: RequestMethods.POST,
    getJsonUrl: () => {
      return `/client/config/getByCodes.json`;
    },
    isFetchJson: null,
  },
};

// 获取pathname
export const getPathname = (url) => {
  if (url.includes("http://") || url.includes("https://")) {
    const urlParts = url.split("/");
    return "/" + urlParts.slice(3).join("/");
  } else {
    return url;
  }
};

// 获取接口url json地址
export const getApiJsonUrl = (url: string, data = {}) => {
  if (url) {
    url = getPathname(url);
    // console.log("getApiJsonUrl url", url);
    const cfg = apiJsonConfig[url];
    if (cfg && !cfg.disabled) {
      const {
        request_time,
        sign,
        loading,
        ignoreError,
        hideMsg,
        showLoading,
        ...rest
      } = data;
      const flag = cfg.isFetchJson ? cfg.isFetchJson(rest) : true;
      const jsonUrl = cfg.getJsonUrl(rest);
      if (flag && jsonUrl) {
        return apiJsonHost + jsonUrl;
      }
    }
  }
  return null;
};

// 获取接口url请求配置
export const getApiUrlCfg = (url: string) => {
  if (url) {
    url = getPathname(url);
    const cfg = apiJsonConfig[url];
    if (cfg) {
      return {
        method: cfg.method,
        url: cfg.api_url,
      };
    }
  }
  return null;
};

// 是否为接口json地址
export const isApiJsonUrl = (url: string) => {
  if (
    url.includes(import.meta.env.VITE_APP_CDN_HOST + "") &&
    url.includes(".json")
  ) {
    return true;
  }
  return false;
};
