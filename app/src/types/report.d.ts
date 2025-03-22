import { ReportPlatform, ReportType } from "@/enums/common";

/**
 * ApkUpgradeInfoReq
 */
export interface ApkUpgradeInfoReq {
  /**
   * 投放标识
   */
  campaignId?: string;
  /**
   * 渠道代号
   */
  channel?: string;
  /**
   * 分包标识
   */
  channelId?: string;
  /**
   * 包版本
   */
  version?: string;
}

export interface ReportEventReq {
  device_info?: DeviceInfo; // 系统设备参数
  list: ReportEventList[]; // 事件
  stime: number; // 服务端时间毫秒
}

export interface ReportEventList {
  ctime: number; // 上报时间毫秒
  event_desc?: string; // 事件中文
  event_id: string; // 事件英文
  type: ReportType; // 类型
  platform: ReportPlatform; // 渠道
  need_decode?: string[]; // base64的字段
  props?: {
    //  上报业务参数
    [key: string]: any;
  };
  ext?: {
    // 其他
    [key: string]: any;
  };
}

export interface DeviceInfo {
  appid: string; // 当前应用的APPID
  device_id: string; // 设备ID
  params: string; // 第三方程序调用时传递给程序的参数
  channel: string; // 应用的渠道标识
  launcher: string; // 启动来源
  origin: string; // 安装来源
  version: string; // 客户端的版本名称
  version_code: string; // 客户端的版本号
  inner_version: string; // 客户端5+运行环境的内部版本号
  uni_version: string; // 客户端uni-app运行环境的版本号
  launch_loaded_time: number; // 获取当前应用首页加载的时间
  startup_time: number; // 获取当前应用的启动时间戳
  is_recovery: boolean; // 应用是否由于内核崩溃自动恢复
  system_client: string; // 系统类型
  system_version: number; // 系统版本
  phone: string; // 手机品牌
  phone_model: string; // 手机型号
  env: string; // 环境
  screen_area: string; // 手机屏幕尺寸100x100
  network: string; // 网络类型
  ua: string;
  report_version: string; // 上报版本
  report_time: string; // 上报时间
  campaign_id: string; // 推广ID
  campaign_extra: {
    // 推广额外参数
    [key: string]: any;
  };
  p_channel: string; // 渠道名称
  p_channel_id: string; // 渠道ID
  p_campaign_id: string; // 预埋推广ID
  p_campaign_extra: {
    // 预埋推广额外参数
    [key: string]: any;
  };
}
