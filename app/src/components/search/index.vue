<template>
  <view class="search-view" :style="searchBoxStyle">
    <view class="search-view-box" :style="boxStyle">
      <image v-if="props.searchBg" class="search-bg" :src="props.searchBg" />
      <u-search
        v-model="searchVal"
        :disabled="props.disabled"
        :bgColor="props.bgColor"
        :inputStyle="props.inputStyle"
        :placeholder="props.placeholder"
        :focus="props.focus"
        :showAction="false"
        :searchIcon="props.searchIcon"
        :borderColor="props.borderColor"
        :placeholderStyle="props.placeholderStyle"
        searchIconSize="20"
        height="67rpx"
        shape="round"
        @change="onChange"
        @clear="handleEndSearch"
        @click="handleSearch"
        @custom="handleCustom"
        @search="handleEndSearch"
      ></u-search>
      <view :style="props.searchBtnStyle" class="btn" @tap="handleEndSearch">
        <image
          v-if="props.searchBtnIconBg"
          class="search-btn-bg"
          :src="props.searchBtnIconBg"
        />
        <text class="text">搜索</text>
      </view>
      <view v-if="props.disabled" class="search-box" @tap="handleSearch"></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
const props = defineProps({
  searchBoxStyle: {
    type: Object,
    default: () => {
      return {
        padding: "24rpx",
      };
    },
  },
  boxStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  searchBtnStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
  searchVal: {
    type: String,
    default: "",
  },
  searchBtnIconBg: {
    type: String,
    default: "",
  },
  searchBg: {
    type: String,
    default: "",
  },
  searchIcon: {
    type: String,
    default: "/static/images/common/icon_search.png",
  },
  bgColor: {
    type: String,
    default: "#fff",
  },
  borderColor: {
    type: String,
    default: "#1CC7BE",
  },
  disabled: {
    type: Boolean,
    default: true,
  },
  focus: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "请输入搜索关键词",
  },
  inputStyle: {
    type: Object,
    default: () => {
      return {
        backgroundColor: "#fff",
        paddingRight: "190rpx",
        caretColor: "#1CC7BE",
      };
    },
  },
  placeholderStyle: {
    type: Object,
    default: () => {
      return {
        color: "#AFAFAF",
        fontSize: "14px",
      };
    },
  },
});
const searchVal = ref(props.searchVal);
const emit = defineEmits(["change", "search", "custom"]);

const onChange = (val: any) => {
  emit("change", val);
  searchVal.value = val;
};

const handleEndSearch = () => {
  emit("search", searchVal.value);
};
const handleCustom = (val: any) => {
  if (!props.disabled) {
    emit("custom", val);
  } else {
    uni.navigateTo({
      url: "/pages/search/index",
    });
  }
};

const handleSearch = () => {
  uni.navigateTo({
    url: "/pages/search/index",
  });
};

watchEffect(() => {
  searchVal.value = props.searchVal;
});
</script>

<style scoped lang="scss">
@import "@/static/style/customicons.scss";
.search-view {
  display: flex;
  justify-content: center;
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
  position: relative;
  flex: 1;

  .search-view-box {
    position: relative;
    height: 72rpx;
    .search-bg {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      flex: 1;
    }
    .search-box {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 999;
    }
    .line {
      position: absolute;
      right: 114rpx;
      top: 20rpx;
      height: 36rpx;
      border-left: 2rpx solid #afafaf;
    }
    .btn {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 136rpx;
      height: 56rpx;
      top: 8rpx;
      right: 8rpx;
      background-color: $app-main-color;
      border-radius: 110rpx;
      .text {
        font-weight: 400;
        font-size: 28rpx;
        color: #fff;
      }
      .search-btn-bg {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        width: 136rpx;
        height: 56rpx;
      }
    }
  }
}
</style>
