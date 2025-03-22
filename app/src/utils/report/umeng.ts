import * as Events from "./event";

/**
 * 获取上报参数
 * https://www.html5plus.org/doc/zh_cn/runtime.html
 * @returns {}
 */

/**
 * 产品上报
 * @param eventId 事件ID
 * @returns
 */
export function eventTrig(
  eventId: string,
  opts: {
    form: string;
    [key: string]: any;
  }
) {
  if (!eventId.trim()) {
    return uni.log.error("eventTrig eventId is null");
  }
  if (!plus.statistic || !plus.statistic.eventTrig) {
    return uni.log.error("plus.statistic.eventTrig is undefined");
  }
  uni.log.info("eventTrig--->", eventId, opts);
  plus.statistic.eventTrig(eventId, opts);
}

export default Events;
