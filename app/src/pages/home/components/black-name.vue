<template>
  <popup
    ref="popupRef"
    :show="visible"
    :closeable="false"
    :popupStyle="popupStyle"
    zIndex="999"
    title=""
    @close="close"
  >
    <template #bgView>
      <image src="/static/images/home/black_number_bg.png" class="bg" />
    </template>
    <view class="black-box">
      <text class="text-msg">账号信息一键查询</text>
      <view class="input">
        <input
          v-model="searchVal"
          placeholder="请输入需要查询的账号"
          placeholder-style="text-align: center;width: 462rpx;"
        />
      </view>

      <my-button
        class="btn"
        background-color="#1D76FA"
        color="#ffffff"
        radius="112"
        :disabled="!searchVal"
        @tap="handleSearch"
      >
        <view class="btn-content">
          <image
            class="img"
            src="/static/images/my/security-center/search.png"
          />
          <text class="text">查询</text>
        </view>
      </my-button>
    </view>
  </popup>
</template>
<script setup>
import { ref, watch } from "vue";
import Popup from "@/components/my-popup/index.vue";
import { checkBlackAccount } from "@/api/common";
const popupStyle = {
  padding: "0", // 修改内边距
  width: "606rpx",
  height: "490rpx",
  maxHeight: "auto",
  paddingTop: "160rpx",
  marginBottom: "80rpx",
};
const popupRef = ref(null);
const searchVal = ref("");
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});
const visible = ref(props.show);
const emit = defineEmits(["close"]);

const close = () => {
  visible.value = false;
  searchVal.value = "";
  emit("close");
};
watch(
  () => props.show,
  (val, oldVal) => {
    if (val != oldVal) {
      visible.value = val;
    }
  },
  {
    deep: false,
  }
);

// 黑号查询
const handleSearch = async () => {
  if (!searchVal.value) return;
  const data = await checkBlackAccount({ s: searchVal.value });
  console.log("进入", data);
  if (!data.length) {
    uni.$main.toast("该账号不在黑名单中");
    return;
  }
  const msg = data
    .slice(0, 5)
    .map((item) => item.black_reason)
    .toString();
  uni.$main.toast(`该账号因：${msg}已列入黑名单`);
};
</script>
<style lang="scss" scoped>
:deep(.popup-content-view) {
  padding: 0;
}

.bg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 490rpx;
  width: 606rpx;
}
.black-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .text-msg {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
    margin-bottom: 40rpx;
  }
  .input {
    width: 462rpx;
    height: 88rpx;
    display: flex;
    justify-content: center;
    background: #f4f5f6;
    border-radius: 12rpx;
    text-align: center;
    margin-bottom: 40rpx;
    padding: 0 24rpx;
  }
  .btn {
    /* margin: 0 22rpx; */
    margin-top: 40rpx;
  }
  .btn-content {
    @include flex;
    align-items: center;
    justify-content: center;
    width: 542rpx;
    height: 84rpx;
    .img {
      width: 36rpx;
      height: 36rpx;
      margin-right: 12rpx;
    }
    .text {
      font-weight: 500;
      font-size: 28rpx;
      color: #ffffff;
    }
  }
}
</style>
