<template>
  <view class="underage-view">
    <global-view>
      <template #bar>
        <view id="header">
          <u-navbar
            bgColor="rgba(0,0,0,0)"
            title="公告详情"
            :placeholder="true"
            :autoBack="true"
            :safeAreaInsetTop="true"
          />
          <view class="underage-view-content">
            <view class="nav-box">
              <view class="title-box">
                <image
                  class="title"
                  src="/static/images/announcement/icon_title.png"
                />
              </view>
              <image
                class="horn"
                src="/static/images/announcement/icon_horn.png"
              />
            </view>
          </view>
        </view>
      </template>
      <scroll-view
        scroll-y
        :style="{
          height: height + 'px',
        }"
      >
        <view class="content-msg">
          <view class="item">
            <text class="text"
              >2021年8月30日，国家新闻出版署下发
              <text class="text bold">
                《关于进一步严格管理切实防止未成年人沉迷网络游戏的通知》 </text
              >(以下简称《通知》)。作为网络游戏运营服务市场延伸的基于网络虚拟财产交易平台，<text
                class="text bold"
                >淘个号对《通知》高度重视、积极响应、并全面落实《通知》中与网络虚拟财产交易有关的各项要求。</text
              >
            </text>
          </view>

          <view class="item">
            <text class="text">
              <text class="text bold"
                >为防止未成年人沉迷网络游戏，淘个号已采取严格措施禁止任何未成年人利用淘个号交易系统买卖和租赁游戏账号，</text
              >
              包括:建立和完善用户实名认证系统、积极响应和配合政府的要求，并禁止所有认证为未成年人的用户(即
              <text class="text bold">未年满18周岁的中国公民</text
              >)参与淘个号平台上的任何交易。
            </text>
          </view>

          <view class="item">
            <text class="text">
              <text class="text bold"
                >淘个号平台将继续完善前述一系列措施，</text
              >
              开展了实名验证系统的内部自查，
              <text class="text bold"
                >认真、全面落实《通知》中与网络虚拟财产交易有关的各项要求。</text
              >
            </text>
          </view>

          <view class="item">
            <text class="text">
              游戏虚拟资产交易已经存在二十余年，有着广大的用户需求，而一个开放、规范、安全的交易平台，有助于控制不受监管的未成年人账号私下交易。未成年人使用成年人信息绕过实名认证是整个网络游戏运营服务行业面临的监管和技术问题，也是游戏出版、发行、运营、交易和服务行业应该协同解决的问题。
              <text class="text bold"
                >淘个号会继续负起作为交易平台的应尽的责任，也希望全行业一起共同推动对未成年人的保护。</text
              >
            </text>
          </view>

          <view class="item">
            <text class="text">
              未来，淘个号在交易服务上不断优化用户体验，在安全上进一步完善对虚拟资产的保护，努力推动全行业一起
              <text class="text bold">建立良性健康的三方虚拟交易生态。</text>
            </text>
          </view>

          <view class="item">
            <text class="text bold">
              感谢各位的理解和支持，祝各位玩家游戏愉快，交易顺利。
            </text>
          </view>
        </view>
        <view class="footer">
          <text class="text">2024年6月15日</text>
          <text class="text">广西平行时空科技有限公司</text>
        </view>
      </scroll-view>
    </global-view>
  </view>
</template>

<script setup>
import { ref, nextTick } from "vue";
import GlobalView from "@/components/global-view/index.vue";

// 在你的页面中，你可能先定义一个元素：
// <view id="elementId">Hello World</view>
const height = ref(0);
nextTick(() => {
  uni
    .createSelectorQuery()
    .select("#header")
    .boundingClientRect((rect) => {
      height.value = uni.getSystemInfoSync().windowHeight - rect.height;
    })
    .exec();
});
</script>

<style lang="scss" scoped>
.underage-view-content {
  padding-bottom: 24rpx;
}
.underage-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 24rpx;
  box-sizing: border-box;
  .nav-box {
    position: relative;
    .title-box {
      box-sizing: border-box;
      flex: 1;
      display: flex;
      padding: 0 38rpx;
      align-items: center;
      .title {
        flex: 1;
        height: 98rpx;
      }
    }
    .horn {
      position: absolute;
      left: -8rpx;
      top: -15rpx;
      width: 78rpx;
      height: 78rpx;
      z-index: 9;
    }
  }
  .content-msg {
    padding: 24rpx;
    box-sizing: border-box;
    background: rgba(244, 245, 246, 0.4);
    border-radius: 4rpx;
    padding-top: 0;
    .item {
      margin-top: 48rpx;
      line-height: 58rpx;
      .text {
        font-weight: 400;
        font-size: 32rpx;
        color: #1a1a1a;
        &.bold {
          font-weight: bold;
        }
      }
    }
  }
  .footer {
    padding: 24rpx;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-bottom: 48rpx;
    .text {
      font-weight: 400;
      font-size: 32rpx;
      color: #1a1a1a;
    }
  }
}
.underage-view::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20%; /* 这里设置你想要的高度 */
  background: linear-gradient(to bottom, #f6fefe, #ffffff);
}
</style>
