<script setup>
import { onLaunch, onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { listeningIMLogin } from "@/components/im/utils/connect";
import { moveToBack } from "@/utils/index";
import { initDebugger } from "@/utils/debug";
import { useMainStore } from "@/stores/main";
import { useUserStore } from "@/stores/user";
import { initBugly } from "@/utils/bugly/index";
import { initReport, interceptorAppLife } from "@/utils/report/report";
import { initOpenInstall } from "@/utils/openinstall/index";
import { getAppAuditConfig } from "@/utils/app-audit/index";
import { openNimPush, closeNimPush } from "@/utils/nim-push/min-push";
import { initDouyin } from "@/utils/douyin/index";
import { FontUtil } from "@/utils/font";
import log from "@/utils/log";

const userStore = useUserStore();
const mainStore = useMainStore();
const reportAppLife = interceptorAppLife();

onLaunch(async (options) => {
  userStore.setLoading(true);
  // 初始化debugger
  initDebugger();
  uni.log = log;
  uni.log.info("App onLaunch", options);
  uni.$main = mainStore;
  // 初始化抖音sdk
  initDouyin();
  // 初始化bugly错误监控
  initBugly();
  // 初始化上报事件
  await initReport();
  // 获取提审配置
  await getAppAuditConfig();
  // 初始化openinstall
  await initOpenInstall();
  // 获取支付配置
  userStore.getPayConfig();
  // 上报监听onLaunch事件
  reportAppLife.onLaunch();
  // 监听IM事件
  listeningIMLogin();
  // #ifndef APP-ANDROID
  moveToBack();
  // #endif
  // 初始化字体
  FontUtil();
  // 强制竖屏
  plus.screen.lockOrientation("portrait-primary");
});

onShow(async () => {
  uni.showTabBar();
  // getAppAuditConfig();
  reportAppLife.onShow();
  // console.log("userStore.messageMotification", userStore.messageMotification);
  if (userStore.messageMotification) {
    closeNimPush();
  }
  // uni.log.test("App onShow");
});

onHide(() => {
  reportAppLife.onHide();
  // console.log("userStore.messageMotification", userStore.messageMotification);
  if (userStore.messageMotification) {
    openNimPush();
  }
  // uni.log.info("App onHide", options);
});
onUnload(() => {
  reportAppLife.onUnload();
  // uni.log.info("App onUnload");
});
</script>

<style lang="scss">
@import "./uni_modules/uview-plus/index.scss";
:deep(.u-cell) {
  padding: 10rpx 5rpx 0rpx 5rpx;
  .u-cell__body {
    padding: 24rpx 0 !important;
  }
  .u-cell__title-text {
    color: #000000 !important;
  }
}
:deep(.u-swiper__wrapper__item__wrapper__image) {
  border-top-left-radius: 12rpx !important;
  border-top-right-radius: 12rpx !important;
  overflow: hidden !important;
}
:deep(.u-search__content__close) {
  position: absolute;
  right: 180rpx;
  top: 15rpx;
}
:deep(.u-subsection--button__bar) {
  background-color: $app-main-color !important;
}
.step-title {
  @include flex(column);
  // align-items: center;
  justify-content: center;
  .en {
    font-weight: bold;
    font-size: 36rpx;
    color: #f4f5f6;
    line-height: 44rpx;
    // letter-spacing: 2px;
    margin-bottom: 4rpx;
  }
  .name {
    font-weight: bold;
    font-size: 48rpx;
    color: #1a1a1a;
    line-height: 58rpx;
    // letter-spacing: 2px;
  }
}
</style>
