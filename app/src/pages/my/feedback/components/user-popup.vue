<template>
  <view>
    <popup-view ref="popupRef" :title="title" @close="close">
      <view style="margin: 20rpx 0">
        <z-tabs
          ref="tabs"
          barWidth="56rpx"
          barHeight="8rpx"
          :list="tabData.list"
          :current="tabData.current"
          :inactiveStyle="inactiveStyle"
          :tabsStyle="tabsStyle"
          :activeStyle="activeStyle"
          :barStyle="barStyle"
          @change="tabsChange"
        />
      </view>
      <view class="detail-current">
        <!-- <view class="tips">
          <text class="text">仅展示最近联系的20个{{ submitTypeText }}</text>
        </view> -->
        <scroll-view scroll-y :show-scrollbar="false" style="height: 800rpx">
          <view class="user-box">
            <view
              v-for="item in feedBackData.serviceStaffList"
              :key="item.uid"
              class="user-item"
              @click="handleSelectUser(item)"
            >
              <view v-if="tabData.checked.uid === item.uid" class="checked">
              </view>
              <u-avatar
                class="user-avatar"
                size="52"
                :src="item.avatar"
              ></u-avatar>
              <view class="user-name">
                <text class="text">{{
                  item.merchant_name || submitTypeText
                }}</text>
              </view>
              <view class="user-label">
                <text class="user-label-text">{{ submitTypeBtnText }}</text>
              </view>

              <view class="select-img">
                <u--image
                  v-if="tabData.checked.uid === item.uid"
                  width="48rpx"
                  height="48rpx"
                  bgColor="transparent"
                  :showLoading="false"
                  :fade="false"
                  src="/static/images/common/icon_radio_active.png"
                />
              </view>
            </view>
          </view>
        </scroll-view>
      </view>

      <view>
        <view class="btn" @click="handleSubmit">
          <text class="txt">确定</text>
        </view>
      </view>
    </popup-view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import PopupView from "@/components/popup/index.vue";
import {
  tabsStyle,
  inactiveStyle,
  activeStyle,
  barStyle,
} from "@/utils/operation-style";
import { Feedback } from "@/pages/my/feedback/js/feedback";

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

const emit = defineEmits(["change"]);

const { feedBackData, fetchServiceStaffList } = Feedback();

const popupRef = ref();
const tabData = reactive({
  current: 0,
  staff_type: 2,
  list: [
    { name: "投诉客服", value: 2 },
    { name: "投诉号商", value: 1 },
  ],
  checked: {},
});

const submitTypeBtnText = computed(() => {
  return tabData.staff_type === 1 ? "号商" : "官方";
});

const submitTypeText = computed(() => {
  return tabData.staff_type === 1 ? "号商" : "客服";
});

const tabsChange = (index) => {
  tabData.current = index;
  tabData.staff_type = tabData.list[index].value;
  tabData.checked = {};
  getServiceStaffList();
};

const getServiceStaffList = () => {
  fetchServiceStaffList({
    staff_type: tabData.staff_type,
    per_page: 20,
    page: 1,
  });
};

const handleSelectUser = (item) => {
  tabData.checked = item;
};

const handleSubmit = () => {
  if (tabData.checked.uid) {
    emit("change", { ...tabData.checked, staff_type: tabData.staff_type });
    close();
  } else {
    uni.$main.toast("请选择" + submitTypeText.value);
  }
};

const open = () => {
  popupRef.value?.open();
  tabData.current = 0;
  tabData.staff_type = 2;
  tabData.checked = {};
  getServiceStaffList();
};

const close = () => {
  popupRef.value?.close();
};

onLoad(() => {
  //
});

defineExpose({
  open,
  close,
});
</script>
<style lang="scss" scoped>
.tips {
  margin: 24rpx 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    font-weight: 400;
    font-size: 28rpx;
    color: #afafaf;
  }
}

.user-box {
  @include flex(row);
  flex-wrap: wrap;
  // justify-content: space-between;

  .user-item {
    position: relative;
    @include flex(column);
    align-items: center;
    justify-content: center;
    width: 200rpx;
    height: 252rpx;
    margin: 13rpx 13rpx;
    padding: 0 10rpx;
    background: #f8faf8;
    border-radius: 12rpx 12rpx 12rpx 12rpx;
    overflow: hidden;

    .checked {
      position: absolute;
      left: 0;
      top: 0;
      width: 200rpx;
      height: 252rpx;
      border: 4rpx solid #1cc7be;
      border-radius: 12rpx 12rpx 12rpx 12rpx;
    }

    .select-img {
      position: absolute;
      right: 20rpx;
      top: 20rpx;
      z-index: 100;
    }

    .user-name {
      margin: 16rpx 4rpx;
      .text {
        width: 180rpx;
        text-overflow: ellipsis;
        lines: 1;
        overflow: hidden;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }

    .user-label {
      @include flex(row);
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 40rpx;
      background: #ffffff;
      border-radius: 4rpx 4rpx 4rpx 4rpx;
      border: 1rpx solid #1cc7be;
    }

    .user-label-text {
      font-weight: 600;
      font-size: 24rpx;
      color: #1cc7be;
    }
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
</style>
