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
          <text class="txt">{{ title }}</text>
          <view v-if="false" class="close" @click="close">
            <u--image
              width="48rpx"
              height="48rpx"
              src="/static/images/common/icon_close.png"
            />
          </view>
        </view>
        <view class="form-view">
          <view class="form-item">
            <view class="form-item-lable">
              <text class="txt">选择原因</text>
            </view>
            <view class="form-item-field">
              <radio-box
                :options="options"
                @change="checkboxChange"
              ></radio-box>
            </view>
          </view>
          <view class="form-item">
            <view class="form-item-lable">
              <text class="txt">申请说明</text>
              <text class="require">*</text>
            </view>
            <view class="form-item-field">
              <view class="textarea">
                <u--textarea
                  v-model="formData.apply_desc"
                  placeholder="补充描述，有助于客服更好的处理问题"
                  border="none"
                  :maxlength="maxLength"
                  :placeholderStyle="{ background: '#f4f5f6' }"
                  count
                ></u--textarea>
              </view>
            </view>
          </view>
          <view class="form-item" style="margin: 40rpx 0">
            <view class="btn" @click="handleSubmit">
              <text class="txt">提交</text>
            </view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import RadioBox from "./radio-box";

defineProps({
  title: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const popupStyle = {
  backgroundColor: "#fff", // 修改背景色
  borderRadius: "20rpx", // 修改圆角
  padding: "32rpx", // 修改内边距
  boxSizing: "border-box",
};

const maxLength = ref(300);

const emit = defineEmits(["change"]);

const visible = ref(false);

const formData = reactive({
  reason: "",
  apply_desc: "",
});

const open = () => {
  visible.value = true;
};

const close = () => {
  visible.value = false;
};

const handleSubmit = () => {
  if (formData.reason && formData.apply_desc) {
    if (formData.apply_desc.length > maxLength.value) {
      uni.$main.toast("申请说明不能超过300字");
      return;
    }
    emit("change", formData);
  } else {
    uni.$main.toast("请填写申请说明");
  }
};

const checkboxChange = (value) => {
  formData.reason = value;
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
.form-view {
  .form-item-lable {
    @include flex(row);
    align-items: center;
    margin: 16rpx 0;

    .txt {
      font-weight: 500;
      font-size: 32rpx;
      color: #1a1a1a;
    }
    .require {
      font-size: 32rpx;
      color: #ff0000;
    }
  }
  .form-item-field {
    .textarea {
      padding: 12rpx;
      background: #f4f5f6;
      // box-sizing: border-box;
      border-radius: 4rpx;
    }
  }
}

::v-deep .popup-content .u-textarea {
  background: transparent !important;
}

::v-deep .popup-content .u-textarea__count {
  background: transparent !important;
}
</style>
