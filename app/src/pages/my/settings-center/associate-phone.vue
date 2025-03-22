<template>
  <GlobalView :showBar="false">
    <view class="privacy-settings-wrapper">
      <view v-if="isBind" class="bind-wrap">
        <text class="bind-tip"
          >一个手机号只能绑定一个账户，更换后可使用新手机号登录此账户。对于已绑定其他账户的手机号，需先注销再进行换绑。</text
        >
        <view class="phone-wrap">
          <text class="bind-phone">已绑定手机号：{{ formatPhone }}</text>
        </view>
      </view>

      <u-cell-group class="cell-group-wrapper" :border="false">
        <view class="cell-item cell-m">
          <text class="cell-name">手机号码</text>
          <u--input
            ref="phoneRef"
            v-model="form.phone"
            class="cell-phone"
            type="tel"
            :maxlength="11"
            :focus="phoneFocus"
            placeholder="请输入手机号"
            border="none"
            clearable
            font-size="36rpx"
          />
        </view>

        <view class="cell-code" :style="{ marginRight: '20rpx' }">
          <view class="cell-item cell-m">
            <text class="cell-name">短信验证</text>
            <u--input
              ref="codeRef"
              v-model="form.sms_code"
              class="cell-phone code-input"
              type="number"
              :maxlength="6"
              placeholder="请输入验证码"
              border="none"
              clearable
              font-size="36rpx"
            />
          </view>

          <view :class="validCode" class="code-wrap" @click="sendCode"
            >{{ codeTxt }}
          </view>
        </view>

        <view class="confirm-wrap" @click="submitPhone">
          <text class="confirm">确定</text>
        </view>
      </u-cell-group>
    </view>
  </GlobalView>
</template>

<script setup>
import { reactive, ref, onBeforeUnmount, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useUserStore } from "@/stores/user";
import GlobalView from "@/components/global-view/index.vue";
import { bindPhone, changeBindingPhone, sendSMS } from "@/api/user";

const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);
const isBind = computed(() => {
  return !!(userInfo.value?.is_bind_phone === 1 && userInfo.value.phone);
});

const formatPhone = computed(() => {
  return userInfo.value.phone.replace(/(?<=\d{3})\d+(?=\d{4})/, "***");
});
const form = reactive({
  phone: "",
  sms_code: "",
});
const phoneFocus = ref(false);
const codeRef = ref(null);
const phoneRef = ref(null);

// 检查输入校验
const checkInput = () => {
  let check = true;
  if (!form.phone) {
    uni.$main.toast("请输入手机号码");
    check = false;
  } else if (/^1(3|4|5|6|7|8|9)\d{9}$/.test(form.phone) == false) {
    uni.$main.toast("请输入正确的手机号码");
    check = false;
  }
  return check;
};

const validCode = computed(() => {
  if (form.phone && form.phone.length == 11 && checkInput()) {
    if (codeTxt.value === "获取验证码") return "enable";
    else return "disable";
  }
  return "disable";
});

const codeTxt = ref("获取验证码");
const timeRemain = ref(60);
let timerId = null;

const sendCode = async () => {
  const check = checkInput();
  if (check && codeTxt.value === "获取验证码") {
    await sendSMS({
      phone: form.phone,
      sendType: 0,
    }).catch((err) => {
      uni.log.info(err);
    });
    uni.$main.toast("验证码已发送");
    timerId && clearInterval(timerId);
    timerId = setInterval(() => {
      const currentRemain = timeRemain.value - 1;
      if (currentRemain < 1) {
        clearInterval(timerId);
        timerId = null;
        codeTxt.value = "获取验证码";
      } else {
        timeRemain.value = currentRemain;
        codeTxt.value = `重新发送(${currentRemain}s)`;
      }
    }, 800);
  }
};

const submitPhone = () => {
  if (!checkInput()) return;
  if (!form.sms_code || form.sms_code.length !== 6) {
    uni.$main.toast("验证码必须是6位");
    return;
  }

  const bindStatus = isBind.value;
  if (bindStatus && form.phone === userInfo.value.phone) {
    uni.$main.toast("该手机号为当前账户绑定号码");
    return;
  }

  let request = bindPhone;
  if (bindStatus) {
    request = changeBindingPhone;
  }
  request(form)
    .then((data) => {
      const { code } = data;
      if (bindStatus && data?.status) {
        uni.$main.toast("换绑成功，可使用新手机号登录");
        userInfo.value.phone = form.phone;
        userStore.setUserInfo({ ...userInfo.value, phone: form.phone });
        setTimeout(() => {
          uni.navigateBack();
        }, 2000);
      } else {
        if (code === 20000 || code === 200) {
          uni.navigateBack();
        }
      }
    })
    .catch((err) => {
      uni.$main.toast(err?.msg || err?.errMsg);
    });
};

onBeforeUnmount(() => {
  timerId && clearInterval(timerId);
  timerId = null;
});

onShow(() => {
  userInfo.value = userStore.userInfo;
});
</script>
<style lang="scss" scoped>
.privacy-settings-wrapper {
  padding: 0 20rpx;
  .bind-wrap {
    margin: 24rpx 12rpx;
    padding: 24rpx 0rpx 24rpx 24rpx;
    .bind-tip {
      font-weight: 400;
      font-size: 32rpx;
      color: #4a4c5a;
      line-height: 28px;
      text-align: left;
    }
    .phone-wrap {
      margin: 40rpx 0rpx 10rpx;
    }
    .bind-phone {
      font-weight: bold;
      font-size: 32rpx;
      color: #1a1a1a;
      text-align: left;
      margin-top: 40rpx;
    }
  }
  .cell-code {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }
  .enable {
    width: 380rpx; //288
    background: #1cc7be;
    padding: 20rpx 0rpx;
  }
  .disable {
    width: 340rpx; //288
    background: rgba(28, 199, 190, 0.6);
    padding: 20rpx 0rpx;
  }

  .cell-m {
    margin: 24rpx;
    padding: 24rpx 0rpx 24rpx 24rpx;
  }
  .cell-item {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background: #f4f5f6;
    border-radius: 12rpx;
    .cell-name {
      font-weight: 500;
      font-size: 32rpx;
      color: #262626;
    }
    .cell-phone {
      margin-left: 24rpx;
      flex: 1;
    }
    .code-input {
      //flex: 1;
      width: 340rpx;
    }
  }
  .code-wrap {
    text-align: center;
    border-radius: 12rpx;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    .code-txt {
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      text-align: center;
      border-radius: 12rpx;
    }
  }
  .confirm-wrap {
    margin: 24rpx;
    margin-top: 28rpx;
    background: #1cc7be;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    padding: 24rpx;
    text-align: center;
    .confirm {
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      text-align: center;
    }
  }
  .describe {
    .text {
      font-size: 26rpx;
      color: #afafaf;
    }
  }
}
</style>
