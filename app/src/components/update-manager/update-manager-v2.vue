<template>
  <view class="update-mask flex-center">
    <view class="content botton-radius">
      <view class="content-top">
        <view class="content-top-text">
          <text class="">发现新版本 v{{ updateAppData.edition_name }}</text>
          <text class="version">当前版本：{{ formState.version }}</text>
        </view>
        <image
          class="content-top"
          style="top: 0"
          width="100%"
          height="100%"
          src="@/static/images/update/bg_top.png"
        ></image>
      </view>
      <view class="content-header"></view>
      <view class="content-body">
        <view class="title"><text>更新内容</text></view>
        <view class="body">
          <scroll-view class="box-des-scroll" scroll-y="true"
            ><rich-text :nodes="updateAppData.describe"></rich-text
          ></scroll-view>
        </view>
        <view class="footer flex-center">
          <view v-if="!formState.updateBtn" class="progress-box flex-column">
            <progress
              class="progress"
              border-radius="35"
              :percent="formState.percent"
              activeColor="#3DA7FF"
              show-info
              stroke-width="10"
            />
            <!-- <u-line-progress :striped="true" :percent="percent" :striped-active="true"></u-line-progress> -->
            <view
              ><text class="fs24"
                >正在下载，请稍后 ({{ formState.downloadedSize }}/{{
                  formState.packageFileSize
                }}M)</text
              ></view
            >
          </view>

          <button
            v-if="formState.updateBtn"
            class="content-button"
            style="border: none; color: #fff"
            plain
            @click="confirm"
          >
            立即升级
          </button>
        </view>
      </view>

      <image
        v-if="formState.cancleBtn"
        class="close-img"
        src="@/static/images/update/app_update_close.png"
        @click.stop="cancel"
      ></image>
    </view>
  </view>
</template>

<script setup>
import { reactive } from "vue";

const formState = reactive({
  version: "1.0.0", //当前运行版本(打包时manifest里的版本名称)
  percent: 0, //进度条百分比
  updateBtn: true, //是否显示立即更新
  cancleBtn: false, //是否显示取消按钮
  downloadedSize: 0, //当前已下载大小
  packageFileSize: 0, //安装包大小
});

const updateAppData = reactive({
  describe: "1. 修复已知问题<br>2. 优化用户体验",
  edition_url:
    "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-6bef1fe3-e3e3-4909-9f0c-6ed9bd11c93b/aae2360a-6628-4c93-b873-ce1600b9a852.apk", //安装包下载地址或者通用应用市场地址
  edition_force: 1, //是否强制更新 0代表否 1代表是
  package_type: 0, //0是整包升级 1是wgt升级
  edition_name: "1.0.1", //后端返回的版本名称
});

const download = () => {};

const cancel = () => {};

const confirm = () => {};
</script>

<style lang="scss" scoped>
page {
  background: transparent;
}

.flex-center {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
}

.update-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
}

.botton-radius {
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
}

.content {
  position: relative;
  top: 0;
  width: 600rpx;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 50rpx;
  font-family: Source Han Sans CN;
}

.text {
  /* #ifndef APP-NVUE */
  display: block;
  /* #endif */
  line-height: 200px;
  text-align: center;
  color: #ffffff;
}

.content-top {
  position: absolute;
  top: -195rpx;
  left: 0;
  width: 600rpx;
  height: 270rpx;
}

.content-top-text {
  font-size: 40rpx;
  font-weight: bold;
  color: #f8f8fa;
  position: absolute;
  top: 120rpx;
  left: 50rpx;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  height: 70rpx;
}

.title {
  font-size: 33rpx;
  font-weight: bold;
  color: #3da7ff;
  line-height: 38px;
}

.footer {
  height: 150rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.box-des-scroll {
  box-sizing: border-box;
  padding: 0 40rpx;
  text-align: left;
}

.box-des {
  font-size: 26rpx;
  color: #000000;
  line-height: 50rpx;
}

.progress-box {
  width: 100%;
}

.progress {
  width: 83%;
  height: 40rpx;
  border-radius: 35px;
}

.close-img {
  width: 70rpx;
  height: 70rpx;
  z-index: 1000;
  position: absolute;
  bottom: -120rpx;
  left: calc(50% - 70rpx / 2);
}

.content-button {
  text-align: center;
  flex: 1;
  font-size: 30rpx;
  font-weight: 400;
  color: #ffffff;
  border-radius: 40rpx;
  margin: 0 18rpx;

  height: 80rpx;
  line-height: 80rpx;

  background: linear-gradient(to right, #1785ff, #3da7ff);
}

.flex-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.fs24 {
  font-size: 24rpx;
}
.version {
  font-size: 24rpx;
  margin-top: 10rpx;
  color: #eeeeee;
  text-decoration: underline;
}
</style>
