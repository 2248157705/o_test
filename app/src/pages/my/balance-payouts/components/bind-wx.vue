<template>
  <view class="flex-row space-between center account-box">
    <template v-if="isBind">
      <view class="flex-row center">
        <u--image
          width="48rpx"
          height="48rpx"
          :src="avatar || '/static/images/my/icon_wx.png'"
        />
        <text class="text">{{ nickname }}</text>
      </view>
      <view class="btn-info"> <text class="txt">已绑定</text></view>
    </template>
    <template v-else>
      <view class="flex-row center">
        <u--image
          width="48rpx"
          height="48rpx"
          src="/static/images/my/icon_wx.png"
        />
        <text class="text">尚未绑定微信</text>
      </view>
      <view class="btn-info" @click="handleBind">
        <text class="txt">去绑定</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
defineProps({
  avatar: {
    type: String,
    default: "",
  },
  nickname: {
    type: String,
    default: "",
  },
  isBind: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit"]);

const handleBind = () => {
  emit("submit");
};
</script>

<style lang="scss" scoped>
.flex-row {
  @include flex(row);

  &.space-between {
    justify-content: space-between;
  }

  &.center {
    align-items: center;
  }
}
.account-box {
  margin: 20rpx 0;
}
.btn-info {
  @include flex(row);
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 28rpx;

  .txt {
    font-size: 24rpx;
    color: $app-main-color;
  }
}
</style>
