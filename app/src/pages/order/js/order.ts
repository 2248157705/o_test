import type { PurchaseRefundApplyReq } from "@/types/order";
import { ref, reactive } from "vue";
import { ApplyOrderType } from "@/enums/common";
import dayjs from "dayjs";
import { OrderStatus, OrderType, RefundApplyType } from "@/enums/order";
import {
  getOrderDetail,
  getOrderStatus,
  getOrderList,
  afterSaleApply,
  updatePurchaseStatus,
  purchaseRefundApply,
} from "@/api/order";
import { getAfterSaleTidByOrderId } from "@/api/chat";
import { selectSesstion } from "@/components/im/conversation-list/index";

interface GoodsOrderProps {
  refresh?: () => void;
}

export const orderStatusMap = {
  CLOSED: "超时交易关闭",
  FINISHED: "交易完成",
  PAID: "", // 已支付
  SENDING: "发货中",
  UNPAID: "待付款",
  WAIT_RECEIVE: "待收货",
  WAIT_SEND: "待发货",
  AFTER_SALE_COMPLETED: "售后处理已完结",
  AFTER_SALE_REJECTED: "售后被拒绝",
  AFTER_SALE_REQUESTED: "售后处理中",
  AFTER_SALE_PROCESSING: "退款执行中",
  REFUND_COMPLETED: "退款成功",
  REFUND_REJECTED: "退款被拒绝",
  REFUND_REQUESTED: "退款处理中",
  CLAIMS_REQUESTED: "理赔处理中",
  CLAIMS_PROCESSING: "理赔执行中",
  CLAIMS_COMPLETED: "理赔完成",
  CLAIMS_REJECTED: "理赔被拒绝",
};

export const orderActionMap = {
  PAID: "PAID", // 立即付款
  RECEIVE: "RECEIVE", // 确认收货
  REFUND: "REFUND", // 申请退款
  CONTACT: "CONTACT", // 申请售后
  CLAIMS: "CLAIMS", // 申请理赔
  SERVICE: "SERVICE", // 联系客服
  ORDER_CHAT: "ORDER_CHAT", // 交易群聊
  AFTERSALE_CHAT: "AFTERSALE_CHAT", // 售后群聊
  CLOSE: "CLOSE", // 取消订单
  FEEDBACK: "FEEDBACK", // 联系专属客服
  NONE: "NONE",
};

export const refundApplyReasonOptions = [
  {
    disabled: false,
    value: RefundApplyType.NONE,
    name: "无理由",
  },
  {
    disabled: false,
    value: RefundApplyType.NO_WANT,
    name: "不想要了",
  },
  {
    disabled: false,
    value: RefundApplyType.SELLER_NO_DELIVER,
    name: "卖家不发货",
  },
  {
    disabled: false,
    value: RefundApplyType.WANT_BUY_OTHER,
    name: "想买其他",
  },
];

export const afterSaleApplyReasonOptions = [
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_RETRIEVED,
    name: "账号被找回",
  },
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_FROZEN,
    name: "账号被冻结",
  },
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_BLOCKED,
    name: "账号被封禁",
  },
  {
    disabled: false,
    value: RefundApplyType.OTHER_REASON,
    name: "其他原因",
  },
];

export const afterClaimsApplyReasonOptions = [
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_RETRIEVED,
    name: "账号被找回",
  },
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_FROZEN,
    name: "账号被冻结",
  },
  {
    disabled: false,
    value: RefundApplyType.ACCOUNT_BLOCKED,
    name: "账号被封禁",
  },
  {
    disabled: false,
    value: RefundApplyType.REFUND_BY_CONSENSUS,
    name: "协商一致退款",
  },
  {
    disabled: false,
    value: RefundApplyType.OTHER_REASON,
    name: "其他原因",
  },
];

export function GoodsOrder(orderOpts: GoodsOrderProps) {
  const refundRef = ref();

  const orderData = reactive({
    loading: false,
    list: [],
  });

  const detailData = reactive({
    loading: false,
    detail: {},
    orderId: null,
  });

  const tidData = reactive({
    loading: false,
    tid: null,
  });

  const refundApplyData = reactive({
    title: "",
    action: "", // refund,afterSale
    options: [],
    formData: {},
  });

  // 获取订单详情
  const fetchOrderDetail = async (orderId: string) => {
    if (!detailData.loading) {
      detailData.loading = true;
      const data = await getOrderDetail(orderId).catch((err) => {
        detailData.loading = false;
        uni.$main.toast(err?.msg);
      });
      if (data.order_id) {
        detailData.detail = data;
        uni.log.info(detailData.detail, " detailData.detail ");
        detailData.orderId = data.order_id;
      }
      detailData.loading = false;
    }
  };

  // 获取订单状态
  const fetchOrderStatus = async (orderId: number) => {
    const data = await getOrderStatus({
      order_id: orderId,
      pay_order_no: "",
    }).catch((err) => {
      uni.$main.toast(err?.msg);
    });
    if (data) {
      // fetchOrderDetail(orderId);
    }
  };

  // 获取订单列表
  const fetchOrderList = async () => {
    if (!orderData.loading) {
      orderData.loading = true;
      const data = await getOrderList().catch((err) => {
        orderData.loading = false;
        uni.$main.toast(err?.msg);
      });
      if (data) {
        orderData.list = data.list;
      }
      orderData.loading = false;
    }
  };

  // 确认收货
  const fetchUpdatePurchaseStatus = async (order_id: string) => {
    const data = await updatePurchaseStatus({
      order_id: order_id,
      to_order_status: OrderStatus.FINISHED,
    }).catch((err) => {
      uni.$main.toast(err?.msg);
    });
    if (data) {
      uni.$main.toast("收货成功");
      orderOpts?.refresh();
    }
  };

  // 取消订单
  const fetchClosePurchase = async (order_id: string) => {
    const data = await updatePurchaseStatus({
      order_id: order_id,
      to_order_status: OrderStatus.CLOSED,
    }).catch((err) => {
      uni.$main.toast(err?.msg);
    });
    if (data) {
      uni.$main.toast("取消成功");
      orderOpts?.refresh();
    }
  };

  // 售后申请
  const fetchAfterSaleApply = async (opts: PurchaseRefundApplyReq) => {
    const data = await afterSaleApply(opts).catch((err) => {
      uni.$main.toast("提交失败");
      uni.log.info(err);
    });
    if (data) {
      refundRef.value?.close();
      uni.$main.toast("提交成功");
      orderOpts?.refresh();
    }
  };

  // 退款申请
  const fetchPurchaseRefundApply = async (opts: PurchaseRefundApplyReq) => {
    const data = await purchaseRefundApply(opts).catch((err) => {
      uni.log.info("err", err);
      uni.$main.toast("提交失败");
    });
    if (data) {
      refundRef.value?.close();
      uni.$main.toast("提交成功");
      orderOpts?.refresh();
    }
  };

  // 根据订单号获取售后群ID
  const fetchAfterSaleTidByOrderId = async (
    orderId: string,
    order_type: string
  ) => {
    if (!tidData.loading) {
      tidData.loading = true;
      const data = await getAfterSaleTidByOrderId({
        order_id: orderId,
        order_type: order_type,
      }).catch((err) => {
        uni.log.info("fetchAfterSaleTidByOrderId", err);
        tidData.loading = false;
        uni.$main.toast(err?.msg || "进入失败");
      });
      if (data && data.tid) {
        tidData.tid = data.tid;
        await selectSesstion(data.tid, false);
      }
      tidData.loading = false;
    }
  };

  return {
    refundRef,
    orderData,
    detailData,
    refundApplyData,
    tidData,
    fetchOrderList,
    fetchOrderStatus,
    fetchOrderDetail,
    fetchUpdatePurchaseStatus,
    fetchAfterSaleApply,
    fetchPurchaseRefundApply,
    fetchAfterSaleTidByOrderId,
    fetchClosePurchase,
  };
}

/**
 * 获取倒计时时间
 * @param endTime 结束时间
 * @returns
 */
export const getCountDownTime = (endTime) => {
  if (endTime) {
    return dayjs(endTime).valueOf() - dayjs().valueOf();
  }
  return 0;
};

/**
 * 获取订单状态数据
 * @param status  订单状态
 * @param order_type  订单类型
 * @param orderData  订单数据
 * @returns
 */
export const getOrderStatusData = (
  status: OrderStatus,
  order_type: OrderTyp,
  order_data?: {
    insurance_id?: string; // 理赔ID
  }
) => {
  // console.log("getOrderStatusData", orderData);
  const state = {
    color: "green", // green|red|''
    name: "联系客服", // 按钮名称
    msg: "", // 提示信息
    action: orderActionMap.SERVICE, // 订单操作
    status: status, // 订单状态
    type: order_type, // 订单类型
    sub_type: null, // 申请类型
  };
  const isHasClaims = order_data?.insurance_id; // 是否有理赔

  if ([OrderStatus.UNPAID].includes(status)) {
    state.color = "red";
    state.name = "立即付款";
    state.msg = "待付款";
    state.action = orderActionMap.PAID;
  } else if ([OrderStatus.WAIT_SEND, OrderStatus.PAID].includes(status)) {
    if (order_type === OrderType.RECYCLING) {
      // 回收订单
      state.color = "";
      state.name = "";
      state.msg = "待发货";
      state.action = orderActionMap.NONE;
    } else {
      state.color = "green";
      state.name = "申请退款";
      state.msg = "待发货";
      state.action = orderActionMap.REFUND;
    }
  } else if ([OrderStatus.FINISHED].includes(status)) {
    if (isHasClaims) {
      state.color = "green";
      state.name = "申请理赔";
      state.msg = "已确认收货";
      state.action = orderActionMap.CLAIMS;
    } else {
      state.color = "green";
      state.name = "申请售后";
      state.msg = "已确认收货";
      state.action = orderActionMap.CONTACT;
    }
  } else if ([OrderStatus.SENDING, OrderStatus.WAIT_RECEIVE].includes(status)) {
    state.color = "green";
    state.name = "确认收货";
    state.msg = "已发货";
    state.action = orderActionMap.RECEIVE;
  } else if ([OrderStatus.CLOSED].includes(status)) {
    state.color = "";
    state.name = "";
    state.msg = orderStatusMap[status];
    state.action = null;
  } else if (status == OrderStatus.AFTER_SALE_REJECTED) {
    state.color = "green";
    state.name = "再次售后";
    state.msg = orderStatusMap[status];
    state.action = orderActionMap.CONTACT;
  } else if (
    [
      OrderStatus.CLAIMS_REQUESTED,
      OrderStatus.CLAIMS_PROCESSING,
      OrderStatus.CLAIMS_COMPLETED,
      OrderStatus.CLAIMS_REJECTED,
    ].includes(status)
  ) {
    // 申请理赔客服
    state.color = "green";
    state.name = "联系客服";
    state.msg = orderStatusMap[status];
    state.action = orderActionMap.AFTERSALE_CHAT;
    state.sub_type = ApplyOrderType.APPLY_ORDER_PAYMENT_CLAIM;
  } else if (
    [
      OrderStatus.REFUND_COMPLETED,
      OrderStatus.REFUND_REJECTED,
      OrderStatus.REFUND_REQUESTED,
    ].includes(status)
  ) {
    // 申请退款客服
    state.color = "green";
    state.name = "联系客服";
    state.msg = orderStatusMap[status];
    state.action = orderActionMap.AFTERSALE_CHAT;
    state.sub_type = ApplyOrderType.APPLY_ORDER_REFUND;
  } else if (
    [
      OrderStatus.AFTER_SALE_COMPLETED,
      OrderStatus.AFTER_SALE_REQUESTED,
      OrderStatus.AFTER_SALE_PROCESSING,
    ].includes(status)
  ) {
    // 申请售后客服
    state.color = "green";
    state.name = "联系客服";
    state.msg = orderStatusMap[status];
    state.sub_type = ApplyOrderType.APPLY_ORDER_AFTER_SALE;
    if (order_type === OrderType.RECYCLING) {
      // 回收订单
      state.action = orderActionMap.SERVICE;
    } else {
      state.action = orderActionMap.AFTERSALE_CHAT;
    }
  }

  return state;
};
