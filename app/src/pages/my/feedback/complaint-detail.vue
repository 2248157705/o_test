<template>
  <global-view bgColor="#F7F9FA">
    <template #bar>
      <u-navbar
        bgColor="#F7F9FA"
        title="投诉详情"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      >
      </u-navbar>
    </template>

    <view style="padding-bottom: 200rpx">
      <view v-if="complaintData.showCustomerService" class="tips">
        <text class="text">若有疑问请联系客服</text>
      </view>

      <view class="content">
        <steps colors="#fa436a" :stepData="complaintData.dataSource">
          <template #default="{ data }">
            <!-- 已提交 -->
            <view v-if="data.status === 1" class="message-box">
              <text class="title">投诉单号: {{ data.ext.feedback_id }}</text>
              <text class="text">投诉对象: {{ data.ext.defendant }}</text>
              <text class="text"
                >投诉类型: {{ data.ext.feedback_type_name }}</text
              >
              <text class="text">投诉内容: {{ data.ext.problem }}</text>
            </view>

            <!-- 处理中 -->
            <view v-if="data.status === 2" style="margin-bottom: 150rpx">
            </view>

            <!-- 已处理 -->
            <view v-if="data.status === 3" class="message-box">
              <text class="text" style="margin-top: 0">{{ data.message }}</text>
            </view>

            <!-- 已撤消 -->
            <view v-if="data.status === 4" style="margin-bottom: 150rpx">
            </view>
          </template>
        </steps>

        <view v-if="complaintData.showCustomerService" class="foot">
          <view class="btn" @click="handleContactCS">
            <text class="text">联系客服</text>
          </view>
        </view>
      </view>
    </view>
  </global-view>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import GlobalView from "@/components/global-view/index.vue";
import Steps from "./components/steps.vue";
import { getComplaintDetail } from "@/api/user";
import { consultCustomerService } from "@/components/im/conversation-list";

const complaintData = reactive({
  dataSource: [],
  loading: false,
  showCustomerService: false,
});

const formatDate = (t) => {
  return dayjs(t * 1000).format("YYYY-MM-DD HH:mm");
};

const fetchData = async (feedback_id: string) => {
  const res = await getComplaintDetail(feedback_id).catch((err) => {
    console.log("getComplaintDetail", err);
    complaintData.dataSource = [];
  });
  if (res) {
    const arr = [];

    if (res.feedback_status === 2) {
      arr.push({
        name: "已处理",
        time: formatDate(res.updated_at),
        isNow: 0,
        status: 3,
        message: res.reply,
        ext: {},
      });
      complaintData.showCustomerService = true;
    } else if (res.revoke_status === 1 && res.feedback_status === 1) {
      arr.push({
        name: "处理中",
        time: "",
        isNow: 1,
        status: 2,
        message: "",
        ext: {},
      });
    } else if (res.revoke_status === 2 && res.feedback_status === 1) {
      arr.push({
        name: "已撤消",
        time: formatDate(res.updated_at),
        isNow: 1,
        status: 4,
        message: "",
        ext: {},
      });
    }

    arr.push({
      name: "投诉已提交",
      time: formatDate(res.created_at),
      isNow: 0,
      status: 1,
      message: "",
      ext: {
        feedback_id: res.feedback_id,
        feedback_type_name: res.feedback_type_name,
        defendant: res.defendant_user_name,
        problem: res.problem,
      },
    });
    complaintData.dataSource = arr;
  } else {
    complaintData.dataSource = [];
  }
};

const handleContactCS = () => {
  consultCustomerService();
};

onLoad((options) => {
  if (options.feedback_id) {
    complaintData.showCustomerService = false;
    complaintData.dataSource = [];
    fetchData(options.feedback_id);
  }
});
</script>

<style lang="scss" scoped>
.content {
  margin: 24rpx;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 12rpx;
}

.message-box {
  @include flex(column);
  margin-top: 10rpx;
  padding: 24rpx;
  background: #fafafa;
  border-radius: 12rpx 12rpx 12rpx 12rpx;

  .title {
    font-weight: 500;
    font-size: 32rpx;
    color: #1a1a1a;
  }
  .text {
    margin-top: 16rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
    word-break: break-all;
  }
}

.tips {
  margin: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
  }
}

.foot {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 24rpx;
  background-color: #fff;

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 702rpx;
    height: 96rpx;
    background: #ffffff;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    border: 2rpx solid #1cc7be;

    .text {
      font-weight: 500;
      font-size: 32rpx;
      color: #1cc7be;
    }
  }
}
</style>
