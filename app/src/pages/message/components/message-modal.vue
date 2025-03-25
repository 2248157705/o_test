<template>
  <u-modal :show="showClean" :showConfirmButton="false">
    <view class="clean">
      <view class="title">确认清除所有未读消息提示</view>
      <view class="actions">
        <view class="cancel" @click="close">再想想</view>
        <view class="confirm" @click="clean">确定</view>
      </view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">

import {ref} from "vue";

const showClean=ref(false)
const open=()=>{
  showClean.value=true
}
const close=()=>{
  showClean.value=false
}
const clean=()=>{
  const nim= uni.$UIKitNIM?.getNIM()
  nim?.session?.resetAllSessionsUnreadCount()
  uni.$u.toast('清除成功')
  close()
}
defineExpose({
  open,
})


</script>

<style scoped lang="scss">
.clean{
  flex: 1;
  .title{
    font-size: 32rpx;
    color: #1A1A1A;
    text-align: center;
    font-weight: 400;
  }
  .actions{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .cancel{
      flex: 1;
      background: #F4F5F6;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #606060;
      text-align: center;
      padding: 18rpx;
      margin: 48rpx 30rpx 0rpx 0rpx;
    }
    .confirm{
      flex: 1;
      background: #1CC7BE;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #FFFFFF;
      text-align: center;
      padding: 18rpx;
      margin: 48rpx 0rpx 0rpx;

    }
  }
}
</style>