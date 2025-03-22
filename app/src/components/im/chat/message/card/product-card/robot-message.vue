<template>
  <view class="card-messsage-wrapper system-box">
    <view class="robot">
      <view class="list">
        <view class="item-r">
          <text class="title">{{ content.title }}</text>
          <view class="refresh" @click="toRefresh">
            <text class="next">换一批</text>
            <image class="right-icon" src="/static/images/im/list/15.png" />
          </view>
        </view>

        <template v-for="(item, index) in content.list" :key="index">
          <view class="item-r" @click="toAnswer(item)">
            <view class="sub-title">{{
              `${index + 1}、 ${item.question}`
            }}</view>
            <image class="right-icon" src="/static/images/im/list/14.png" />
          </view>
          <view
            v-if="content.list.length !== index + 1"
            :key="index"
            class="line"
          ></view>
        </template>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
import { reactive } from "vue";
import { getRobotQaList, robotQaAsk } from "@/api/chat";

const props = defineProps({
  to: {
    type: String,
    default: "", // 会话id
  },
  idClient: {
    //  消息唯一id
    type: String,
    default: "",
  },
  attach: {
    type: Object,
    default: () => ({
      option: {
        template: "",
        content: {
          title: "",
          total: 0,
          page: 1,
          list: [],
        },
      },
      permissions: {
        clickable_by: [],
      },
    }),
  },
  btnText: {
    type: String,
    default: "",
  },
});

const option = props.attach?.option;
const content = reactive({ ...option?.content }) || {};

const toAnswer = (lItem) => {
  robotQaAsk({ tid: props.to, qa_id: lItem.qa_id }).then(() => {
    // console.log("res", res);
  });
};

const toRefresh = () => {
  const { total } = content;
  const pageSize = 5;
  const maxPage = Math.ceil(total / pageSize);
  if (!content.page) {
    content.page = 1;
  }
  let currentPage = content.page + 1;
  if (currentPage > maxPage) {
    currentPage = 1;
  }
  content.page = currentPage;
  console.log("请求页码:", currentPage);
  getRobotQaList({ page: currentPage, page_size: pageSize }).then((res) => {
    content.list = res.list;
  });
};
</script>
<style lang="scss" scoped>
@import "../style/common.scss";

.robot {
  padding: 10rpx;
  .list {
    background: white;

    border-radius: 12rpx;
    z-index: 9;
  }
  .line {
    background: #f4f5f6;
    height: 2rpx;
  }
  .item-r {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0rpx;
    height: 60rpx;
    border-bottom: 0rpx solid transparent;
    margin: 0rpx;
    padding: 0rpx;
    //borderBottom:20rpx solid #F4F5F6;
    //	padding:8rpx 0rpx;
    //background: yellow;
    overflow: hidden;
    .refresh {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
    }
    .title {
      font-weight: 500;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .sub-title {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .next {
      font-weight: 400;
      font-size: 32rpx;
      color: #afafaf;
      margin-right: 12rpx;
    }
    .right-icon {
      width: 32rpx;
      height: 32rpx;
    }
  }
}
</style>
