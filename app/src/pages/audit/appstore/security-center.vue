<template>
  <!-- style="height: 750px" -->
  <!-- bgImage="/static/images/my/security-center/bg.png" -->
  <GlobalView ref="globalRef" :scroll="false">
    <!-- <template #bar>
      <u-navbar
        :bgColor="top > 10 ? '#fff' : 'transparent'"
        title="安全中心"
        :placeholder="true"
        :autoBack="false"
        :safeAreaInsetTop="true"
      />
    </template> -->
    <template #bgImage>
      <scroll-view
        scroll-y
        style="height: 100%"
        :show-scrollbar="true"
        @scroll="handleScroll"
      >
        <image
          src="/static/images/my/security-center/bg.png"
          style="width: 100%; height: 960rpx; position: absolute"
        />

        <view class="security-center-wrapper">
          <!-- <view></view> -->
          <view class="query-box">
            <view class="hand">
              <text class="title">黑号查询</text>
              <text class="tip">账号信息一键查询</text>
            </view>
            <!-- fontSize="" -->
            <view class="input">
              <input
                placeholder="请输入需要查询的号码"
                placeholder-style="text-align: center"
              />
            </view>

            <my-button class="btn" background-color="#1D76FA" color="#ffffff">
              <view class="btn-content">
                <image
                  class="img"
                  src="/static/images/my/security-center/search.png"
                />
                <text class="text">查询</text>
              </view>
            </my-button>
          </view>

          <view class="content">
            <view
              style="
                background-color: #ffffff;
                margin-bottom: 24rpx;
                border-radius: 12rpx;
              "
            >
              <view class="explain-box">
                <view class="step-title">
                  <text class="name">安全治理</text>
                </view>
                <view class="violation-box">
                  <view class="title">违规名单</view>
                  <view class="scroll-box">
                    <MaoScroll
                      :data="text4"
                      :showNum="3"
                      :lineHeight="44"
                      :animationScroll="800"
                      :animation="2000"
                    >
                      <template #default="{ line }">
                        <view class="line-box">
                          <text class="text"
                            >{{
                              line
                            }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;涉嫌欺诈
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;账号已封禁</text
                          >
                        </view>
                      </template>
                    </MaoScroll>
                  </view>
                </view>
              </view>
              <view class="rule-wrapper">
                <view class="rule-box">
                  <view class="title">若恶意找回账号，将面临：</view>
                  <view class="info">
                    <view class="tab">
                      <image
                        class="image"
                        src="/static/images/my/security-center/alarm.png"
                      />
                      <text class="title">平台报警</text>
                      <text class="tip">留下案例</text>
                    </view>
                    <view class="tab">
                      <image
                        class="image"
                        src="/static/images/my/security-center/team.png"
                      />
                      <text class="title">专业团队</text>
                      <text class="tip">跟踪追回</text>
                    </view>
                    <view class="tab">
                      <image
                        class="image"
                        src="/static/images/my/security-center/statute.png"
                      />
                      <text class="title">法律诉讼</text>
                      <text class="tip">按协议赔偿</text>
                    </view>
                    <view class="tab">
                      <image
                        class="image"
                        src="/static/images/my/security-center/determine.png"
                      />
                      <text class="title">判罚定性</text>
                      <text class="tip">影响征信</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view v-if="false" class="doubt-box">
              <view class="top">
                <view class="step-title">
                  <text class="name">安全治理</text>
                </view>
                <view class="right" @click="navigateToHelpCenter"
                  >更多
                  <image class="img" src="/static/images/my/icon_enter.png" />
                </view>
              </view>

              <view class="problem">
                <view
                  v-for="(item, index) in problemList"
                  :key="index"
                  class="item"
                  @click="navigatorToExplain(item)"
                  >{{ item.label }}?</view
                >
              </view>
            </view>
          </view>
          <view class="footer"> 一 淘个号安全中心 一 </view>

          <view class="btn-box">
            <my-button
              class="customer-service"
              background-color="#F0F0F0"
              color="#1A1A1A"
              text="联系客服"
              openType="customer_service"
            />
            <my-button
              background-color="#1D76FA"
              color="#ffffff"
              text="问题反馈"
              @click="navigateToProposalCenter"
            />
          </view>
        </view>
      </scroll-view>
    </template>
  </GlobalView>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import MaoScroll from "@/components/mao-scroll/mao-scroll.vue";
import GlobalView from "@/components/global-view/index.vue";
const top = ref(0);
const text4 = ref([
  "ID:m****6598",
  "ID:m****2856",
  "ID:m****8971",
  "ID:m****2351",
  "ID:m****8975",
  "ID:m****2294",
]);
const problemList = [
  {
    label: "退款要多久才到账",
    type: "refund_account",
  },
  {
    label: "如何求降价",
    type: "price_reduction",
  },
  {
    label: "如何签署电子合同",
    type: "contract",
  },
  {
    label: "被找回如何售后、理赔",
    type: "after_sales",
  },
];
const navigateToHelpCenter = () => {
  uni.navigateTo({
    url: "/pages/my/help-center/index",
  });
};
const navigateToProposalCenter = () => {
  uni.navigateTo({
    url: "/pages/my/feedback/index",
  });
};

const navigatorToExplain = (record: any) => {
  uni.navigateTo({
    url:
      `/pages/my/help-center/explain?title=${record.label}&type=` + record.type,
  });
};

const handleScroll = (e) => {
  top.value = e.detail.scrollTop;
};
</script>
<style lang="scss" scoped>
.security-center-wrapper {
  // background: url("/static/images/my/security-center/bg.png") no-repeat center
  //   center;
  // background-size: 100% 100%;
  // background-color: #ffffff;
  // height: 95%;
  width: 750rpx;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;

  position: relative;
  top: 520rpx;
  // flex: 1;

  .query-box {
    background: #ffffff;
    border-radius: 12rpx;
    margin: 24rpx;
    padding-bottom: 16rpx;

    .hand {
      height: 118rpx;
      background: linear-gradient(to right, #1d76fa, #3787ff);
      border-radius: 12rpx 12rpx 0rpx 0rpx;
      border: 2rpx solid #ffffff;
      @include flex;
      align-items: center;
      padding-left: 24rpx;
      .title {
        font-weight: 600;
        font-size: 32rpx;
        color: #ffffff;
      }
      .tip {
        font-size: 24rpx;
        color: #ffffff;
        line-height: 38rpx;
        margin-left: 16rpx;
      }
    }
    .input {
      margin: 24rpx;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      border: 2rpx solid #1d76fa;
      padding: 20rpx;
    }
    .btn {
      margin: 0 22rpx;
    }
    .btn-content {
      @include flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 36rpx;
        height: 36rpx;
      }
      .text {
        font-weight: 500;
        font-size: 28rpx;
        color: #ffffff;
      }
    }
  }
  .image-box {
    @include flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    box-shadow: 0rpx -28rpx 92rpx 0rpx rgba(95, 152, 192, 0.11);
    border-radius: 16rpx 16rpx 0rpx 0rpx;
    margin: 0 24rpx;
    background-color: #f7f9fa;

    .step-title {
      .name {
        font-weight: 600;
        font-size: 32rpx;
        color: #1a1a1a;
      }
    }
    .explain-box {
      @include flex(column);
      // align-items: center;
      padding: 40rpx 24rpx;
      padding-bottom: 0;
      // justify-content: start;
      background: #ffffff;
      border-radius: 12rpx;
      .explain {
        font-weight: 500;
        font-size: 28rpx;
        color: #1a1a1a;
        line-height: 44rpx;
      }
      .violation-box {
        background: linear-gradient(to right, #ecf5ff, #f2f8fd);
        border-radius: 12rpx;
        padding: 24rpx;
        .scroll-box {
          @include flex(column);
          align-items: center;
          justify-content: center;
          margin-top: 20rpx;
        }
        .title {
          font-weight: 600;
          font-size: 28rpx;
          color: #1a1a1a;
        }
        .line-box {
          @include flex(column);
          flex: 1;
          align-items: center;
          justify-content: center;
          // padding: 20rpx;
          .text {
            font-weight: 400;
            font-size: 28rpx;
            color: #1a1a1a;
          }
        }
      }
    }
    .rule-wrapper {
      background: #ffffff;
      padding: 24rpx;
    }
    .rule-box {
      background: linear-gradient(to right, #ecf5ff, #f2f8fd);
      border-radius: 12rpx;
      padding: 24rpx;
      .info {
        @include flex;

        align-items: center;
        justify-content: space-between;
        margin: 24rpx 0;
        width: 100%;
      }
      .title {
        font-weight: 600;
        font-size: 28rpx;
        color: #1a1a1a;
      }
      .tab {
        @include flex(column);
        align-items: center;
        justify-content: center;
        .image {
          margin-bottom: 5px;
          width: 72rpx;
          height: 72rpx;
        }
        .title {
          font-weight: 500;
          font-size: 28rpx;
          color: #1a1a1a;
          margin: 8rpx;
        }
        .tip {
          font-weight: 400;
          font-size: 24rpx;
          color: #afafaf;
        }
      }
    }

    .doubt-box {
      background-color: #ffffff;
      border-radius: 12rpx;
      padding: 24rpx;
      margin-top: 24rpx;
      .top {
        @include flex;
        align-items: center;
        justify-content: space-between;
        .right {
          @include flex;
          align-items: center;
          justify-content: center;
          font-size: 24rpx;
          color: #afafaf;
          .img {
            width: 24rpx;
            height: 24rpx;
          }
        }
      }

      .problem {
        @include flex;
        align-items: center;
        flex-wrap: wrap;
        margin: 24rpx 24rpx 0 24rpx;
        .item {
          padding: 12rpx 24rpx;
          background: #f4f5f6;
          border-radius: 200rpx 200rpx 200rpx 200rpx;
          margin-right: 16rpx;
          margin-bottom: 24rpx;

          font-size: 24rpx;
          color: #1a1a1a;
        }
      }
    }
  }
  .footer {
    height: 200rpx;
    @include flex;
    // align-items: center;
    padding-top: 100rpx;
    justify-content: center;

    font-size: 28rpx;
    color: #dbdedf;
  }
  .btn-box {
    position: fixed;
    bottom: 0;
    width: 704rpx;
    height: 144rpx;
    background: #ffffff;
    @include flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx 20rpx 24rpx;
    .customer-service {
      margin-right: 22rpx;
    }
  }
}
</style>
