<template>
  <view v-if="!success">
    <view class="real-msg">
      <u--image
        width="28rpx"
        height="28rpx"
        src="/static/images/sell/icon_horn.png"
      />
      <text class="text">根据国家规定，本平台不为未成年人提供服务！</text>
    </view>
    <view class="real-view">
      <view class="msg">
        <text class="title">请提供真实信息</text>
        <text class="intro">通过实名认证后，方可在本平台进行账号交易</text>
        <text class="phone"
          >手机号：{{ desensitize(realParams.phone, "phone") }}</text
        >
      </view>
      <view class="my-input">
        <u--input
          v-model="realParams.userName"
          type="text"
          placeholder="请输入真实姓名"
          font-size="32rpx"
          color="#1A1A1A"
          border="none"
          clearable
          :placeholderStyle="placeholderStyle"
        />
      </view>
      <view class="my-input">
        <u--input
          v-model="realParams.identifyNum"
          type="text"
          placeholder="请输入身份证号"
          font-size="32rpx"
          color="#1A1A1A"
          border="none"
          clearable
          :placeholderStyle="placeholderStyle"
        />
      </view>
      <view class="my-input">
        <u-code ref="uCodeRef" @change="codeChange" />
        <u--input
          v-model="realParams.sms_code"
          :maxlength="6"
          type="number"
          placeholder="请输入验证码"
          border="none"
          clearable
          font-size="32rpx"
          color="#1A1A1A"
          :placeholderStyle="placeholderStyle"
        />
        <view class="btn-code" @tap="getCode">
          <text class="text">{{ codeChangeText }}</text>
        </view>
      </view>
    </view>

    <u-checkbox-group
      v-model="checkedAgree"
      style="flex: 1"
      :size="15"
      activeColor="#539f9a"
      @change="handleAgreeChange"
    >
      <view class="read-box" @tap="handleAgreeChange">
        <u-checkbox shape="circle" activeColor="#1CC7BE" />
        <view class="link-text">
          <text class="text">我已阅读并同意 </text>
          <text class="text link" @tap="handlePdf">《隐私政策》</text>
        </view>
      </view>
    </u-checkbox-group>

    <view class="btn-real-box" @tap="handleVerification">
      <view
        class="btn"
        :class="{
          active:
            realParams.identifyNum &&
            realParams.userName &&
            realParams.sms_code,
        }"
      >
        <text class="text">立即认证</text>
      </view>
    </view>
  </view>
  <view v-else class="success-view">
    <view class="view">
      <view class="success-msg">
        <u--image
          width="240rpx"
          height="240rpx"
          src="/static/images/sell/icon_success.png"
        />
        <text class="msg">已完成实名认证</text>
      </view>
      <view class="real-msg">
        <text class="text"
          >姓名：{{ desensitize(realParams.userName, "name") }}</text
        >
        <text class="text"
          >身份证号：{{ desensitize(realParams.identifyNum, "idCard") }}</text
        >
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import { idCard } from "@/uni_modules/uview-plus/libs/function/test";
import { idCardVerify, sendSMS } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { useMainStore } from "@/stores/main";
import { toUserPrivacy } from "@/utils/index";

export default defineComponent({
  emits: ["success"],
  setup(props, ctx) {
    const mainStore = useMainStore();
    const userStore = useUserStore();
    const checkedAgree = ref([]);
    const agree = ref(false);
    const userInfo = ref(userStore.userInfo);
    const uCodeRef = ref(null);
    const realParams = reactive({
      userName: "",
      identifyNum: "",
      uid: 0,
      sms_code: "",
      phone: userInfo.value?.phone,
    });
    const success = ref(false);
    const placeholderStyle = reactive({
      color: "#AFAFAF",
      fontSize: "32rpx",
    });
    const handleVerification = async () => {
      if (!realParams.userName) {
        uni.$main.toast("请输入真实姓名");
        return;
      }
      if (!realParams.identifyNum) {
        uni.$main.toast("请输入身份证号");
        return;
      }
      if (!realParams.sms_code) {
        uni.$main.toast("请输入手机验证码");
        return;
      }
      if (!idCard(realParams.identifyNum)) {
        uni.$main.toast("请输入有效身份证号");
        return;
      }
      if (!agree.value) {
        uni.$main.toast("请选择阅读并同意《隐私政策》");
        return;
      }
      realParams.uid = userInfo.value?.uid;
      const data = await idCardVerify(realParams);
      if (data) {
        userStore.setIdentifyNum({
          true_name: realParams.userName,
          identifyNum: realParams.identifyNum,
        });
        success.value = true;
        setTimeout(() => {
          ctx.emit("success");
        }, 3000);
        // uni.$main.toast("认证成功");
      }
    };

    // 验证码发送文案显示
    const codeChangeText = ref("");
    const codeChange = (text: string) => {
      codeChangeText.value = text;
    };
    // 发送验证码
    const getCode = async () => {
      if (!userStore.userInfo || !userStore.userInfo.phone) {
        uni.$main.toast("请先到【个人中心】绑定手机号，再进行实名认证");
        return;
      }

      if (!uCodeRef.value) return;
      if (uCodeRef.value?.canGetCode) {
        // 通知验证码组件内部开始倒计时
        uCodeRef.value.start();
        sendSMS({
          phone: userStore.userInfo.phone,
          sendType: 1,
        })
          .then(() => {
            uni.$main.toast("验证码已发送");
          })
          .catch(() => {
            uCodeRef.value.reset();
            realParams.sms_code = "";
          });
      }
    };
    function desensitize(data, type) {
      switch (type) {
        case "phone":
          return data.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
        case "name":
          return data.replace(/^(.).*(.)$/, function (_, $1, $2) {
            return $1 + "*".repeat(data.length - 2) + $2;
          });
        case "idCard":
          return data.replace(/(\d{4})\d{10}(\d{4})/, "$1********$2");
        default:
          console.log("Unsupported type");
          break;
      }
    }

    const handleAgreeChange = () => {
      agree.value = !agree.value;
      checkedAgree.value = agree.value ? [""] : [];
    };

    const handlePdf = () => {
      mainStore.toggleRealPopup(false);
      toUserPrivacy();
    };

    return {
      uCodeRef,
      realParams,
      success,
      placeholderStyle,
      codeChangeText,
      checkedAgree,
      handleVerification,
      codeChange,
      getCode,
      desensitize,
      handleAgreeChange,
      handlePdf,
    };
  },
});
</script>

<style lang="scss">
@import "@/static/style/customicons.scss";

.success-view {
  flex: 1;
  @include flex(column);
  .view {
    /* flex: 1; */
    flex: 1;
    @include flex(column);
    padding-top: 40rpx;
    .success-msg {
      flex: 1;
      @include flex(column);
      justify-content: center;
      align-items: center;
      .msg {
        font-weight: 600;
        font-size: 36rpx;
        color: #1cc7be;
        margin-bottom: 24rpx;
      }
    }

    .real-msg {
      @include flex(column);
      align-items: flex-start;
      border-radius: 4rpx;
      background-color: #f4f5f6;
      padding: 80rpx 24rpx;
      /* #ifndef APP-NVUE */
      box-sizing: border-box;
      /* #endif */

      flex: 1;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }
}
.btn-real-box {
  display: flex;
  flex: 1;
  .btn {
    flex: 1;
    height: 96rpx;
    background-color: #1cc7be;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.6;
    .text {
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
    }
    &.active {
      opacity: 1;
    }
  }
}

.read-box {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24rpx;

  .link-text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex: 1;
    font-size: 24rpx;

    .text {
      font-size: 24rpx;
      color: #8e8e93;
    }

    .link {
      color: $app-main-color;
    }
  }
}

.real-msg {
  flex: 1;
  height: 52rpx;
  background-color: #fff8f2;
  @include flex(row);
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  margin-top: 20rpx;
  .text {
    font-size: 20rpx;
    color: #f4872a;
    font-weight: 500;
    margin-left: 10rpx;
  }
}
.real-view {
  @include flex(column);
  flex: 1;
  .msg {
    @include flex(column);
    margin-bottom: 40rpx;
    .title {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
      margin-bottom: 16rpx;
    }
    .intro {
      font-weight: 400;
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.56);
      margin-bottom: 10rpx;
    }
    .phone {
      font-weight: 400;
      font-size: 24rpx;
      color: rgba(0, 0, 0, 0.56);
    }
  }
  .my-input {
    // margin: 0 24px;
    background-color: #f4f5f6;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 8rpx;
    flex: 1;
    margin-bottom: 32rpx;
    padding: 20rpx 32rpx;

    .btn-code {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 185rpx;
      height: 51rpx;
      margin-left: 20rpx;
      text-align: right;
      .text {
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }
}
</style>
