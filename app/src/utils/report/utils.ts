import { isProd } from "@/utils/config";
import MD5 from "@/fetch/md5";
import * as wallesdk from "@/utils/walle/walle";
import * as humesdk from "@/utils/humesdk/humesdk";
// import { getInstall } from "@/utils/openinstall/openinstall";

export interface InstallDataProps {
  campaign_id?: string; // 推广ID
  campaign_extra: {
    // 推广额外参数
    path?: string; // 推广指定app地址
    apk?: string; // 推广指定apk地址
    [key: string]: any;
  };
}

export interface ChannelDataProps {
  p_channel: string; // 推广ID
  p_channel_id: string;
  p_campaign_id: string;
  p_campaign_extra: {
    path?: string; // 推广指定app地址
    apk?: string; // 推广指定apk地址
    [key: string]: any;
  };
}

/**
 * 获取渠道信息
 * @returns
 */
export async function getChannelData() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultChannelInfo = {
    extra: {
      p_channel: "MP_TOUTIAO",
      p_channel_id: "rZrH57mL",
      p_campaign_id: "KEV42Kyg",
      p_campaign_extra: "%7B%22path%22%3A%22pages%2Fmy%2Findex%22%7D",
    },
  };
  // 获取巨量分包信息
  const humeChannelInfo = humesdk.getChannel();

  // 获取美团分包信息
  const wallChannelInfo = wallesdk.getChannelInfo();
  // const wallChannelInfo = defaultChannelInfo;

  let p_channel = undefined; // 渠道名称
  let p_channel_id = undefined; // 渠道ID
  let p_campaign_id = undefined; // 预埋推广ID
  let p_campaign_extra = undefined; // 预埋推广额外参数

  if (wallChannelInfo && wallChannelInfo?.extra) {
    const channelInfo: ChannelDataProps = wallChannelInfo?.extra;
    p_channel = channelInfo?.p_channel;
    p_channel_id = channelInfo?.p_channel_id;
    p_campaign_id = channelInfo?.p_campaign_id;
    p_campaign_extra = channelInfo?.p_campaign_extra
      ? JSON.parse(decodeURIComponent(channelInfo?.p_campaign_extra))
      : {};
  }

  if (humeChannelInfo && humeChannelInfo.channel) {
    p_channel = humeChannelInfo.channel;
  }

  // console.log("wallChannelInfo", wallChannelInfo);
  // console.log("humeChannelInfo", humeChannelInfo);

  return {
    p_channel,
    p_channel_id,
    p_campaign_id,
    p_campaign_extra,
  };
}

/**
 * 设备信息
 * @returns
 */
export async function getDeviceInfo() {
  const {
    appid,
    launcher,
    origin,
    version,
    versionCode,
    innerVersion,
    uniVersion,
    launchLoadedTime,
    startupTime,
    isRecovery,
  } = plus.runtime;
  const systemInfo = uni.getSystemInfoSync() || {};
  const { networkType } = await uni.getNetworkType();
  const channelData = await getChannelData();

  // console.log("plus.runtime", plus.runtime);
  // console.log("systemInfo", systemInfo);
  // console.log("channelData", channelData);
  return {
    ...channelData,
    appid,
    params: plus.runtime?.arguments,
    launcher,
    origin,
    version,
    version_code: versionCode,
    inner_version: innerVersion,
    uni_version: uniVersion,
    launch_loaded_time: launchLoadedTime,
    startup_time: startupTime,
    is_recovery: isRecovery,
    release: systemInfo.appWgtVersion,
    system_client: systemInfo.platform,
    system_version: systemInfo.system,
    oaid: systemInfo.oaid,
    phone: systemInfo.deviceBrand,
    phone_model: systemInfo.deviceModel,
    environment: isProd ? "prod" : "dev",
    screen_area: `${systemInfo.screenWidth}*${systemInfo.screenHeight}`,
    device_id: systemInfo.deviceId,
    network: networkType,
    ua: systemInfo.ua,
    // reportVersion: "上报版本",
  };
}

/**
 * 生成用户sessionId
 * @param deviceId string
 * @returns
 */
export function getSessionId(deviceId: string) {
  if (!deviceId || deviceId.length <= 10) {
    deviceId = uni.$u.guid();
  }
  const encrypt = new MD5();
  return encrypt.hex_md5(`${deviceId}${new Date().getTime()}`); // 设备ID + 时间戳 MD5加密
}
