<template>
  <view class="account-category">
    <view class="card-box">
      <view class="top">
        <text class="left">{{ title }}</text>
        <view class="right" @click="navigateToPage">
          <text class="text">{{ value }}</text>
          <u--image
              width="24rpx"
              height="24rpx"
              src="/static/images/my/icon_enter.png"
          />
        </view>
      </view>
      <view class="bottom">
        <view
            v-for="(item, index) in list"
            :key="index"
            class="card-item"
            @click="onChange(item)"
        >
          <u--image
              v-if="item.icon"
              width="48rpx"
              height="48rpx"
              :src="`/static/images/my/status/${item.icon}.png`"
          />
          <text class="text">{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array,
    default: () => {
      return [];
    },
  },
  // eslint-disable-next-line vue/require-default-prop
  title: {
    type: String,
    defualt: "",
  },
  value: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
});

const navigateToPage = () => {
  uni.switchTab({
    url: props.url,
  });
};
const emit = defineEmits(["change"]);
const onChange = (record: any) => {
  emit("change", record);
};
</script>
<style lang="scss" scoped>
.account-category {
  background: #ffffff;
  border-radius: 12rpx 12rpx 12rpx 12rpx;
  padding: 24rpx;
}
.card-box {
  .top {
    @include flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .right {
      @include flex;
      align-items: center;
      justify-content: center;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #afafaf;
      }
    }
  }
  .bottom {
    @include flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 24rpx;
    .card-item {
      @include flex(column);
      align-items: center;
      justify-content: center;
      width: 110rpx;
      .text {
        font-weight: 400;
        font-size: 24rpx;
        color: #1a1a1a;
        margin-top: 12rpx;
      }
    }
  }
}
</style>
