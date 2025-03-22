/**
 * 是否是荣耀手机
 * @returns boolean
 */
export function isHonor(): boolean {
  const systemInfo = uni.getSystemInfoSync() || {};
  return systemInfo.deviceBrand?.includes("honor");
}

/**
 * 是否是华为手机
 * @returns boolean
 */
export function isHuawei(): boolean {
  const systemInfo = uni.getSystemInfoSync() || {};
  return systemInfo.deviceBrand?.includes("huawei");
}

/**
 * 是否是小米手机
 * @returns boolean
 */
export function isXiaomi(): boolean {
  const systemInfo = uni.getSystemInfoSync() || {};
  return systemInfo.deviceBrand?.includes("xiaomi");
}
