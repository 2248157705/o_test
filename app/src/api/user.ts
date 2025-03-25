import { request } from "../fetch";
import type {
  RecordReq,
  idCardVerifyReq,
  BalanceRecordRes,
  WithdrawalRecordRes,
  ContractRes,
  ContractInfoRes,
  MyInfoRes,
  unBindPayAccountRes,
  MerchantUserListRes,
  MerchantUserListReq,
  FeedbackReq,
  GetServiceStaffListReq,
  GetFeedbackTypeListReq,
} from "@/types/user";

const baseUrl = import.meta.env.VITE_APP_ORDER_HOST;

import type { CollectionProductReq, CollectionListReq } from "@/types/user";
export const idCardVerify = (data: idCardVerifyReq) => {
  return request.post("/client/users/account/idCardVerify", data);
};

// 查询实名认证
export const checkIdCardVerify = (data) => {
  return request.post("/client/users/account/getAuthentication", data, {
    hideMsg: true,
  });
};

// 进行法大大个人认证链接生成
export const faDataIdCardVerify = (data) => {
  return request.post("/client/contract/getAuthUrl", data);
};

// 发送验证码
export const sendSMS = (data) => {
  return request.post("/client/common/phone/sendSMS", data);
};

// 余额记录
export const getBalanceRecord = (data: RecordReq) => {
  return request.post<BalanceRecordRes>(
    "/client/users/account/balanceRecord",
    data
  );
};

// 提现记录
export const getWithdrawalRecord = (data: RecordReq) => {
  return request.post<WithdrawalRecordRes>(
    "/client/users/account/withdrawalRecord",
    data
  );
};

// 绑定支付收款账号
export const bindPayAccount = (data) => {
  return request.post("/client/users/account/bindPayCollectionAccount", data);
};
// 解绑支付收款账号
export const relieveBindPayCollectionAccount = (data: unBindPayAccountRes) => {
  return request.post(
    "/client/users/account/relieveBindPayCollectionAccount",
    data
  );
};

// 查询绑定支付收款账号
export const getUserPayAccountBindInfo = () => {
  return request.post("/client/users/account/getUserPayAccountBindInfo");
};

// 用户收藏商品
export const collectionProduct = (data: CollectionProductReq) => {
  return request.post("/client/product/account/collectionProduct", data, {
    showLoading: false,
  });
};
// 用户取消收藏
export const delCollectionProduct = (data: CollectionProductReq) => {
  return request.post("/client/product/account/delCollectionProduct", data, {
    showLoading: false,
  });
};
// 判断用户商品是否收藏
export const judgeWhetherCollectionProduct = (data: CollectionProductReq) => {
  return request.post(
    "/client/product/account/judgeWhetherCollectionProduct",
    data,
    {
      showLoading: false,
    }
  );
};
// 收藏列表
export const getCollectionProductList = (data: CollectionListReq) => {
  return request.post<CollectionListRes[]>(
    "/client/product/account/getCollectionProductList",
    data
  );
};

// 获取个人中心信息
export const getMyInfo = () => {
  return request.post<MyInfoRes>("/client/users/account/myInfo", null, {
    showLoading: false,
  });
};
// 获取个人中心信息
export const getJavaMyInfo = () => {
  return request.get<MyInfoRes>(`${baseUrl}/client/my/get`, null, {
    showLoading: false,
  });
};

// 获取个人中心信息 按需获取字段
export const getJavaMyInfoV2 = (data) => {
  return request.post<MyInfoRes>(`${baseUrl}/client/my/get.v2`, data, {
    showLoading: false,
  });
};

// 获取个人合同列表
export const getContractList = (data) => {
  return request.post<ContractRes[]>("/client/contract/getContractList", data);
};

// 获取合同详情
export const getContractInfo = (signTaskId: string) => {
  return request.post<ContractInfoRes>(
    "/client/contract/getContractInfo",
    { signTaskId },
    {
      showLoading: false,
    }
  );
};

// 获取合同签署链接
export const getSignTaskActorUrl = (signTaskId: string) => {
  return request.post<{ sign_url: string; long_url: string }>(
    "/client/contract/tencentSignTaskActorUrl",
    { signTaskId },
    {
      showLoading: false,
    }
  );
};

// 获取合同签署连接-新接口
export const getContractSignUrl = (signTaskId: string) => {
  return request.post<{ data: string }>(
    "/client/contract/contractSign",
    { signTaskId },
    {
      showLoading: false,
    }
  );
};

// 注销账户
export const cancelAccount = (data) => {
  return request.post("/client/users/account/cancelAccount", data);
};
// 修改账户
export const editPersonalInfo = (data) => {
  return request.post<{ avatar?: string; nickname?: string }>(
    "/client/users/account/editPersonalInfo",
    data
  );
};
// 获取有效的坑位号商列表
export const getMerchantUserList = (data: MerchantUserListRes) => {
  return request.post<MerchantUserListReq[]>(
    "/client/users/account/validPositionMerchantUserList",
    data
  );
};

// 意见反馈
export const fetchFeedback = (data: FeedbackReq) => {
  return request.post("/client/common/feedback", data);
};

// 获取服务人员列表
export const getServiceStaffList = (data: GetServiceStaffListReq) => {
  return request.post("/client/common/feedback/getServiceStaffList", data);
};

// 获取反馈类型列表
export const getFeedbackTypeList = (data: GetFeedbackTypeListReq) => {
  return request.post("/client/common/feedback/getFeedbackTypeList", data);
};

// 获取投诉列表
export const getComplaintList = () => {
  return request.post("/client/common/feedback/getComplaintList");
};

// 撤销投诉
export const revokeComplaint = (feedback_id: string) => {
  return request.post("/client/common/feedback/revokeComplaint", {
    feedback_id,
  });
};

// 获取投诉详情
export const getComplaintDetail = (feedback_id: string) => {
  return request.post("/client/common/feedback/getComplaintDetail", {
    feedback_id,
  });
};

// 绑手机号码
export const bindPhone = (data) => {
  return request.post("/client/users/account/bindPhone", data);
};

// 换绑手机
export const changeBindingPhone = (data) => {
  return request.post("/user/phone/changeBindingPhone", data);
};
