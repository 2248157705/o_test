<template>
  <u-loading-page
    v-if="userStore.loading"
    :loading="userStore.loading"
    loading-mode="spinner"
    loading-text="加载中..."
  ></u-loading-page>

  <view
    v-else
    class="global-view"
    :style="{
      height: screenHeight + 'px',
      background: props.bgColor,
    }"
  >
    <image
      v-if="showBgImage"
      class="global-bg"
      :src="bgImage"
      :style="{
        flex: 1,
        width: '100%',
        height: bgImgHeight + 'px',
      }"
    />
    <slot v-if="$slots.bgImage" name="bgImage"> </slot>
    <view id="global-bar" ref="globalBar">
      <slot v-if="showBar" name="bar">
        <u-status-bar v-if="!$slots.bar" />
      </slot>
    </view>
    <scroll-view
      v-if="scroll"
      id="scrollView"
      scroll-y="true"
      :scroll-top="scrollTop"
      :show-scrollbar="false"
      :style="scrollStyle"
      @scroll="handleScroll"
    >
      <slot></slot>
    </scroll-view>

    <slot v-else></slot>

    <realPopup
      title="实名认证"
      :show="mainStore.realPopupVisible"
      @close="handleCloseRealPopup"
    >
      <real-verification @success="handleCloseRealPopup" />
    </realPopup>
    <my-toast />

    <ChecKPermissionPopup
      ref="cameraPermissionPopupRef"
      :show="mainStore.permissionPopup?.visible"
      title="温馨提示"
      mode="center"
      showConfirmButton
      showCancelButton
      :text="checKPermissionText"
      @confirm="onCameraPermissionPopupConfirm"
      @close="onCameraPermissionPopupClose"
    />

    <SuspensionMessage
      v-if="isShowMessage"
      ref="suspensionMessageRef"
      :screenHeight="screenHeight"
    />

    <permission-notify />

    <debuggerBox v-if="commonStore.openDebugger" />
  </view>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import { onShow, onLoad, onUnload, onHide } from "@dcloudio/uni-app";
import debuggerBox from "@/components/debug/index.vue";
import MyToast from "@/components/my-toast/index.vue";
import RealPopup from "@/components/my-popup/index.vue";
import SuspensionMessage from "@/components/suspension-message/index.vue";
import RealVerification from "@/components/real-verification/index.vue";
import ChecKPermissionPopup from "@/components/my-popup/index.vue";
import PermissionNotify from "@/components/permission-notify/permission-notify.vue";
import permission from "@/utils/permission";
import { interceptorPage } from "@/utils/report/report";
import { useMainStore } from "@/stores/main";
import { useCommonStore } from "@/stores/common";
import { checkIsLogin } from "@/utils/login";
import { useUserStore } from "@/stores/user";
import { TabBarBadgeUtil, isBarPage } from "@/utils/tabbar-badge";

const mainStore = useMainStore();
const userStore = useUserStore();
const commonStore = useCommonStore();
const reportPage = interceptorPage();
const tabBarBadgeUtil = TabBarBadgeUtil();

const globalBar = ref(null);
const scrollHeight = ref(uni.getSystemInfoSync().windowHeight);
const scrollTop = ref(0);
const oldScrollTop = ref(0);

const props = defineProps({
  height: {
    type: Boolean,
    default: true,
  },
  // 默认背景图片
  bgImage: {
    type: String,
    default: "/static/images/common/global_bg.png",
  },
  bgImageHeight: {
    type: [String, Number],
    default: "",
  },
  // 默认背景颜色
  bgColor: {
    type: String,
    default: "#fff",
  },
  // 是否显示bar 需要自定义navbar的时候传入false 通过 #bar插槽传入
  showBar: {
    type: Boolean,
    default: true,
  },
  // 是否使用scroll-view组件作为滚动
  scroll: {
    type: Boolean,
    default: true,
  },
  showBgImage: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(["scroll"]);
const showBgImage = ref(props.showBgImage);
const checKPermissionText = ref("");

const scrollStyle = computed(() => {
  if (!props.height)
    return {
      height: "auto",
    };
  return {
    height: scrollHeight.value + "px",
  };
});

const screenHeight = computed(() => {
  if (props.height) {
    return uni.getSystemInfoSync().windowHeight;
  }
  return "auto";
});
const bgImgHeight = computed(() => {
  return props.bgImageHeight ? props.bgImageHeight : screenHeight.value;
});

const isShowMessage = computed(() => {
  const pages = getCurrentPages();
  if (pages && pages.length > 0) {
    const _page = pages[pages.length - 1].$page;
    const arr = ["pages/sell-account/sell-game-enter/index"];
    if (
      !_page?.meta?.isTabBar &&
      !arr.includes(_page?.route) &&
      userStore.isFloatChat &&
      _page?.route.indexOf("components/im/") < 0 &&
      checkIsLogin()
    ) {
      return true;
    }
    return false;
  }
  return false;
});

watch(
  () => mainStore.permissionPopup?.visible,
  (val) => {
    if (val) {
      checKPermissionText.value = mainStore.permissionPopup?.text;
    }
  }
);

const handlerPage = () => {
  // #ifdef APP-NVUE
  nextTick(() => {
    const dom = weex.requireModule("dom");
    dom.getComponentRect(globalBar.value, (option) => {
      if (option && option.result) {
        if (option && option.size.height) {
          scrollHeight.value =
            uni.getSystemInfoSync().windowHeight - option.size.height;
        }
      }
    });
  });
  // #endif

  // #ifndef APP-NVUE
  nextTick(() => {
    const query = uni.createSelectorQuery().in(this);
    query
      .select("#global-bar")
      .boundingClientRect((data) => {
        if (data) {
          scrollHeight.value =
            uni.getSystemInfoSync().windowHeight - data.height;
        }
      })
      .exec();
  });
  // #endif

  nextTick(() => {
    if (!showBgImage.value && typeof getCurrentPages == "function") {
      if (isBarPage()) {
        showBgImage.value = true;
      }
    }
  });
};

const handleScroll = (e) => {
  oldScrollTop.value = e.detail.scrollTop;
  emits("scroll", e);
};

const handleCloseRealPopup = () => {
  mainStore.toggleRealPopup(false);
};

const pageScrollTo = (to) => {
  scrollTop.value = oldScrollTop.value;
  nextTick(() => {
    scrollTop.value = scrollTop.value + to;
  });
};

const pageScrollToTop = (top = 0) => {
  scrollTop.value = oldScrollTop.value;
  nextTick(() => {
    scrollTop.value = top;
  });
};

const onCameraPermissionPopupConfirm = () => {
  permission.gotoAppPermissionSetting();
};

const onCameraPermissionPopupClose = () => {
  mainStore.setPermissionPopup({
    visible: false,
  });
};

onLoad(() => {
  console.log("global-view onload");
  reportPage.onLoad();
  handlerPage();
});

onShow(() => {
  console.log("global-view onShow");
  reportPage.onShow();
  tabBarBadgeUtil.load();
});

onUnload(() => {
  handleCloseRealPopup();
  reportPage.onHide();
  tabBarBadgeUtil.unload();
  console.log("global-view onUnload");
});

onHide(() => {
  reportPage.onHide();
  console.log("global-view onHide");
});

defineExpose({
  pageScrollTo,
  oldScrollTop,
  pageScrollToTop,
});
</script>

<style lang="scss" scoped>
.global-view {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  .global-bg {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    flex: 1;
  }
}
</style>
