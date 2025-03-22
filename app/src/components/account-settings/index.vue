<template>
  <view class="account-settings">
    <view class="title">
      <text class="text">其他服务</text>
    </view>
    <view class="operation">
      <view
        v-for="(item, index) in settingColumns"
        :key="index"
        class="item-type"
        :class="{ first: index <= 2 }"
        @click="handleNavigator(item)"
      >
        <view class="box">
          <view v-if="item.icon" class="icon">
            <u--image
              :src="`/static/images/my/other-services/${item.icon}.png`"
              width="72rpx"
              height="72rpx"
            ></u--image>
          </view>
          <text class="msg">
            {{ item.name }}
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { consultCustomerService } from "@/components/im/conversation-list";
import { toLogin, checkIsLogin } from "@/utils/login";
import Events, { report } from "@/utils/report/report";

enum ItemType {
  HELP = "HELP",
  SAFETY = "SAFETY",
  RULE = "RULE",
  CS = "CS",
  FEEDBACK = "FEEDBACK",
  VALUATION = "VALUATION",
}

const settingColumns = reactive([
  {
    name: "帮助中心",
    icon: "icon_help",
    type: ItemType.HELP,
    url: "/pages/my/help-center/index",
  },
  {
    name: "安全中心",
    icon: "icon_safety",
    type: ItemType.SAFETY,
    url: "/pages/my/security-center/index",
  },
  {
    name: "平台规则",
    icon: "icon_rule",
    type: ItemType.RULE,
    url: "/pages/my/platform-rules/index",
  },
  {
    name: "专属客服",
    icon: "icon_service",
    type: ItemType.CS,
  },
  {
    name: "投诉与反馈",
    icon: "icon_suggestion",
    url: "/pages/my/feedback/index",
    type: ItemType.FEEDBACK,
  },
  {
    name: "估价记录",
    icon: "icon_valuation",
    url: "/pages/valuation/list",
    type: ItemType.VALUATION,
  },
]);

const handleNavigator = async (item: {
  id: any;
  url: string | undefined;
  type: ItemType;
}) => {
  if (item.type === ItemType.HELP) {
    report(Events.MY_HELP);
  } else if (item.type === ItemType.SAFETY) {
    report(Events.MY_SAFETY);
  } else if (item.type === ItemType.RULE) {
    report(Events.MY_RULE);
  } else if (item.type === ItemType.CS) {
    report(Events.MY_CS);
  } else if (item.type === ItemType.FEEDBACK) {
    report(Events.MY_COMPLAINT_FEEDBACK);
  }

  if (item.type === ItemType.CS) {
    if (!checkIsLogin()) {
      toLogin();
      return;
    }
    return consultCustomerService();
  }
  uni.navigateTo({
    url: item.url,
  });
};
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.account-settings {
  display: flex;
  background-color: #ffffff;
  padding: 24rpx;
  @include flex(column);
  .title {
    flex: 1;
    display: flex;
    margin-bottom: 24rpx;
    .text {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
  }
  .operation {
    @include flex(row);
    flex-wrap: wrap;
    flex: 1;
    justify-content: flex-start;
    .item-type {
      // padding: 0 54rpx;

      width: 220rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .box {
        @include flex(column);
        align-items: center;
        justify-content: center;
        // width: 114rpx;
      }
      &.first {
        // border-bottom: 1rpx solid #f4f5f6;
        padding-bottom: 12rpx;
        margin-bottom: 12rpx;
      }
      .icon {
        margin-bottom: 16rpx;
      }
      .msg {
        font-weight: 400;
        font-size: 28rpx;
        color: #161616;
      }
    }
  }
}
</style>
