/**
 * 秒杀商品状态
 */
export enum RaffleProductSkStatus {
  Down = "DOWN",
  Up = "UP",
}

// 即将开始，进行中，已结束
export enum RaffleShowStatus {
  UPCOMING = "即将开始",
  ONGOING = "进行中",
  ENDED = "已结束",
}

export enum RaffleProductStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  ENDED = "ENDED",
  NO = "NO", // "未中奖",
  YES = "YES", // "中奖",
  NONE = "NONE", // "未参与",
  ING = "ING", // "已参与",
}
