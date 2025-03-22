<template>
  <view>
    <u-button text="查询实名结果2" @click="handleCheckVerification" />
    <text>真实姓名:{{ userStore.userInfo?.true_name }}</text>
    <text>身份证号:{{ userStore.userInfo?.identifyNum }}</text>
    <u--input
      v-model="redirectUrl"
      type="text"
      placeholder="请输入redirectUrl"
    />
    <u-button text="点击验证" @click="handleVerification" />
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { faDataIdCardVerify, checkIdCardVerify } from "@/api/user";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const redirectUrl = ref("https://www.baidu.com");
const handleCheckVerification = async () => {
  if (!userStore.userInfo?.uid) {
    uni.$main.toast("请先登录");
    return;
  }
  const data = await checkIdCardVerify({
    uid: userStore.userInfo.uid,
  });
  uni.log.info(data, "222");
  if (data) {
    uni.$main.toast(`认证信息是:${data.true_name}${data.identity}`);
    userStore.setUserInfo({
      ...userStore.userInfo,
      true_name: data.true_name,
      identifyNum: data.identity,
    });
  }
};
const handleVerification = async () => {
  if (!userStore.userInfo?.true_name) {
    uni.$main.toast("请先进行实名认证");
    return;
  }
  const { data } = await faDataIdCardVerify({
    redirectUrl: redirectUrl.value,
  });
  if (data) {
    plus.runtime.openURL(data.authShortUrl);
  } else {
    uni.$main.toast("已认证");
  }
};
</script>
