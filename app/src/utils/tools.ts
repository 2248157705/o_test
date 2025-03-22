import storage, { cacheKeyEnums } from "@/utils/storage";
import { getSystemData } from "./index";

const tools = {
  // 获取APP的设备信息（唯一标识）
  getClientInfo() {
    return new Promise((resolve) => {
      const client_info = storage.get(cacheKeyEnums.CLIENT_INFO) || null;
      if (client_info && client_info.clientId) {
        return resolve(client_info);
      }
      const result = (info) => {
        info = info ? info : { clientId: plus.device.uuid };
        storage.set(cacheKeyEnums.CLIENT_INFO, info);
        resolve(info);
      };
      const systemData = getSystemData();
      result({ clientId: systemData.deviceId });
    });
  },
};

export default tools;
