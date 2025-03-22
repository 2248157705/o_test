<template>
  <view class="uni-countdown">
    <text v-if="showHour" :style="[timeStyle]" class="uni-countdown__number">{{
      h
    }}</text>
    <text
      v-if="showHour"
      :style="[splitorStyle]"
      class="uni-countdown__splitor"
      >{{ showColon ? ":" : hourText }}</text
    >
    <text :style="[timeStyle]" class="uni-countdown__number">{{ i }}</text>
    <text :style="[splitorStyle]" class="uni-countdown__splitor">{{
      showColon ? ":" : minuteText
    }}</text>
    <text :style="[timeStyle]" class="uni-countdown__number">{{ s }}</text>
    <text
      v-if="!showColon"
      :style="[splitorStyle]"
      class="uni-countdown__splitor"
      >{{ secondText }}</text
    >
  </view>
</template>
<script>
/**
 * Countup 数数+up=计时
 * @description 计时器 组件
 *
 * @tutorial https://ext.dcloud.net.cn/plugin?id=7886
 *
 * @property {String} backgroundColor 背景色
 * @property {String} color 文字颜色
 * @property {String} splitorColor 分割符号颜色
 * @property {Number} fontSize 文字大小
 *
 * @property {Number} hour 小时
 * @property {Number} minute 分钟
 * @property {Number} second 秒
 *
 * @property {Boolean} showHour = [true|false] 是否显示天数（默认 true ）
 * @property {Boolean} showColon = [true|false] 是否以冒号为分隔符 （默认 true ）
 * @property {Boolean} autoStart = [true|false] 是否自动开始倒计时 （默认 true ）
 *
 *
 * @event {Function} change 倒计时变化时触发
 * @event {Function} start	开始倒计时
 * @event {Function} pause	暂停倒计时
 * @event {Function} reset	重设倒计时，若 start 为 true，重设后会自动开始倒计时
 * @example <bing-countup ></bing-countup>
 */
export default {
  name: "BingCountup",
  emits: ["change", "start", "pause", "reset", "timeup"],
  props: {
    //css样式
    backgroundColor: {
      type: String,
      default: "",
    },
    splitorMargin: {
      type: String,
      default: "",
    },
    splitorFontSize: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#333",
    },
    splitorColor: {
      type: String,
      default: "#333",
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    //时间
    hour: {
      type: Number,
      default: 0,
    },
    minute: {
      type: Number,
      default: 0,
    },
    second: {
      type: Number,
      default: 0,
    },

    //展示
    showHour: {
      type: Boolean,
      default: true,
    },
    showColon: {
      type: Boolean,
      default: true,
    },
    autoStart: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      timer: null,
      syncFlag: false,
      h: "00",
      i: "00",
      s: "00",
      leftTime: 0,
      seconds: 0,
      // 倒计时是否正在进行中
      runing: false,
    };
  },
  computed: {
    hourText(val) {
      return "时";
    },
    minuteText(val) {
      return "分";
    },
    secondText(val) {
      return "秒";
    },

    timeStyle() {
      const { color, backgroundColor, fontSize } = this;
      return {
        color,
        backgroundColor,
        fontSize: `${fontSize}px`,
        width: `${(fontSize * 22) / 14}px`, // 按字体大小为 14px 时的比例缩放
        lineHeight: `${(fontSize * 20) / 14}px`,
        borderRadius: `${(fontSize * 3) / 14}px`,
        position: `relative`,
        top: `-2`,
      };
    },
    splitorStyle() {
      const {
        splitorColor,
        fontSize,
        backgroundColor,
        splitorMargin,
        splitorFontSize,
      } = this;
      return {
        color: splitorColor,
        fontSize: splitorFontSize
          ? splitorFontSize
          : `${(fontSize * 12) / 14}px`,
        margin: splitorMargin
          ? splitorMargin
          : backgroundColor
            ? `${(fontSize * 4) / 12}px`
            : "",
      };
    },
    secondsCom() {
      return this.hour + this.minute + this.second;
    },
  },
  watch: {
    hour(val) {
      this.changeFlag();
    },
    minute(val) {
      this.changeFlag();
    },
    second(val) {
      this.changeFlag();
    },
    autoStart: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.runing = true;
          this.startData();
        } else {
          if (!oldVal) return;
          clearInterval(this.timer);
        }
      },
    },
    secondsCom: {
      immediate: true,
      deep: true,
      handler() {
        this.countUp();
      },
    },
  },
  created: function (e) {
    this.seconds = this.toSeconds(this.hour, this.minute, this.second);
    this.countUp();
  },
  // #ifndef VUE3
  destroyed() {
    clearInterval(this.timer);
  },
  // #endif
  // #ifdef VUE3
  unmounted() {
    clearInterval(this.timer);
  },
  // #endif
  methods: {
    //转化为秒
    toSeconds(hours, minutes, seconds) {
      return hours * 60 * 60 + minutes * 60 + seconds;
    },
    //计时开始
    countUp() {
      let seconds = this.seconds;
      let [hour, minute, second] = [0, 0, 0];
      if (seconds >= 0) {
        hour = Math.floor(seconds / (60 * 60));
        minute = Math.floor(seconds / 60) - hour * 60;
        second = Math.floor(seconds) - hour * 60 * 60 - minute * 60;
      }

      /* 提交给change事件 */
      let timeData = {
        hour: hour,
        minute: minute,
        second: second,
        seconds: seconds,
      };
      this.$emit("change", timeData);

      /* 规范页面显示 */
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }

      this.h = hour;
      this.i = minute;
      this.s = second;

      //触发结束
      if (
        this.h + this.i + this.s != "000000" &&
        this.h + this.i + this.s <= 0
      ) {
        this.timeUp();
      }
    },
    startData() {
      if (this.seconds <= 0) {
        this.seconds = this.toSeconds(0, 0, 0);
      }
      clearInterval(this.timer);
      this.runing = true;
      this.timer = setInterval(() => {
        this.seconds--;
        this.countUp();
      }, 1000);
    },
    update() {
      this.startData();
    },

    changeFlag() {
      if (!this.syncFlag) {
        this.seconds = this.toSeconds(this.hour, this.minute, this.second);
        this.startData(this.seconds);
        this.syncFlag = true;
      }
    },
    //时间到触发
    timeUp() {
      clearInterval(this.timer);
      this.$emit("timeup");
    },
    // 开始
    start() {
      if (this.runing) return;
      uni.log.info("开始时间");
      // 标识为进行中
      this.runing = true;
      this.startData(this.seconds);
    },

    // 重置倒计时
    reset() {
      uni.log.info("重置时间====会调用一下暂停时间函数");
      this.pause();
      this.seconds = 0;
      if (this.autoStart) {
        uni.log.info("自动开始，从0开始");
        this.startData();
      } else {
        this.countUp();
      }
    },
    // 暂停时间
    pause() {
      uni.log.info("暂停时间");
      this.runing = false;
      clearInterval(this.timer);
    },
  },
};
</script>
<style lang="scss" scoped>
$font-size: 32rpx;

.uni-countdown {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  &__splitor {
    margin: 0 2rpx;
    font-size: $font-size;
    color: #333;
    font-family: Barlow-Medium;
    font-weight: 500;
  }

  &__number {
    text-align: center;
    font-size: $font-size;
    font-family: Barlow-Medium;
  }
}
</style>
