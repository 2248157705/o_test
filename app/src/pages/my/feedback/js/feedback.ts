import { getServiceStaffList, getFeedbackTypeList } from "@/api/user";
import { reactive } from "vue";

export function Feedback() {
  const feedBackData = reactive({
    feedbackTypeList: [], // 反馈类型列表
    serviceStaffList: [], // 服务人员列表
  });

  const fetchFeedbackTypeList = async (opts) => {
    const res = await getFeedbackTypeList(opts);
    if (res) {
      const arr = Object.keys(res.submit_type).map((el) => {
        return {
          label: res.submit_type[el],
          value: el,
        };
      });
      feedBackData.feedbackTypeList = arr;
    } else {
      feedBackData.feedbackTypeList = [];
    }
  };

  const fetchServiceStaffList = async (opts) => {
    const res = await getServiceStaffList(opts);
    if (res && res.data) {
      feedBackData.serviceStaffList = res.data;
    } else {
      feedBackData.serviceStaffList = [];
    }
  };

  return {
    feedBackData,
    fetchFeedbackTypeList,
    fetchServiceStaffList,
  };
}
