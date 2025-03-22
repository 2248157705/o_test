<template>
  <view class="step">
    <view class="step_box">
      <!-- 左侧进度线 -->
      <view class="step_left"> </view>

      <view class="step_right">
        <view
          v-for="(item, index) in stepData"
          :key="index"
          class="right_content"
        >
          <view class="header">
            <!-- 进度名称 -->
            <view class="title">
              <text :style="{ color: item.isNow == 1 ? '#F42A2A' : '#1A1A1A' }">
                {{ item.name }}
              </text>
            </view>
            <!-- 进度时间 -->
            <view v-if="item.time" class="times">
              <text class="text">{{ item.time }}</text>
            </view>
          </view>
          <!-- 进度详情备注 -->
          <view class="result">
            <slot :data="item"></slot>
          </view>
          <!-- 右侧的进度点 -->
          <view class="status">
            <u--image
              class="img"
              :src="
                item.isNow
                  ? '/static/images/my/icon_step_now.png'
                  : '/static/images/my/icon_step.png'
              "
              width="40rpx"
              height="40rpx"
            />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    colors: {
      type: String,
      default: "",
    },
    stepData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  emits: ["itemClick"],
  data() {
    return {};
  },
  methods: {
    jumpNext(item) {
      this.$emit("itemClick", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.step_box {
  display: flex;
  padding-left: 16rpx;

  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10rpx 0;
  }

  .step_left {
    width: 2rpx;
    display: block;
    background-color: #dddddd;
    overflow: hidden;
  }

  .step_right {
    padding-left: 20rpx;
    width: 615rpx;

    .right_content {
      position: relative;
      margin-bottom: 30rpx;
      margin-left: 16rpx;

      .title {
        font-weight: 500;
        font-size: 32rpx;
        color: #1a1a1a;
        line-height: 38rpx;
      }

      .times {
        font-weight: 400;
        font-size: 28rpx;
        color: #afafaf;
        line-height: 34rpx;
      }

      .status {
        padding: 10rpx 0;
        position: absolute;
        top: 0;
        left: -56rpx;
        background-color: #fff;
      }

      .result {
        .desc-box {
          min-height: 186rpx;
          background: #fafafa;
          border-radius: 12rpx;
          padding: 24rpx;
          margin-top: 24rpx;
        }
      }

      &:last-of-type {
        margin-bottom: 0;

        &::before {
          content: "";
          width: 6rpx;
          height: 100%;
          background-color: #fff;
          position: absolute;
          top: 22rpx;
          left: -40rpx;
        }
      }
    }
  }
}
</style>
