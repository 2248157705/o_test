<template>
  <view>
    <u-popup
      v-model:show="visible"
      :closeable="true"
      :custom-style="popupStyle"
      @close="close"
    >
      <view class="popup-content">
        <view class="title">
          <text class="txt">支付方式</text>
        </view>
        <pay-list />
        <view class="btn" @click="handleSubmit">
          <text class="txt">支付</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PayList from "./pay-list.vue";

const popupStyle = {
  backgroundColor: "#fff", // 修改背景色
  borderRadius: "20rpx", // 修改圆角
  padding: "32rpx", // 修改内边距
  boxSizing: "border-box",
};

const emit = defineEmits(["submit"]);

const visible = ref(false);

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

const handleSubmit = () => {
  emit("submit");
};

defineExpose({
  open,
  close,
});
</script>
<style lang="scss" scoped>
.popup-content {
  // box-sizing: border-box;
  // height: 800rpx;

  .title {
    margin-top: 20rpx;
    margin-bottom: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .txt {
      font-weight: 600;
      font-size: 32rpx;
      color: #1a1a1a;
    }
  }

  .btn {
    @include flex(column);
    align-items: center;
    justify-content: center;
    height: 96rpx;
    background: $app-main-color;
    border-radius: 8rpx;

    .txt {
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
    }
  }
}

.pay-list {
  margin-bottom: 30rpx;
  .flex {
    @include flex(row);
  }
  .row {
    @include flex(row);
    align-items: center;
    justify-content: space-between;
  }
  .list {
    margin: 8rpx 0;
    padding: 12rpx 0;
  }
  .img {
    margin-left: 24rpx;
  }
  .name {
    margin-right: 24rpx;
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
  }
}

::v-deep .popup-content .u-textarea {
  background: transparent !important;
}

::v-deep .popup-content .u-textarea__count {
  background: transparent !important;
}
</style>
