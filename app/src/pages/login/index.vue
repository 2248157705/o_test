<template>
  <global-view :showBar="false">
    <image class="l-bg" src="/static/images/login/bg.png"></image>
    <view class="l-nav">
      <view @click="handleBack">
        <image class="l-close" src="/static/images/login/close.png"></image>
      </view>
    </view>

    <view class="l-wrap">
      <view class="login-section">
        <view class="l-head">
          <image class="l-logo" src="/static/images/login/icon.png"></image>
          <image class="l-tile" src="/static/images/login/title.png"></image>
        </view>

        <view class="l-item-wrap">
          <view class="l-item phone">
            <text class="l-item-name">手机号</text>
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
          <view class="l-item code">
            <u-code
              ref="uCodeRef"
              changeText="重新发送(Xs)"
              @change="codeChange"
            />
            <text class="l-item-name">验证码</text>
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
            <view :class="`${codeColor}`" class="send-code" @tap="getCode">{{
              codeChangeText
            }}</view>
          </view>
        </view>
      </view>

      <view style="margin: 0rpx 40rpx">
        <view class="btn-login-box" style="margin: 0rpx 0rpx 30rpx">
          <u-button
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
              <text class="text"
                >我已阅读并同意
                <text class="text link" @tap.stop="toUserAgreement"
                  >《用户服务协议及规则》、
                  <text class="text link" @tap.stop="toUserPrivacy"
                    >《隐私政策》、</text
                  >
                  <text class="text link" @tap.stop="toTradingRules"
                    >《虚拟物品交易规则》</text
                  ></text
                >
              </text>
            </view>
          </label>
        </u-checkbox-group>
      </view>

      <view class="l-way-section">
        <text class="l-way-title">- 其他登录方式 -</text>
        <view class="l-way">
          <view class="l-w-item" @click="handleDyLogin">
            <image
              class="l-w-img"
              src="/static/images/login/douyin.png"
            ></image>
          </view>
          <view class="l-w-item" @click="handleWxLogin">
            <image class="l-w-img" src="/static/images/login/wx.png"></image>
          </view>
        </view>
      </view>
    </view>

    <popup
      ref="popupRef"
      :popupStyle="popupStyle"
      mode="center"
      :closeable="false"
      :closeOnClickOverlay="false"
    >
      <view class="l-pop">
        <view class="l-pop-title">
          <text class="l-title">请阅读并同意</text>
          <text class="l-link">《用户协议》</text>
          <text class="l-link">《隐私协议》</text>
        </view>
        <view class="agreen">同意</view>
        <view class="think" @click="toClose">再想想</view>
      </view>
    </popup>
  </global-view>
</template>

<script setup lang="ts">
import GlobalView from "@/components/global-view/index.vue";
import { ref, reactive, computed } from "vue";
import { toUserAgreement, toTradingRules, toUserPrivacy } from "@/utils/index";
import { loginBySMS, sendSMS } from "@/api/login";
import { getReqConfig } from "@/utils";
import { useUserStore } from "@/stores/user";
import { setUserId } from "@/utils/bugly/index";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { navigateBack } from "@/utils/login";
import { getPlatform } from "@/utils/report/report";
import { useReportStore } from "@/stores/report/index";
import { Login } from "@/components/payment/login";
import Popup from "@/components/popup/index.vue";
import { LoginReport, LoginType } from "@/utils/report/module/login";

const { wxLogin, dyLogin } = Login();
const {
  reportLoginPre,
  reportLogin,
  reportLoginSuccess,
  reportLoginFailed,
  reportLoginPreSuccess,
  reportLoginPreFailed,
} = LoginReport();
const reportStore = useReportStore();
const popupRef = ref(null);
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
  width: "100%",
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
  launch_option: null,
});
// 验证码发送文案显示
const codeChangeText = ref("");
const codeChange = (text: string) => {
  codeChangeText.value = text;
};

const popupStyle = {
  backgroundColor: "#fff",
  borderTopLeftRadius: "24rpx",
  borderTopRightRadius: "24rpx",
  borderBottomLeftRadius: "24rpx",
  borderBottomRightRadius: "24rpx",
  padding: "24rpx",
  boxSizing: "border-box",
};
const toClose = () => {
  popupRef.value.close();
};

const phone = computed(() => {
  return form.phone.replace(/[^\d]/g, "");
});

const codeColor = computed(() => {
  return codeChangeText.value === "获取验证码" ||
    codeChangeText.value === "重新获取"
    ? "active"
    : "invalid";
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
  const {
    campaign_id,
    campaign_extra,
    p_channel,
    p_channel_id,
    p_campaign_id,
    p_campaign_extra,
  } = reportStore.deviceInfo;
  const { session_id } = reportStore.userData;
  return {
    device_id,
    client_os,
    client_name,
    client_system,
    client_type,
    app_client_version,
    network_type,
    campaign_id,
    campaign_extra,
    p_channel,
    p_channel_id,
    p_campaign_id,
    p_campaign_extra,
    session_id,
    platform: getPlatform(),
  };
};

const loginSucess = (userData) => {
  setUserId({
    userId: userData.uid,
  });
  userStore.setUserInfo(userData);
  userStore.init();
  reportLoginSuccess(userData);
  handleBack();
};

const handleLogin = async () => {
  if (!form.agree) {
    uni.$main.toast("请阅读并同意协议");
    return;
  }
  if (checkInput()) {
    reportLogin();
    const device_info = await getDeviceInfo();
    form.unique_id = device_info.device_id;
    form.client_type = device_info.client_type;
    form.device_info = device_info;
    form.launch_option = device_info;
    console.log("form", form);
    loginBySMS({ ...form, phone: phone.value })
      .then((data) => {
        uni.log.info(data, "login-data");
        const userData = {
          ...data,
          phone: phone.value,
          device_info: device_info,
        };
        loginSucess(userData);
      })
      .catch((err) => {
        reportLoginFailed(err);
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
    reportLoginPre(LoginType.PHONE);

    // 通知验证码组件内部开始倒计时
    uCodeRef.value.start();
    sendSMS({
      phone: phone.value,
      sendType: 0,
    })
      .then(() => {
        reportLoginPreSuccess();
        uni.$main.toast("验证码已发送");
        phoneFocus.value = false;
        codeFocus.value = true;
      })
      .catch((err) => {
        uni.log.info(err);
        uCodeRef.value.reset();
        form.sms_code = "";
        reportLoginPreFailed(err);
      });
  }
};

const handleAgreeChange = () => {
  form.agree = !form.agree;
  checkedAgree.value = form.agree ? [""] : [];
};

const handleWxLogin = async () => {
  if (!form.agree) {
    uni.$main.toast("请阅读并同意协议");
    return;
  }
  reportLoginPre(LoginType.WEIXIN);

  const device_info = await getDeviceInfo();
  wxLogin({
    params: {
      client_type: device_info.client_type,
      device_info,
    },
    authFn: (res) => {
      console.log("wxLogin authFn", res);
      if (res?.status) {
        const userData = {
          ...res.data,
          phone: "",
          device_info,
        };
        loginSucess(userData);
      } else {
        reportLoginFailed(res);
        uni.$main.toast(res?.msg || res?.errMsg);
      }
    },
    sdkFn: (res) => {
      console.log("wxLogin sdkFn", res);
      if (res?.status) {
        reportLogin();
        reportLoginPreSuccess();
        code;
      } else {
        reportLoginPreFailed(res);
        uni.$main.toast(res?.errMsg);
      }
    },
  });
};

const handleDyLogin = async () => {
  if (!form.agree) {
    uni.$main.toast("请阅读并同意协议");
    return;
  }

  reportLoginPre(LoginType.DOUYIN);

  const device_info = await getDeviceInfo();
  dyLogin({
    params: {
      client_type: device_info.client_type,
      device_info,
    },
    authFn: (res) => {
      if (res?.status) {
        const userData = {
          ...res.data,
          phone: "",
          device_info,
        };
        loginSucess(userData);
      } else {
        reportLoginFailed(res);
        uni.$main.toast(res?.msg || res?.errMsg);
      }
    },
    sdkFn: (res) => {
      if (res?.status) {
        reportLogin();
        reportLoginPreSuccess();
      } else {
        reportLoginPreFailed(res);
        uni.$main.toast(res?.errMsg);
      }
    },
  });
};
</script>

<style scoped lang="scss">
@import "@/static/style/customicons.scss";
:deep(.u-button) {
  background-color: #1cc7be !important;
}

.l-pop {
  padding: 32rpx 32rpx 10rpx;
  border-radius: 24rpx;
  overflow: hidden;
  .l-pop-title {
    font-weight: 400;
    font-size: 32rpx;
    text-align: center;
    .l-link {
      color: #1cc7be;
    }
    .l-title {
      color: #1a1a1a;
    }
  }
  .agreen {
    border-radius: 12rpx;
    background: #1cc7be;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    padding: 20rpx 0rpx;
    text-align: center;
    margin: 20rpx 0rpx;
  }
  .think {
    padding: 20rpx 0rpx;
    font-weight: 400;
    font-size: 32rpx;
    color: #afafaf;
    text-align: center;
  }
}
.l-wrap {
  padding-top: 240rpx;
}

.l-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0rpx;
  right: 0rpx;
  //right: 24rpx;
  // top: 100rpx;
  top: 120rpx;
  padding: 0rpx 24rpx;
  .l-close {
    width: 48rpx;
    height: 48rpx;
  }
  .l-question {
    font-weight: 400;
    font-size: 28rpx;
    color: #606060;
    text-align: right;
  }
}

.l-bg {
  position: absolute;
  top: 0rpx;
  left: 0rpx;
  background: white;
  width: 750rpx;
}

.login-section {
  .l-item-wrap {
    background: white;
  }
  .l-head {
    text-align: center;
  }
  .l-logo {
    // margin: 0 auto;
    width: 136rpx;
    height: 136rpx;
    border-radius: 50%;
  }
  .l-tile {
    margin-top: 40rpx;
    width: 624rpx;
    height: 58rpx;
  }
  .phone {
    margin: 40rpx;
  }
  .code {
    margin: 48rpx 40rpx;
  }

  .l-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border: 2rpx solid #eeeeee;
    padding: 20rpx 12rpx;
    border-radius: 12rpx;
    .l-item-name {
      margin-right: 40rpx;
    }
    .send-code {
      font-weight: 500;
      font-size: 32rpx;
      color: #1cc7be;
    }
    .active {
      color: #1cc7be;
    }
    .invalid {
      color: #afafaf;
    }
  }
}

.l-way-section {
  margin-top: 180rpx;
  .l-way-title {
    width: 100%;
    text-align: center;
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
    display: inline-block;
    margin: 0 auto;
  }
  .l-way {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 72rpx;

    .l-w-img {
      margin: 0rpx 60rpx;
      width: 104rpx;
      height: 104rpx;
    }
  }
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
