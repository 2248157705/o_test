<template>
  <view>
    <view
      class="maoScroll-main"
      :style="'height:' + lineHeight * showLine + 'rpx;'"
    >
      <view :style="'margin-top:-' + marginTop + 'rpx;'">
        <view
          v-for="(item, index) in showdata"
          :key="'maoScroll' + index"
          :style="'height:' + lineHeight + 'rpx;'"
        >
          <slot :line="item" />
        </view>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref } from "vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  //显示条数
  showNum: {
    type: Number,
    default: 3,
  },
  // 每行高度
  lineHeight: {
    type: Number,
    default: 60,
  },
  // 滑动时间
  animationScroll: {
    type: Number,
    default: 500,
  },
  // 滑动间隔
  animation: {
    type: Number,
    default: 2000,
  },
});
const showdata = ref([]);
const marginTop = ref(0);
const showLine = ref(0);

const animationFunc = () => {
  if (marginTop.value >= props.data.length * props.lineHeight) {
    marginTop.value = 0;
  }
  const stepTime = props.animationScroll / props.lineHeight;
  let step = 0;
  const timer = setInterval(() => {
    marginTop.value = marginTop.value + 1;
    step++;
    if (step >= props.lineHeight) {
      clearInterval(timer);
    }
  }, stepTime);
};

const init = () => {
  showLine.value =
    props.showNum < props.data.length ? props.showNum : props.data.length;
  for (let i = 0; i < props.data.length; i++) {
    showdata.value.push(props.data[i]);
  }
  for (let i = 0; i < showLine.value; i++) {
    showdata.value.push(props.data[i]);
  }
  setInterval(animationFunc, props.animation);
};
init();
</script>

<style>
.maoScroll-main {
  width: 750rpx;
  overflow: hidden;
}
</style>
