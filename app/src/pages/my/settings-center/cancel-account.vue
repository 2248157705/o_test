<template>
  <global-view
    bgColor="linear-gradient(to bottom, #ffffff, #F7F9FA)"
    :showBar="false"
  >
    <view class="cancel-account-wrapper">
      <view class="content">
        <view class="card">
          <text class="title"
            >一、注销账号后，包含但不仅限于以下行为同步执行</text
          >
          <view class="description">
            <view class="row">
              <text class="text"
                >1、所有的交易记录、相关系统聊天记录、账户余额、相关个人设置等内容都将清零。</text
              >
            </view>
            <view class="row">
              <text class="text"
                >1、所有的交易记录、相关系统聊天记录、账户余额、相关个人设置等内容都将清零。</text
              >
            </view>
            <view class="row">
              <text class="text"
                >3、注销后使用同手机号再次注册，数据无法恢复。</text
              >
            </view>
          </view>
        </view>

        <view class="card" style="margin-top: 60rpx">
          <text class="title">二、同时满足以下条件，方可注销成功</text>
          <view class="description">
            <view class="row">
              <text class="text"
                >1、无进行交易中的订单，包括以下状态：交易中（卖家角度）、待确认收货（买家角度）、退款处理中（买家角度）、售后处理中（买家角度）。
              </text>
            </view>
            <view class="row">
              <text class="text">2、无上架的商品</text>
            </view>
            <view class="row">
              <text class="text">3、账号处于正常可登录状态</text>
            </view>
            <view class="row">
              <text class="text">4、账号无可提现余额。</text>
            </view>
          </view>
        </view>

        <u-checkbox-group
          v-model="checkedAgree"
          :size="14"
          activeColor="#539f9a"
          @change="handleAgreeChange"
        >
          <label class="read-box" @click="handleAgreeChange">
            <u-checkbox class="checkbox" shape="circle" activeColor="#1CC7BE" />
            <view class="link-text">
              <text class="text"
                >我已阅读并同意
                <text class="text link" @click.stop="handleCancelDescription()"
                  >《注销重要说明》，
                </text>
                并接受全部条款。</text
              >
            </view>
          </label>
        </u-checkbox-group>
      </view>
      <view style="height: 200rpx"> </view>
      <my-button
        class="btn"
        type="primary"
        text="确认注销"
        @click="handleCancelAccountConfirm"
      />

      <CancelAccountPopup
        ref="cancelAccountPopupRef"
        title="确认注销"
        mode="center"
        showCancelButton
        showConfirmButton
        :text="'注销后，该账号所有个人身份信息、账号将被清空且无法恢复，是否确认注销？'"
        @confirm="onConfirm"
      >
      </CancelAccountPopup>
    </view>
  </global-view>
</template>
<script setup>
import { ref } from "vue";
import { cancelAccount } from "@/api/user";
import storage from "@/utils/storage";
import { useUserStore } from "@/stores/user";
import CancelAccountPopup from "@/components/my-popup/index.vue";
import GlobalView from "@/components/global-view/index.vue";
import { toAccoutLogout } from "@/utils/index";

const userStore = useUserStore();

const checkedAgree = ref([]);
const agree = ref(false);
const handleAgreeChange = () => {
  agree.value = !agree.value;
  checkedAgree.value = agree.value ? [""] : [];
};

const handleCancelDescription = () => {
  toAccoutLogout();
};

const cancelAccountPopupRef = ref(null);
const handleCancelAccountConfirm = async () => {
  if (!agree.value) {
    uni.$main.toast("请选择阅读并同意《注销重要说明》");
    return;
  }
  cancelAccountPopupRef.value?.open();
};
const onConfirm = async () => {
  if (!agree.value) {
    uni.$u.toast("请选择阅读并同意《注销重要说明》");
    return;
  }
  const res = await cancelAccount();
  console.log("账号和注销=>", res);
  if (res?.cancel_status) {
    storage.clear();
    userStore.logOut();
    uni.$main.toast("注销成功");
  }
  uni.navigateBack();
};
</script>

<style lang="scss" scoped>
@import "@/static/style/customicons.scss";

.cancel-account-wrapper {
  padding: 24rpx;
  //   @include flex(column);
  .content {
    // flex: 1;
  }
  .card {
    .title {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
      line-height: 45rpx;
    }
    .row {
      margin-top: 20rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #606060;
        line-height: 50rpx;
      }
    }
  }

  .read-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 60rpx;

    .checkbox {
      margin-top: 8rpx;
    }
    .link-text {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      flex: 1;
      font-size: 28rpx;
      line-height: 44rpx;
      .text {
        font-size: 26rpx;
        font-weight: 600;
        color: #000000;
      }

      .link {
        color: $app-main-color;
      }
    }
  }
  .btn {
    position: fixed;
    bottom: 60rpx;
    width: 94%;
  }
}
</style>
