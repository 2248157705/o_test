import { loginIM } from "@/components/im/utils/connect";
import { useMessageStore } from "@/stores/message";
import { isApiJsonUrl } from "@/fetch/api-json-config";

export const DEFAULT_RETRY_COUNT: number = 2; // 默认重试次数
export const DEFAULT_RETRY_DELAY: number = 1000; // 默认重试延迟时间，单位：毫秒

// 请求参数类型
interface RequestOptions {
  baseUrl: string;
  url: string;
  data?: any;
  method?: string;
  header?: any;
  dataType?: string;
  retryCount?: number;
  retryIMCount?: number;
  retryDelay?: number;
  interceptError?: boolean;
  interceptDuplicate?: boolean; // 是否重试
  showLoading?: boolean;
}

export default class Request {
  config = {
    baseUrl: import.meta.env.VITE_APP_HOST,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "props-style": "underline",
    },
    method: "GET",
    dataType: "json",
    responseType: "text",
    success() {},
    fail() {},
    complete() {},
  };

  options = {
    retryCount: DEFAULT_RETRY_COUNT,
    retryIMCount: 1,
    retryDelay: DEFAULT_RETRY_DELAY,
    interceptError: true,
    interceptDuplicate: true, // 是否重试
    showLoading: true,
  };
  pendingRequests = new Set<string>();

  static posUrl(url: string) {
    /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
  }

  interceptor = {
    request(f) {
      if (f) {
        Request.requestBeforeFun = f;
      }
    },
    response(f) {
      if (f) {
        Request.requestComFun = f;
      }
    },
  };
  static requestBeforeFun(config) {
    return config;
  }

  static requestComFun(response) {
    return response;
  }
  // 更改基础请求路径
  setConfig(f) {
    // uni.log.info(f)
    // uni.log.info(this.config)
    this.config = f(this.config);
  }

  request<T = any>(options: RequestOptions): Promise<T> {
    // console.log(import.meta.env, "options.url");
    options = { ...this.options, ...options };
    options.baseUrl = options.baseUrl || this.config.baseUrl;
    options.dataType = options.dataType || this.config.dataType;
    options.url = Request.posUrl(options.url)
      ? options.url
      : options.baseUrl + options.url;
    options.data = options.data || {};
    options.header = options.header || this.config.header;
    options.method = options.method || this.config.method;
    // 添加请求到pendingRequests
    this.pendingRequests.add(options.url);
    return new Promise((resolve, reject) => {
      this.pendingRequests.delete(options.url);
      let next = true;
      let _config = null;
      options.complete = async (response) => {
        const imErrCode = response?.data?.code;
        const statusCode = response.statusCode;
        response.config = _config;

        if (statusCode === 200) {
          // 成功
          response = Request.requestComFun(response);
          this.pendingRequests.delete(options.url);
          resolve(response);
        } else if (options.url.includes("/client/event/report")) {
          this.pendingRequests.delete(options.url);
          resolve({});
        } else if (imErrCode === 50041) {
          const messageStore = useMessageStore();
          messageStore.setLoginCredential("");
          this.pendingRequests.delete(options.url);
          loginIM();
        } else {
          // 移除pendingRequests中的请求
          this.pendingRequests.delete(options.url);
          if (options.retryCount > 0) {
            // 如果有剩余重试次数，则进行重试
            setTimeout(() => {
              console.log(`Retrying request: ${options.url}`);

              // 如果JSON api重试请求，则使用原始请求参数
              if (isApiJsonUrl(_config.url) && _config.originRequest) {
                options.url = _config.originRequest.url;
                options.data = _config.originRequest.data;
                options.method = _config.originRequest.method;
                options.originRequest = _config.originRequest;
              }

              this.request({ ...options, retryCount: options.retryCount - 1 })
                .then(resolve)
                .catch(reject);
            }, options.retryDelay);
          } else {
            // 如果已经达到重试次数上限，则直接返回错误
            if (options.interceptError) {
              console.error("Request error intercepted:");
              reject(new Error("Request error intercepted"));
            } else {
              reject();
            }
          }
        }
      };
      const cancel = (t = "handle cancel") => {
        const err = {
          errMsg: t,
          config: afC,
        };
        reject(err);
        next = false;
      };
      const afC = { ...this.config, ...options };
      _config = { ...afC, ...Request.requestBeforeFun(afC, cancel) };
      if (!next) return;
      uni.request(_config);
    });
  }

  // 设置 get 和 post 请求 需要url请求地址 data所需参数
  get<T = any>(url, data, options = {}): Promise<T> {
    options.url = url;
    options.data = data;
    options.method = "GET";
    // 使用 this.request 发起请求，传入参数，获取数据
    return this.request(options);
  }
  post<T = any>(url, data, options = {}): Promise<T> {
    options.url = url;
    options.data = data;
    options.method = "POST";
    return this.request(options);
  }
}
