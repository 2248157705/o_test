<template>
  <view>
    <popup-view ref="popupRef" :title="title" @close="close">
      <view class="form-view">
        <view class="form-item" style="margin: 40rpx 0">
          <u-radio-group
            v-model="checkedValue"
            :borderBottom="true"
            labelSize="16"
            labelColor="#1A1A1A"
            placement="column"
            iconPlacement="right"
            activeColor="#1CC7BE"
          >
            <u-radio
              v-for="item in options"
              :key="item.value"
              :customStyle="{ marginBottom: '28rpx', paddingBottom: '28rpx' }"
              :label="item.label"
              :name="item.value"
              labelColor="#1A1A1A"
            ></u-radio>
          </u-radio-group>
        </view>
        <view class="form-item" sty le="margin: 40rpx 0; ">
          <view class="btn" @click="handleSubmit">
            <text class="txt">提交</text>
          </view>
        </view>
      </view>
    </popup-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PopupView from "@/components/popup/index.vue";

const props = defineProps({
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

const emit = defineEmits(["change"]);

const popupRef = ref();
const checkedValue = ref();

const handleSubmit = () => {
  if (checkedValue.value) {
    const data = props.options.find((el) => el.value === checkedValue.value);
    emit("change", checkedValue.value, data);
    close();
  } else {
    uni.$main.toast("请选择");
  }
};

const open = () => {
  popupRef.value?.open();
};

const close = () => {
  popupRef.value?.close();
};

defineExpose({
  open,
  close,
});
</script>
<style lang="scss" scoped>
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
</style>
