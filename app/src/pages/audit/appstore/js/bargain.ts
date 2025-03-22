import { reactive } from "vue";
import type {
  CreateOrderBargainReq,
  AgainOrderBargainReq,
  HandleOrderBargainReq,
  OrderBargainDetailReq,
  OrderBargainListReq,
  OrderBargainListRes,
} from "@/types/order";
import {
  createOrderBargain,
  againOrderBargain,
  handleOrderBargain,
  orderBargainDetail,
  orderBargainList,
  getOrderPurchasePreview,
} from "@/api/order";
import { consultCustomerService } from "@/components/im/conversation-list";
import { BargainStatus, PurchaseStatus } from "@/enums/order";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration); // 控制dayjs加载duration插件

export function Bargain() {
  const bargainData = reactive({
    bidder: "seller",
  });

  // 创建出价单
  const fetchCreateOrderBargain = async (opts: CreateOrderBargainReq) => {
    const data = await createOrderBargain(opts);
    return data;
  };

  // 出价or还价
  const fetchAgainOrderBargain = async (opts: AgainOrderBargainReq) => {
    const data = await againOrderBargain(opts);
    return data;
  };

  // 处理出价（同意or拒绝）
  const fetchHandleOrderBargain = async (opts: HandleOrderBargainReq) => {
    const data = await handleOrderBargain(opts);
    return data;
  };

  // 出价详情
  const getOrderBargainDetail = async (opts: OrderBargainDetailReq) => {
    const data = await orderBargainDetail(opts);
    return data;
  };

  // 出价列表
  const getOrderBargainList = async (opts: OrderBargainListReq) => {
    const data = await orderBargainList(opts);
    return data;
  };

  return {
    bargainData,
    fetchCreateOrderBargain,
    fetchAgainOrderBargain,
    fetchHandleOrderBargain,
    getOrderBargainDetail,
    getOrderBargainList,
  };
}

export const getCountDownTime = (endTime) => {
  if (endTime) {
    return dayjs(endTime).valueOf() - dayjs().valueOf();
  }
  return 0;
};

export const getCountDown = (endTime) => {
  if (endTime) {
    const now = dayjs(); // 获取当前时间
    const futureTime = dayjs(endTime); // 设定未来的时间

    const diff = futureTime.diff(now); // 计算时间差，单位为毫秒

    const d = dayjs.duration(diff); //将差值转换为 dayjs 的 duration 对象

    // 提取 hours, minutes, seconds
    const hours = d.hours() + d.days() * 24; // 将天数转为小时
    const minutes = d.minutes();
    const seconds = d.seconds();
    return {
      hours,
      minutes,
      seconds,
    };
  }
  return {};
};
export const getBargainStatusData = (
  bargainData: OrderBargainListRes,
  bidder: string,
  bargainRef: any,
  createOrderRef: any,
  closeBargainRef: any,
  purchasePopupRef: any
) => {
  const { bargain_status, bargain_no, bid_history, product, order_id } =
    bargainData;
  const recordsCount = bid_history.records.length;
  const state = reactive({
    color: "",
    msg: "",
    operation: [],
  });
  if (bidder == "buyer") {
    if ([BargainStatus.WAIT_SELLER].includes(bargain_status)) {
      state.color = "red";
      state.msg = "后取消";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: async () => {
          await consultCustomerService();
        },
      });
    } else if ([BargainStatus.SELLER_REFUSE].includes(bargain_status)) {
      state.color = "grey";
      state.msg = "已失效";
      if (recordsCount == 1) {
        state.operation.push({
          name: "议价",
          color: "white",
          controls: async () => {
            bargainRef.open();
          },
        });
      } else {
        state.operation.push({
          name: "联系客服",
          color: "grey",
          controls: async () => {
            await consultCustomerService();
          },
        });
      }
    } else if ([BargainStatus.WAIT_BUYER].includes(bargain_status)) {
      state.color = "green";
      state.msg = "待处理";

      state.operation.push({
        name: "同意还价",
        color: "green",
        controls: () => {
          createOrderRef.open();
        },
      });
      // 如果是只有 小于两条数据 即可重新出价
      if (recordsCount <= 2) {
        state.operation.unshift({
          name: "重新出价",
          color: "white",
          controls: () => {
            bargainRef.open();
          },
        });
      }
    } else if (
      [BargainStatus.SELLER_AGREE, BargainStatus.BUY_AGREE].includes(
        bargain_status
      )
    ) {
      state.color = "green";
      state.msg = "已同意";
      state.operation.push({
        name: "立即购买",
        color: "green",
        controls: async () => {
          await getOrderPurchasePreview({
            product_id: product.product_id,
          })
            .then(() => {
              uni.navigateTo({
                url: `/pages/goods/front-buy?product_id=${product.product_id}`,
              });
            })
            .catch(({ code }) => {
              // 重复下单
              if (code && code == PurchaseStatus.ORDER_DUPLICATE) {
                purchasePopupRef.open();
              }
            });
        },
      });
    } else if ([BargainStatus.FINISH].includes(bargain_status)) {
      state.color = "green";
      state.msg = "";
      state.operation.push({
        name: "查看订单",
        color: "green",
        controls: () => {
          uni.log.info(order_id);
          uni.navigateTo({
            url: `/pages/order/detail?orderId=${order_id}`,
          });
        },
      });
    } else {
      state.color = "grey";
      state.msg = "已失效";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: async () => {
          await consultCustomerService();
        },
      });
    }
  }

  if (bidder == "seller") {
    if ([BargainStatus.WAIT_SELLER].includes(bargain_status)) {
      state.color = "red";
      state.msg = "后取消";
      state.operation.push(
        {
          name: "拒绝",
          color: "white",
          controls: async (callBack) => {
            const data = await handleOrderBargain({
              uid: product.uid,
              bargain_no,
              bargain_record_id: bid_history.now_record.id,
              status: false,
            });
            if (data) {
              uni.$main.toast("已拒绝");
              callBack && callBack();
            }
          },
        },
        {
          name: "同意",
          color: "green",
          controls: () => {
            createOrderRef.open();
          },
        }
      );
      if (recordsCount <= 3) {
        state.operation.splice(1, 0, {
          name: "还价",
          color: "white",
          controls: () => {
            bargainRef.open();
          },
        });
      }
    } else if ([BargainStatus.WAIT_BUYER].includes(bargain_status)) {
      state.color = "green";
      state.msg = "已还价";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: async () => {
          await consultCustomerService();
        },
      });
    } else if (
      [BargainStatus.BUY_AGREE, BargainStatus.SELLER_AGREE].includes(
        bargain_status
      )
    ) {
      state.color = "green";
      state.msg = "已同意";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: async () => {
          await consultCustomerService();
        },
      });
    } else if ([BargainStatus.FINISH].includes(bargain_status)) {
      state.color = "green";
      state.msg = "";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: () => {
          uni.log.info(order_id);
          uni.navigateTo({
            url: `/pages/order/detail?orderId=${order_id}`,
          });
        },
      });
    } else {
      state.color = "grey";
      state.msg = "已失效";
      state.operation.push({
        name: "联系客服",
        color: "grey",
        controls: async () => {
          await consultCustomerService();
        },
      });
    }
  }
  return state;
};
