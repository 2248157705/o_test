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
        <view class="icon">
          <u--image
            :src="`/static/images/my/${item.icon}.png`"
            width="48rpx"
            height="48rpx"
          ></u--image>
        </view>
        <text class="msg">
          {{ item.name }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { consultCustomerService } from "@/components/im/conversation-list";

const settingColumns = reactive([
  {
    name: "帮助中心",
    icon: "icon_help",
    url: "/pages/my/help-center/index",
  },
  {
    name: "安全中心",
    icon: "icon_safety",
    url: "/pages/my/security-center/index",
  },
  {
    name: "平台规则",
    icon: "icon_rule",
    url: "/pages/my/platform-rules/index",
  },
  {
    name: "专属客服",
    id: 0,
    icon: "icon_service",
  },
  {
    name: "我的建议",
    icon: "icon_suggestion",
    url: "/pages/my/proposal-center/index",
  },
  {
    name: "系统设置",
    icon: "icon_settings",
    url: "/pages/my/settings-center/index",
  },
]);

const handleNavigator = async (item: { id: any; url: any }) => {
  if (item.id == 0) {
    await consultCustomerService();
    return;
  }
  uni.navigateTo({
    url: item.url,
  });
};
</script>
<style lang="scss" scoped>
@import "@/static/style/customicons.scss";
.account-settings {
  width: 702rpx;
  display: flex;
  background-color: #ffffff;
  margin-top: 24rpx;
  padding: 24rpx;
  @include flex(column);
  .title {
    flex: 1;
    display: flex;
    margin-bottom: 24rpx;
    .text {
      font-weight: 600;
      font-size: 28rpx;
      color: #1a1a1a;
    }
  }
  .operation {
    @include flex(row);
    flex-wrap: wrap;
    flex: 1;
    justify-content: center;
    .item-type {
      padding: 0 45rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      &.first {
        border-bottom: 1rpx solid #f4f5f6;
        padding-bottom: 24rpx;
        margin-bottom: 24rpx;
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
