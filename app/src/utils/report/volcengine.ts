/**
 * DataFinder 增长分析数据上报
 * https://www.volcengine.com/docs/84129/1261773
 */

const AppLog = uni.requireNativePlugin("RangersAppLogUniPluginCN");

/**
 * 初始化
 */
export function start() {
  AppLog.start();
}

/**
 * 账户登录
 * @param uid 用户id
 */
export function login(uid: string) {
  AppLog.setUserUniqueId(uid);
}

/**
 * 退出登录
 */
export function logout() {
  AppLog.setUserUniqueId(null);
}

/**
 * 设置用户属性
 * @param opts 用户属性
 */
export function profileSet(opts: { [key]: any }) {
  AppLog.profileSet(opts);
}

/**
 * 设置用户首次属性，如首次访问时间
 * @param opts 用户属性
 */
export function profileSetOnce(opts: { [key]: any }) {
  AppLog.profileSetOnce(opts);
}

/**
 * 删除用户的属性
 * @param key 属性
 */
export function profileUnset(key: string) {
  AppLog.profileUnset(key);
}

/**
 * 事件上报
 * @param event 事件名
 * @param opts 属性
 */
export function reportEvent(event: string, opts?: any) {
  AppLog.onEventV3(event, opts);
}

/**
 * 设置公共属性
 * @param opts 属性
 */
export function setHeaderInfo(opts: { [key]: any }) {
  AppLog.setHeaderInfo(opts);
}

/**
 * 获取平台ID与通知
 */
export function getDeviceID(): string {
  return AppLog.getDeviceID();
}

/**
 * 获取SDK初始化状态
 */
export function trackInited(): boolean {
  return AppLog.trackInited();
}

/**
 * 获取SDK启动状态
 */
export function hasStarted(): boolean {
  return AppLog.hasStarted();
}

export { AppLog };
