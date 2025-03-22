<template>
  <view class="quick-words" @tap="showPopup = true">
    <text class="label">请选择快捷输入</text>
    <view class="value-checkbox">
      <text class="pick-text">更多</text>

      <u-icon name="arrow-right" color="#AFAFAF" size="10"></u-icon>
    </view>
  </view>
  <view class="quick-list">
    <scroll-view :scroll-x="true" class="scroll-view">
      <view class="label-items">
        <view
          v-for="(item, index) in params"
          :key="index"
          class="item"
          :class="{
            active: checkedAgree[index]?.length,
          }"
          @tap="handleAgreeChange(index, item)"
        >
          <text class="text">{{ item }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
  <Popup :show="showPopup" title="快捷输入" @close="showPopup = false">
    <scroll-view :scroll-y="true" style="height: 1000rpx" class="scroll-view">
      <view v-for="(item, index) in params" :key="index" class="popup-item">
        <u-checkbox-group
          v-model="checkedAgree[index]"
          activeColor="#539f9a"
          @change="handleAgreeChange(index, item)"
        >
          <label class="read-box" @tap="handleAgreeChange(index, item)">
            <text
              class="text"
              :style="{
                color: checkedAgree[index]?.length ? '#1CC7BE' : '',
              }"
              >{{ item }}</text
            >
            <view class="checkbox">
              <u-checkbox
                v-model="checkedAgree[index]"
                shape="circle"
                activeColor="#1CC7BE"
              />
            </view>
          </label>
        </u-checkbox-group>
      </view>
    </scroll-view>
  </Popup>
</template>

<script setup>
import { ref, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getQuickWords } from "@/api/product";
import Popup from "@/components/popup/index.vue";

const checkedAgree = ref([]);
const checked = ref(true);
const showPopup = ref(false);
const params = ref([]);
const emit = defineEmits(["onChange"]);
const props = defineProps({
  text: {
    type: String,
    default: "",
  },
});
onLoad(async () => {
  const data = await getQuickWords();
  params.value = Object.values(data);
});

const handleAgreeChange = (index, item) => {
  const bool = checkedAgree.value[index]?.length;
  checkedAgree.value[index] = bool ? [] : [""];
  emit("onChange", { bool, text: item });
};

watch(
  () => props.text,
  (newVal) => {
    if (newVal) {
      for (let i = 0; i < params.value.length; i++) {
        checkedAgree.value[i] = newVal.includes(params.value[i]) ? [""] : [];
      }
    }
  },
  {
    deep: true,
  }
);
</script>

<style lang="scss" scoped>
.quick-words {
  margin: 16rpx 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .label {
    font-weight: 400;
    font-size: 28rpx;
    color: #1a1a1a;
  }
  .value-checkbox {
    display: flex;
    flex-direction: row;
    align-items: center;
    .pick-text {
      font-weight: 400;
      font-size: 28rpx;
      color: #afafaf;
    }
  }
}
.quick-list {
  .label-items {
    width: 7300rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .item {
      margin-right: 16rpx;
      margin-bottom: 24rpx;
      padding: 16rpx 24rpx;
      border-radius: 4rpx 4rpx 4rpx 4rpx;
      border: 2rpx solid #f4f5f6;
      background-color: #f4f5f6;
      border-radius: 200rpx;

      .text {
        font-weight: 500;
        font-size: 24rpx;
        color: #1a1a1a;
      }
      &.active {
        border-color: $app-main-color;
        background-color: #f2fffe;
        .text {
          color: $app-main-color;
        }
      }
    }
  }
}
.popup-item {
  border-bottom: 2rpx solid #f4f5f6;
  height: 96rpx;
  .read-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    .text {
      font-weight: 400;
      font-size: 28rpx;
      color: #1a1a1a;
      line-height: 34rpx;
      margin-top: 20rpx;
    }
    .checkbox {
      margin-top: 20rpx;
    }
  }
}
</style>
