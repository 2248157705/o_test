/**
 * DataFinder 增长分析数据上报
 * https://www.volcengine.com/docs/84129/1261773
 */

interface BuglyProps {
  appID: string;
  // 【必需设置】在Bugly 专业版 注册产品的appKey
  appKey: string;
  // 【推荐设置】设置设备唯一ID，必须保证唯一性，不设置则由Bugly生成唯一ID，影响设备异常率的统计以及联网设备数的统计,建议sp保存复用;
  uniqueId: string;
  // 【推荐设置】设置用户ID，影响用户异常率的统计,建议sp保存复用，同一进程生命周期里面，暂不支持多次设置;
  userId: string;
  // 【推荐设置】设置设备类型，设置机型后，Bugly SDK不再读取系统的机型
  deviceModel: string;
  // 【推荐设置】设置App版本号，不设置则从packageManager中读取。建议按应用的规范，主动设置，需要跟上传符号表的应用版本参数保持一致。
  appVersion: string;
  // 【推荐设置】设置App版本的构建号，用于Java堆栈翻译关联版本，跟上传符号表的构建号参数保持一致。
  buildNumber: string;
  // 【推荐设置】设置版本类型
  appVersionType: string;
  // 设置App的渠道
  appChannel: string;
  //设置Crash时是否抓取全部线程堆栈，默认开启
  enableAllThreadStackCrash: boolean;
  //设置Anr时是否抓取全部线程堆栈，默认开启
  enableAllThreadStackAnr: boolean;
  //设置性能监控时开启Crash保护模式，默认开启
  enableCrashProtect: boolean;
}

const Bugly = uni.requireNativePlugin("BuglyModule");

/**
 * 初始化
 */
export function init(opts: BuglyProps, cb: () => void) {
  Bugly?.init(opts, cb);
}

/**
 * 更新设备id
 */
export function updateUniqueId(deviceId: string, cb: () => void) {
  Bugly?.updateUniqueId(
    {
      deviceId,
    },
    cb
  );
}

/**
 * 更新用户id
 */
export function updateUserId(userId: string, cb: () => void) {
  Bugly?.updateUserId(
    {
      userId,
    },
    cb
  );
}

/**
 * 更新设备型号
 */
export function updateDeviceModel(model: string, cb: () => void) {
  Bugly?.updateDeviceModel(
    {
      model,
    },
    cb
  );
}

/**
 * 上报自定义异常
 */
export function postException(
  opts: {
    errorMsg: string;
    errorType?: string;
    stack?: string;
    extraInfo?: { [key: string]: any };
  },
  cb: () => void
) {
  Bugly?.postException(
    {
      // 异常类型 u3d c# : 4 ｜ js : 8 ｜ cocos2d lua : 6
      category: 8,
      // 错误类型
      errorType: opts.errorType,
      // 错误信息
      errorMsg: opts.errorMsg,
      // 出错堆栈
      stack: opts.stack,
      // 额外信息
      extraInfo: opts.extraInfo,
    },
    cb
  );
}

/**
 * 崩溃测试
 */
export function crashTest(type: "Java" | "Native", cb: () => void) {
  Bugly?.crashTest(
    {
      type,
    },
    cb
  );
}
