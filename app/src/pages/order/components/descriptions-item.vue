<template>
  <view class="descriptions">
    <view v-if="title">
      <text class="title">{{ title }}</text>
    </view>
    <view class="box">
      <template v-if="items.length > 0">
        <view v-for="item in items" :key="item.label" class="item">
          <view class="label">
            <text class="text">{{ item.label }}</text>
          </view>
          <view class="value">
            <view v-if="item.type === 'price'">
              <u--text
                bold
                color="#1A1A1A"
                size="16"
                mode="price"
                :text="+(item.value || 0)"
                align="left"
              ></u--text>
            </view>
            <view v-else-if="item.type === 'copy'">
              <copy-view :content="item.value" :text="item.value"></copy-view>
            </view>
            <view v-else-if="item.type === 'pay'">
              <view style="width: 400rpx">
                <slot name="pay"></slot>
              </view>
            </view>
            <view v-else>
              <text class="text" :style="item.style">{{ item.value }}</text>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import CopyView from "@/components/copy/copy.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  items: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
</script>
<style lang="scss" scoped>
.descriptions {
  padding: 24rpx;

  .title {
    font-weight: 500;
    font-size: 32rpx;
    color: #1a1a1a;
  }
  .box {
    position: relative;
    .item {
      padding: 20rpx 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      // margin: 16rpx 0;

      .label {
        .text {
          font-weight: 400;
          font-size: 28rpx;
          color: #afafaf;
        }
      }
      .value {
        .text {
          // max-width: 500rpx;
          font-weight: 400;
          font-size: 28rpx;
          color: #1a1a1a;
          // word-break: break-all;
        }
      }
    }
  }
}
</style>
