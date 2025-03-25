<template>
  <u-modal :show="showClean" :showConfirmButton="false">
    <view class="clean">
      <view>
        <text class="title">清除所有待处理议价单提示</text>
      </view>
      <view class="actions">
        <view class="cancel-box" @click="close">
          <text class="cancel">再想想</text>
        </view>
        <view class="confirm-box" @click="clean">
          <text class="confirm">确定</text>
        </view>
      </view>
    </view>
  </u-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { bargainClearUnread } from "@/api/order";
import { useUserStore } from "@/stores/user";
import { BargainUnReadEnums } from "@/enums/common";

const userStore = useUserStore();
const type = ref([BargainUnReadEnums.BARGAIN_WAIT_SELLER]);
const showClean = ref(false);

const open = (val) => {
  showClean.value = true;
  type.value = val;
};
const close = () => {
  showClean.value = false;
};
const clean = async () => {
  bargainClearUnread({ un_read_enums: type.value }).then((res) => {
    if (res) {
      uni.$u.toast("清除成功");
      close();
    }
    userStore.getMyInfoV2({ order_unread_resp: true });
  });
};
defineExpose({
  open,
});
</script>

<style scoped lang="scss">
.clean {
  flex: 1;
  .title {
    font-size: 32rpx;
    color: #1a1a1a;
    text-align: center;
    font-weight: 400;
  }
  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .cancel-box {
      flex: 1;
    }
    .confirm-box {
      flex: 1;
    }
    .cancel {
      background: #f4f5f6;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #606060;
      text-align: center;
      padding: 18rpx;
      margin: 48rpx 30rpx 0rpx 0rpx;
      text-align: center;
    }
    .confirm {
      background: #1cc7be;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      text-align: center;
      padding: 18rpx;
      margin: 48rpx 0rpx 0rpx;
    }
  }
}
</style>
