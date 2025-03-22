import { RaffleShowStatus, RaffleProductStatus } from "@/enums/raffle";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration); // 控制dayjs加载duration插件
export const getEventStatus = (startTime, endTime, type = "list") => {
  const now = dayjs();
  const start = dayjs(startTime);
  const end = dayjs(endTime);

  // 当前时间还未达到开始时间
  if (now.isBefore(start)) {
    const diff = type == "list" ? start.diff(now) : end.diff(now);
    const remainingTimeToStart = dayjs.duration(diff);
    const hours = remainingTimeToStart.hours();
    const minutes = remainingTimeToStart.minutes();
    const seconds = remainingTimeToStart.seconds();
    return {
      hours,
      minutes,
      seconds,
      status: RaffleShowStatus.UPCOMING,
      timeTitle: dayjs(startTime).format("M月D日 HH:mm"),
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
      status: RaffleShowStatus.ONGOING,
      timeTitle: dayjs(startTime).format("M月D日 HH:mm"),
    };
  }

  // 当前时间已经超过结束时间
  if (now.isAfter(end)) {
    return {
      status: RaffleShowStatus.ENDED,
      timeTitle: dayjs(endTime).format("M月D日 HH:mm"),
    };
  }
};

export const getProductStatus = (status, raffleOrderDetail) => {
  if (status == RaffleShowStatus.UPCOMING) {
    return RaffleProductStatus.UPCOMING;
  } else {
    if (status == RaffleShowStatus.ONGOING && !raffleOrderDetail) {
      return RaffleProductStatus.ONGOING;
    }
    if (!raffleOrderDetail) {
      return RaffleProductStatus.NONE;
    }
    return raffleOrderDetail.winStatus;
  }
};
