import { SeckillShowStatus } from "@/enums/seckill";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration); // 控制dayjs加载duration插件
export const getEventStatus = (startTime, endTime) => {
  const now = dayjs();
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  // 当前时间还未达到开始时间
  if (now.isBefore(start)) {
    const diff = start.diff(now);
    const remainingTimeToStart = dayjs.duration(diff);
    const hours = remainingTimeToStart.hours();
    const minutes = remainingTimeToStart.minutes();
    const seconds = remainingTimeToStart.seconds();
    return {
      hours,
      minutes,
      seconds,
      status: SeckillShowStatus.UPCOMING,
    };
  }

  // 当前时间位于开始和结束时间之间
  if (now.isAfter(start) && now.isBefore(end)) {
    const diff = end.diff(now);
    const remainingTimeToEnd = dayjs.duration(diff);
    const hours = remainingTimeToEnd.hours();
    const minutes = remainingTimeToEnd.minutes();
    const seconds = remainingTimeToEnd.seconds();
    return {
      hours,
      minutes,
      seconds,
      status: SeckillShowStatus.ONGOING,
    };
  }

  // 当前时间已经超过结束时间
  if (now.isAfter(end)) {
    return { status: SeckillShowStatus.ENDED };
  }
};
