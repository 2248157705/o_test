<template>
  <view
    class="fy-dropdown-floor"
    :style="{
      background: backgroundColor,
    }"
  >
    <view ref="columnRef">
      <scroll-view
        :scroll-y="true"
        :show-scrollbar="false"
        :style="{
          height: '920rpx',
          'background-color': backgroundColor,
        }"
      >
        <view
          class="fy-dropdown-floor_item"
          v-for="(item, index) in options"
          :key="index"
        >
          <view
            style="
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            "
          >
            <text class="fy-dropdown-floor_title">{{ item.label }}</text>
            <view
              class="fy-dropdown-floor_tips"
              v-if="item.type == 'checkbox'"
              @tap="handleMore(item)"
            >
              <text
                class="fy-dropdown-floor_tips_text"
                v-if="selected[item.name] && selected[item.name].length"
                :style="placeholderStyle"
                >已选{{ selected[item.name].length }}个</text
              >
              <view class="icon_dropdown_view" v-if="item.options.length > 6">
                <image
                  class="icon_dropdown"
                  :class="{
                    end: optionsCopy[index].more,
                    start: !optionsCopy[index].more,
                  }"
                  style="width: 36rpx; height: 36rpx"
                  src="/static/images/common/icon_dropdown.png"
                />
              </view>
            </view>
          </view>

          <template v-if="item.type == 'section'">
            <view class="fy-dropdown-floor_ul fy-dropdown-section">
              <view class="section-inp">
                <u--input
                  v-model="selected[item.name][0]"
                  type="digit"
                  placeholder="自定义最低价格"
                  border="none"
                  inputAlign="center"
                  clearable
                  font-size="24rpx"
                />
              </view>
              <text class="line"></text>
              <view class="section-inp">
                <u--input
                  v-model="selected[item.name][1]"
                  type="digit"
                  inputAlign="center"
                  placeholder="自定义最高价格"
                  border="none"
                  clearable
                  font-size="24rpx"
                />
              </view>
            </view>
          </template>
          <template v-if="item.type == 'radio' || item.type == 'checkbox'">
            <view class="fy-dropdown-pick">
              <f-radio
                className="fy popup"
                :type="item.type"
                :list="filterOption(item)"
                :modelValue="selected[item.name]"
                @handleChange="handleCheckboxChange(item, $event)"
              ></f-radio>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>
    <view class="fy-dropdown-button-list">
      <view
        class="fy-dropdown-button-item reset"
        @tap.stop.prevent="handlerCancel"
      >
        <text class="fy-dropdown-button-text" :style="{ color: cancelColor }"
          >重置</text
        >
      </view>
      <view
        class="fy-dropdown-button-item confirm"
        @tap.stop.prevent="handlerConfirm"
      >
        <text class="fy-dropdown-button-text" :style="{ color: confirmColor }"
          >确认</text
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import FBox from "@/components/enter-form/f-radio.vue";
import { cloneDeep } from "lodash-es";
import { reactive, watch, ref, nextTick, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import FRadio from "@/components/enter-form/f-radio.vue";

const height = ref(0);
const columnRef = ref(null);
const placeholderStyle = reactive({
  fontSize: "28rpx",
  color: "#AFAFAF",
});

// #ifdef APP-NVUE
const dom = weex.requireModule("dom");
// #endif

onLoad(() => {
  nextTick(() => {
    // 获取header的高度
    dom.getComponentRect(columnRef.value, (option) => {
      if (option && option.result) {
        if (option.size.height > 400) {
          height.value = 400;
        } else {
          height.value = option.size.height;
        }
      }
    });
  });
});

const props = defineProps({
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
  cancelColor: {
    type: String,
    default: "#606060",
  },
  confirmColor: {
    type: String,
    default: "#fff",
  },
  backgroundColor: {
    type: String,
    default: "#fff",
  },
});

const emit = defineEmits(["success"]);

const selected = reactive({});
const optionsCopy = ref(cloneDeep(props.options));

watch(
  () => props.options,
  (data) => {
    const list = cloneDeep(data);
    for (let i = 0, len = list.length; i < len; i++) {
      selected[list[i].name] = list[i].value;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

function handlerCancel() {
  for (const key in selected) {
    if (selected[key] instanceof Array) {
      selected[key] = [];
    } else {
      selected[key] = "";
    }
  }
}

function filterOption(item) {
  const column = optionsCopy.value.find((op) => op.name == item.name);
  if (!column) return [];
  return column.options.slice(0, column.more ? column.options.length : 6);
}

function handlerConfirm() {
  if (
    selected.price &&
    selected.price.length &&
    selected.price[0] - 0 >= selected.price[1] - 0
  ) {
    uni.$main.toast("最低价格不能大于或等于最高价格");
    return;
  }
  try {
    emit("success", {
      confirm: true,
      type: "filter",
      value: selected,
    });
  } catch (err) {
    emit("success", {
      confirm: true,
      type: "filter",
      value: selected,
    });
  }
}
function handleMore(item) {
  for (const i in optionsCopy.value) {
    if (optionsCopy.value[i].name == item.name) {
      optionsCopy.value[i].more = !optionsCopy.value[i].more;
    }
  }
}

function handleCheckboxChange(item, value) {
  selected[item.name] = item.type == "checkbox" ? value : value[0];
}
</script>

<style lang="scss" scoped>
// 定义混入指令，用于在非nvue环境下的flex定义，因为nvue没有display属性，会报错
@mixin vue-flex($direction: row) {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: $direction;
}
// @include vue-flex;

.fy-dropdown-floor {
  /* background-color: #ffffff; */
}

.fy-dropdown-floor_item {
  padding: 12rpx 0;
  display: flex;

  flex-direction: column;
}
.fy-dropdown-pick {
  flex: 1;
}
.fy-dropdown-floor_title {
  font-size: 32rpx;
  color: #1a1a1a;
  padding-bottom: 24rpx;
  font-weight: 600;
  margin-right: 24rpx;
}
.fy-dropdown-floor_tips {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-top: -25rpx;
  &_text {
    font-weight: 400;
    font-size: 28rpx;
    color: #606060;
  }
  .icon_dropdown {
    &.end {
      transform: rotate(180deg);
      width: 36rpx;
      height: 36rpx;
    }
    &.start {
      transform: rotate(0deg);
      width: 36rpx;
      height: 36rpx;
    }
  }
}
.fy-dropdown-section {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
  .section-inp {
    flex: 1;
    border-radius: 4rpx;
    padding: 10rpx 50rpx;
    background-color: #f4f5f6;
  }
  .line {
    width: 18rpx;
    height: 2rpx;
    background-color: #000000;
    margin: 0 24rpx;
  }
}
.fy-dropdown-floor_li {
  height: 52rpx;
  line-height: 49rpx;
  text-align: center;
  padding: 0 28rpx;
  border-radius: 26rpx;
  background-color: #efefef;
  color: #999999;
  font-size: 26rpx;
  margin-left: 20rpx;
  margin-top: 20rpx;
}
.fy-dropdown-floor_li__active {
  border-color: #00bcd4;
  color: #00bcd4;
  background-color: #ffffff;
}

.fy-dropdown-button-list {
  @include vue-flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
}
.fy-dropdown-button-item {
  @include vue-flex;
  align-items: center;
  justify-content: center;
  width: 240rpx;
  height: $app-max-btn-height;
  background-color: #fff;
  border-radius: $app-box-radius;
  &.reset {
    border: 2rpx solid #1a1a1a;
    margin-right: 22rpx;
  }
  .fy-dropdown-button-text {
    font-weight: 500;
    font-size: 32rpx;
    color: #1a1a1a;
  }
  &.confirm {
    flex: 1;
    background-color: $app-main-color;
    border: 2rpx solid $app-main-color;
  }
}
.fy-dropdown-button-border-left {
  width: 1px;
  height: 100rpx;
  background-color: #f2f2f2;
  transform: scaleX(0.7);
}
</style>
