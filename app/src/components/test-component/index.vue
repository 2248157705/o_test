<template>
  <global-view bgColor="linear-gradient(to bottom, #ffffff, #F7F9FA)">
    <template #top>
      <u-navbar
        title="测试组件"
        :placeholder="true"
        :autoBack="true"
        :safeAreaInsetTop="true"
      />
    </template>
    <view>
      <button text="primary" @click="handleInitBugly">initBugly</button>
      <button text="primary" @click="handleReportError">reportError</button>
      <button type="primary" @click="testAsyncFunc">testAsyncFunc</button>
      <button type="primary" @click="testSyncFunc">testSyncFunc</button>
      <button type="primary" @click="getChannel">getChannel</button>
      <button type="primary" @click="getChannelInfo">getChannelInfo</button>
      <button type="primary" @click="openInstallInit">openInstallInit</button>
      <button type="primary" @click="getInstall">getInstall</button>
      <button type="primary" @click="registerWakeUp">registerWakeUp</button>
      <button type="primary" @click="handleSendTextMsg">sendTextMsg</button>
      <button type="primary" @click="handleSendTextMsgActive">
        sendTextMsgActive
      </button>
      <button type="primary" @click="handleSendCustomSysMsg">
        sendCustomSysMsg
      </button>

      <button type="primary" @click="getHumesdkChannel">
        getHumesdkChannel
      </button>
      <button type="primary" @click="getHumesdkVersion">
        getHumesdkVersion
      </button>
    </view>
  </global-view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import GlobalView from "@/components/global-view/index.vue";
// import { getReqConfig } from "@/utils";
// import { useReportStore } from "@/stores/report/index";
import { initBugly, reportError } from "@/utils/bugly/index";
import {
  sendTextMsg,
  sendTextMsgActive,
  sendCustomSysMsg,
} from "@/utils/nim-push/min-push";

const testModule = uni.requireNativePlugin("TestModule");
// const buglyModule = uni.requireNativePlugin("BuglyModule");
const walleModule = uni.requireNativePlugin("WalleModule");
const openinstall = uni.requireNativePlugin("OpenInstallModule");
const humesdk = uni.requireNativePlugin("HumesdkModule");

onShow(() => {
  //
});

const handleInitBugly = () => {
  uni.log.info("handleInitBugly");
  initBugly();
};

const handleReportError = () => {
  uni.log.info("handleReportError");
  // const reportStore = useReportStore();
  reportError({
    errorMsg: "测试错误了",
    errorType: "error",
    stack: "test-component/index.vue",
    extraInfo: {
      a: 1,
      // device_info: reportStore.deviceInfo,
      // common: reportStore.userData,
    },
  });
};

const testAsyncFunc = () => {
  uni.log.info("testAsyncFunc", testModule, testModule.testAsyncFunc);
  // 调用异步方法
  testModule.testAsyncFunc(
    {
      name: "unimp",
      age: 1,
    },
    (ret) => {
      uni.log.info("testAsyncFunc", ret);
      // uni.showToast({
      //   title: ret,
      //   duration: 2000,
      // });
    }
  );
};
const testSyncFunc = () => {
  // 调用同步方法
  const ret = testModule.testSyncFunc({
    name: "unimp",
    age: 1,
  });
  uni.log.info("testSyncFunc", ret);
  // uni.showToast({
  //   title: ret,
  //   duration: 2000,
  // });
};

const getChannel = () => {
  // 调用同步方法
  const ret = walleModule.getChannel();
  uni.log.info("getChannel", ret);
};

const getChannelInfo = () => {
  // 调用同步方法
  const ret = walleModule.getChannelInfo();
  uni.log.info("getChannel", ret);
};

const openInstallInit = () => {
  openinstall.init();
};

const getInstall = () => {
  openinstall.getInstall(8, (res) => {
    uni.log.info("getInstall", res);
  });
};

const registerWakeUp = () => {
  openinstall.registerWakeUp((res) => {
    uni.log.info("registerWakeUp", res);
  });
};

const handleSendTextMsg = () => {
  sendTextMsg({
    scene: "p2p",
    to: "28729361667",
    body: "推送测试test handleSendTextMsg",
    pushInfo: {
      needPush: true,
    },
  });
};

const handleSendTextMsgActive = () => {
  sendTextMsgActive({
    scene: "p2p",
    to: "28729361667",
    body: "推送测试test handleSendTextMsg",
    pushInfo: {
      needPush: true,
    },
  });
};

const handleSendCustomSysMsg = () => {
  sendCustomSysMsg({
    type: "customP2p",
    to: "28729361667",
    attach: JSON.stringify({
      type: "type",
      value: "value",
    }),
    pushInfo: {
      needPush: true,
    },
  });
};

const getHumesdkChannel = () => {
  // 调用同步方法
  const ret = humesdk.getChannel();
  uni.log.info("humesdk getChannel", ret);
};

const getHumesdkVersion = () => {
  // 调用同步方法
  const ret = humesdk.getVersion();
  uni.log.info("humesdk getVersion", ret);
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  margin-top: 100rpx;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.scroll-verification {
  /* height: 700rpx; */
  padding-bottom: 50rpx;
}
</style>
