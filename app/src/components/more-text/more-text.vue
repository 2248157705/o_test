<template>
  <view class="moreText">
    <view
      class="content"
      :style="{
        lineHeight: lineHeight * 2 + 'rpx',
        ...contentStyle,
      }"
    >
      <slot />
    </view>
    <view v-if="realRow > row" class="action">
      <u-icon
        color="#AFAFAF"
        :name="open ? 'arrow-up' : 'arrow-down'"
        @click="moreAction(!open)"
      ></u-icon>
    </view>
  </view>
</template>

<script setup>
import { getCurrentInstance, onMounted } from "vue";
import { useRect, useState } from "./hooks";
const props = defineProps({
  // 行高默认14 px
  lineHeight: {
    type: Number,
    default: 14,
  },
  row: {
    type: Number,
    default: 3,
  },
  animation: Boolean,
});

const [realRow, setRealRow] = useState(0); // 实际行数
const [realHeight, setRealHeight] = useState(0); // 实际高度（px）
const [contentStyle, setContentStyle] = useState({});

const instance = getCurrentInstance();
onMounted(async () => {
  const rect = await useRect(instance, ".content");
  const currentStyle = {
    "-webkit-line-clamp": props.row,
  };
  let currentRow = rect.height / uni.upx2px(props.lineHeight * 2);
  currentRow = parseInt(currentRow);
  if (props.animation && currentRow > props.row) {
    currentStyle.height = props.row * props.lineHeight * 2 + "rpx";
  }
  setContentStyle(currentStyle);
  setRealRow(currentRow);
  setRealHeight(rect.height);
  console.log(rect);
});

const [open, setOpen] = useState(false);
const moreAction = (val) => {
  setOpen(val);
  const currentStyle = val
    ? {}
    : {
        "-webkit-line-clamp": props.row,
      };
  if (props.animation) {
    currentStyle.height = val
      ? realHeight.value + "px"
      : props.row * props.lineHeight * 2 + "rpx";
  }
  setContentStyle(currentStyle);
};
</script>

<style lang="scss" scoped>
.moreText {
  display: flex;
  flex-direction: row;

  .content {
    white-space: pre-line;
    text-overflow: ellipsis;
    display: -webkit-box;
    word-break: break-all;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: height 0.2s;
  }
  .action {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100rpx;
    margin-top: 30rpx;
  }
}
</style>
