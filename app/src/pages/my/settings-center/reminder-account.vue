<template>
  <global-view
    bgColor="linear-gradient(to bottom, #ffffff, #F7F9FA)"
    :showBar="false"
  >
    <view class="reminder-account">
      <my-cell
        title="支付宝"
        :avatar="accountBindData.zfb.social_avatar"
        :describe="accountBindData.zfb.open_id"
        :value="Boolean(accountBindData.zfb.open_id) ? '解除绑定' : `去绑定`"
        @click="handleZFB"
      >
        <template #icon>
          <u--image
            class="icon"
            width="72rpx"
            height="72rpx"
            :src="accountBindData.zfb.social_avatar || img_icon_zfb"
          />
        </template>
      </my-cell>
      <my-cell
        :title="accountBindData.wx.social_nickname || '微信'"
        :value="Boolean(accountBindData.wx.open_id) ? '解除绑定' : `去绑定`"
        :border="true"
        @click="handleWX"
      >
        <template #icon>
          <u--image
            class="icon"
            width="72rpx"
            height="72rpx"
            :src="accountBindData.wx.social_avatar || img_icon_wx"
          />
        </template>
      </my-cell>
    </view>

    <real-popup ref="realPopupRef" title="实名认证">
      <real-verification @success="handleCloseReal" />
    </real-popup>

    <RealConfirmPopup
      ref="withdrawPopupRef"
      title="温馨提示"
      mode="center"
      showConfirmButton
      showCancelButton
      text="根据国家规定，已成年的实名用户才能交易游戏虚拟物品。请先完成实名认证，再绑定收款账号。"
      @confirm="handleShowReal"
    >
    </RealConfirmPopup>
  </global-view>
</template>
<script lang="ts" setup>
import { ref, reactive } from "vue";
import GlobalView from "@/components/global-view/index.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getUserPayAccountBindInfo } from "@/api/user";
import { useUserStore } from "@/stores/user";
import RealPopup from "@/components/my-popup/index.vue";
import RealConfirmPopup from "@/components/my-popup/index.vue";
import RealVerification from "@/components/real-verification/index.vue";
import { Login } from "@/components/payment/login";
import img_icon_zfb from "@/static/images/my/icon_zfb2.png";
import img_icon_wx from "@/static/images/my/icon_wx2.png";
import { relieveBindPayCollectionAccount } from "@/api/user";

const userStore = useUserStore();
const { wxBind } = Login();

onLoad(() => {
  fetchUserPayAccountBindInfo();
});

onShow(async () => {
  // await uni.$u.sleep(500);
  // await fetchUserPayAccountBindInfo();
});

const accountBindData = reactive({
  wx: {},
  zfb: {},
});

const realPopupRef = ref();
const withdrawPopupRef = ref(null);

const handleShowReal = () => {
  realPopupRef.value?.open();
};
const handleCloseReal = () => {
  realPopupRef.value?.close();
};

const fetchUserPayAccountBindInfo = async () => {
  const data = await getUserPayAccountBindInfo().catch((err) => {
    uni.log.info("err", err);
  });
  if (data) {
    const wxData = data.find((el) => el.type === 1);
    const zfbData = data.find((el) => el.type === 2);
    accountBindData.wx = wxData || {};
    accountBindData.zfb = zfbData || {};
  }
};

// 绑定微信
const bindeWX = async () => {
  // 微信绑定
  const data = await wxBind().catch((err) => {
    const { errMsg, code } = err.errMsg;
    if (code !== -2) {
      uni.$u.toast(errMsg || "绑定微信失败");
    }
  });
  if (data?.status) {
    await uni.$u.sleep(300);
    await fetchUserPayAccountBindInfo();
  }
};

// 绑定支付宝
const bindeZFB = () => {
  uni.navigateTo({
    url: "/pages/my/balance-payouts/zfb?backpage=reminder_account",
  });
};

// 解除绑定微信
const unBindeWX = () => {
  relieveBindPayCollectionAccount({
    app_id: import.meta.env.VITE_APP_ZFB_APPID,
    device_info: userStore.userInfo?.device_info,
    account_source: "WEIXIN",
  }).then(() => {
    uni.$main.toast("解绑成功");
    fetchUserPayAccountBindInfo();
  });
};

//  解除绑定支付宝
const unBindeZFB = () => {
  relieveBindPayCollectionAccount({
    app_id: import.meta.env.VITE_APP_ZFB_APPID,
    device_info: userStore.userInfo?.device_info,
    account_source: "ALIPAY_LOGON_ID",
  }).then(() => {
    uni.$main.toast("解绑成功");
    fetchUserPayAccountBindInfo();
  });
};

const handleWX = () => {
  if (!userStore.userInfo?.identifyNum) {
    withdrawPopupRef.value.open();
    return;
  }

  if (accountBindData.wx.open_id) {
    unBindeWX();
  } else {
    bindeWX();
  }
};

const handleZFB = () => {
  if (!userStore.userInfo?.identifyNum) {
    withdrawPopupRef.value.open();
    return;
  }

  if (accountBindData.zfb.open_id) {
    unBindeZFB();
  } else {
    bindeZFB();
  }
};
</script>
<style lang="scss" scoped>
.reminder-account {
  padding: 0 20rpx 20rpx 20rpx;
  .icon {
    margin-right: 10rpx;
  }
}
</style>
