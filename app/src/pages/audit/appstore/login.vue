<template>
  <global-view :showBar="false">
    <u-navbar
      bgColor="rgba(0,0,0,0)"
      :placeholder="true"
      :autoBack="false"
      @left-click="handleBack"
    />
    <view class="login-wrapper">
      <view class="logo-image">
        <view class="avatar">
          <u--image
            class="account-avatar"
            src="/static/images/my/icon_avatar.png"
            width="136rpx"
            height="136rpx"
          ></u--image>
        </view>
        <text class="title">登录注册</text>
      </view>
      <view class="my-input">
        <view class="phone-region first-line">
          <text class="region">+86</text>
          <u-icon class="icon" name="arrow-down" size="16"></u-icon>
        </view>
        <u--input
          ref="phoneRef"
          v-model="form.phone"
          type="tel"
          :maxlength="13"
          :focus="phoneFocus"
          placeholder="请输入手机号"
          border="none"
          clearable
          font-size="36rpx"
          @change="handlePhoneChange"
        />
      </view>
      <view class="my-input">
        <u-code ref="uCodeRef" @change="codeChange" />
        <view class="first-line">验证码</view>
        <u--input
          ref="codeInpRef"
          v-model="form.sms_code"
          :focus="codeFocus"
          :maxlength="6"
          type="number"
          placeholder="请输入验证码"
          border="none"
          clearable
          font-size="36rpx"
        />
        <view class="btn-code" @tap="getCode">
          <text class="text">{{ codeChangeText }}</text>
        </view>
      </view>
      <view class="btn-login-box">
        <u-button
          width="702rpx"
          height="96rpx"
          size="large"
          text="立即登录"
          :disabled="!form.phone || !form.sms_code"
          :customStyle="customStyle"
          @tap="handleLogin"
        ></u-button>
      </view>
      <u-checkbox-group
        v-model="checkedAgree"
        style="width: 702rpx"
        :size="15"
        activeColor="#539f9a"
        @change="handleAgreeChange"
      >
        <label class="read-box" @tap="handleAgreeChange">
          <u-checkbox class="checkbox" shape="circle" activeColor="#1CC7BE" />
          <view class="link-text">
            <text class="text">我已阅读并同意</text>
            <text class="text link" @click.stop="toUserPrivacy"
              >《隐私政策》</text
            ><text class="text link" @click.stop="toUserAgreement"
              >和《服务协议》</text
            >
          </view>
        </label>
      </u-checkbox-group>
      <text class="prompt-msg">未注册手机将自动注册</text>
    </view>
  </global-view>
</template>

<script setup lang="ts">
import GlobalView from "@/components/global-view/index.vue";
import { ref, reactive, computed } from "vue";
import { loginBySMS, sendSMS } from "@/api/login";
import { getReqConfig } from "@/utils";
import { useUserStore } from "@/stores/user";
import { setUserId } from "@/utils/bugly/index";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { useReportStore } from "@/stores/report/index";
import { toUserAgreement, toUserPrivacy } from "@/utils/index";
import { navigateBack } from "@/utils/login";

const reportStore = useReportStore();
const redirect_url = ref();

onLoad((options) => {
  if (options.redirect_url) {
    redirect_url.value = decodeURIComponent(options.redirect_url);
  } else {
    redirect_url.value = null;
  }
  uni.log.info("login onLoad", options);
});
onUnload(() => {
  // todo
});

const phoneFocus = ref(false);
const codeFocus = ref(false);
const checkedAgree = ref([]);
const uCodeRef = ref(null);
const codeInpRef = ref(null);
const userStore = useUserStore();

const customStyle = reactive({
  borderRadius: "10rpx",
  fontSize: "32rpx",
  color: "#fff",
  width: "702rpx",
  height: "96rpx",
});

const form = reactive({
  channel_id: 0,
  source: "MOBILESMS",
  social_type: 6,
  unique_id: "",
  phone: "",
  sms_code: "",
  agree: false,
  client_type: "",
  device_info: {
    device_id: null,
    client_os: "",
    client_system: "",
    app_client_version: "",
    network_type: "",
  },
});
// 验证码发送文案显示
const codeChangeText = ref("");
const codeChange = (text: string) => {
  codeChangeText.value = text;
};

const phone = computed(() => {
  return form.phone.replace(/[^\d]/g, "");
});

const handleBack = () => {
  navigateBack(redirect_url.value);
};

const handlePhoneChange = (val: string) => {
  let value = val.replace(/[^\d]/g, ""); // 删除所有非数字字符
  value = value.replace(/(\d{3})?(\d{4})?(\d+)?/, function (_, p1, p2, p3) {
    let result = "";
    if (p1) result += p1 + " ";
    if (p2) result += p2 + " ";
    if (p3) result += p3;
    return result.trim();
  });
  form.phone = value;
};

const getDeviceInfo = async () => {
  const {
    device_id,
    client_os,
    client_system,
    app_client_version,
    network_type,
    client_type,
    client_name,
  } = await getReqConfig();
  const { p_channel, campaign_id } = reportStore.deviceInfo;
  return {
    device_id,
    client_os,
    client_name,
    client_system,
    client_type,
    app_client_version,
    network_type,
    p_channel,
    campaign_id,
  };
};

const loginSucess = (userData) => {
  setUserId({
    userId: userData.uid,
  });
  userStore.setUserInfo(userData);
  userStore.init();
  handleBack();
};

const handleLogin = async () => {
  if (!form.agree) {
    uni.$main.toast("请阅读并同意协议");
    return;
  }
  if (checkInput()) {
    const device_info = await getDeviceInfo();
    form.unique_id = device_info.device_id;
    form.client_type = device_info.client_type;
    form.device_info = device_info;

    loginBySMS({ ...form, phone: phone.value })
      .then((data) => {
        uni.log.info(data, "login-data");
        const userData = {
          ...data,
          phone: phone.value,
          device_info: form.device_info,
        };
        loginSucess(userData);
      })
      .catch((err) => {
        uni.$main.toast(err?.msg || err?.errMsg);
      });
  }
};

// 检查输入校验
const checkInput = () => {
  let check = true;
  if (!form.phone) {
    uni.$main.toast("请输入手机号码");
    check = false;
  } else if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone.value) == false) {
    uni.$main.toast("请输入正确的手机号码");
    check = false;
  }
  return check;
};

// 发送验证码
const getCode = async () => {
  const check = checkInput();
  if (uCodeRef.value.canGetCode && check) {
    // 通知验证码组件内部开始倒计时
    uCodeRef.value.start();
    sendSMS({
      phone: phone.value,
      sendType: 0,
    })
      .then(() => {
        uni.$main.toast("验证码已发送");
        phoneFocus.value = false;
        codeFocus.value = true;
      })
      .catch((err) => {
        uni.log.info(err);
        uCodeRef.value.reset();
        form.sms_code = "";
      });
  }
};

const handleAgreeChange = () => {
  form.agree = !form.agree;
  checkedAgree.value = form.agree ? [""] : [];
};
</script>

<style scoped lang="scss">
@import "@/static/style/customicons.scss";
:deep(.u-button) {
  background-color: #1cc7be !important;
}
.login-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 24rpx;
  .prompt-msg {
    font-size: 28rpx;
    margin-top: 30rpx;
    @include app-text-color(0.4);
  }
  .logo-image {
    margin: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .title {
      font-size: 48rpx;
      font-weight: 800;
      margin-top: 16rpx;
      @include app-text-color();
    }
  }

  .my-input {
    // margin: 0 24px;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 8rpx;
    width: 702rpx;
    height: 96rpx;
    margin-bottom: 32rpx;
    padding-right: 20rpx;
    box-sizing: border-box;

    .first-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      width: 160rpx;
    }

    .phone-region {
      width: 160rpx;
      .region {
        margin: 0 10rpx;
      }
    }

    .btn-code {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      border-radius: 50rpx;
      margin-top: -8rpx;
      width: 200rpx;
      height: 51rpx;

      .text {
        font-size: 28rpx;
        @include app-text-color(0.9);
      }
    }
  }

  .read-box {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .checkbox {
      margin-top: 5rpx;
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
        font-size: 28rpx;
        @include app-text-color(0.5);
      }

      .link {
        color: $app-main-color;
      }
    }
  }

  .btn-login-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    margin-top: 50rpx;
    margin-bottom: 30rpx;
  }

  .btn-thrid-login-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    .text {
      font-size: 28rpx;
      @include app-text-color(0.5);
    }
  }
}
</style>
