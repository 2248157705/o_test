<template>
  <view v-show="imageUrl" class="t-cropper" disable-scroll>
    <!-- #ifdef MP-WEIXIN || MP-ALIPAY-->
    <canvas
      id="canvas-cropper"
      type="2d"
      canvas-id="canvas-cropper"
      class="canvas"
    ></canvas>
    <!-- #endif -->

    <!-- #ifdef APP-PLUS || H5 -->
    <canvas
      :canvas-id="canvasId"
      :style="{
        width: origin.canvasWidth + 'px',
        height: origin.canvasHeight + 'px',
      }"
    ></canvas>
    <!-- #endif -->
    <!-- 裁剪区域 -->
    <view class="t-preview-container" :class="{ showPage: inInit }">
      <view
        class="preview-body"
        @touchstart="(e) => touchStart(e, 'body')"
        @touchmove="touchMove"
        @touchend="touchEnd"
        @touchcancel="touchCancel"
      >
        <!-- 完整背景图片 -->
        <view
          class="image-wrap"
          :class="{ transit: origin.transit }"
          :style="comImageStyle('image-wrap')"
        >
          <image
            class="image"
            :class="{ transit: origin.transit }"
            :src="origin.imageUrl"
            :style="comImageStyle('image')"
            @load="imageLoad"
          />
        </view>
        <view class="mask-model"></view>
        <view
          class="frame-box"
          :class="{ transit: origin.transit }"
          :style="comImageStyle('frame-box')"
        >
          <view class="rect" :style="cirStyle">
            <!-- 裁剪框图片 -->
            <view
              class="image-rect"
              :class="{ transit: origin.transit }"
              :style="comImageStyle('image-rect')"
            >
              <image
                class="rect-img"
                :class="{ transit: origin.transit }"
                :src="origin.imageUrl"
                :style="comImageStyle('image')"
              />
            </view>
          </view>
          <!-- 矩阵框线条 -->
          <view v-if="radius < 50" class="line-box">
            <view class="line-one"></view>
            <view class="line-two"></view>
            <view class="line-three"></view>
            <view class="line-four"></view>
          </view>
          <view
            class="frame-left-top"
            @touchstart.stop="(e) => touchStart(e, 'left-top')"
          ></view>
          <view
            class="frame-left-bottom"
            @touchstart.stop="(e) => touchStart(e, 'left-bottom')"
          ></view>
          <view
            class="frame-right-top"
            @touchstart.stop="(e) => touchStart(e, 'right-top')"
          ></view>
          <view
            class="frame-right-bottom"
            @touchstart.stop="(e) => touchStart(e, 'right-bottom')"
          ></view>
        </view>
      </view>

      <!-- 底部工具栏 -->
      <view class="toolbar">
        <view class="btn-cancel" @tap.stop="onCancle">取消</view>
        <!-- <view v-if="isRotateBtn" class="btn-rotate" @tap.stop="onAngle">
          <image src="../../static/svg/rotate.svg" data-type="inverse" />
        </view> -->
        <view class="btn-confirm" @tap.stop="onConfirm">确定</view>
      </view>
    </view>
  </view>
</template>

<script>
/**
 * @name:防抖
 * @param {function} fn
 * @param {wait} wait
 * @return {function}
 */
const debounce = (fn, wait = 1000) => {
  let time = null;
  return function (...args) {
    if (time) clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};
export default {
  /**
   * @property {String} mode 模式
   * @value fixed 固定模式，裁剪出固定大小
   * @value ratio 等比模式，宽高等比缩放
   * @value free 自由模式，不限制宽高比
   * @property {String} imageUrl 图片路径
   * @property {Number} width 宽度
   * @property {Number} height 高度
   * @property {Number} maxWidth 最大宽度
   * @property {Number} minHeight 最大高度
   * @property {Number} scaleRatio 裁剪比列缩放
   * @property {Number} minRatio 最小缩放
   * @property {Number} maxRatio 最大缩放
   * @property {Boolean} isRotateBtn 是否显示旋转
   * @property {Boolean} isCutSize 是否导出高清裁剪原图
   * @property {Number} radius 裁剪图片圆角半径，单位px
   * @property {Number} delay 快速重复点击时间
   */
  props: {
    mode: {
      type: String,
      default: "ratio",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 200,
    },
    height: {
      type: Number,
      default: 200,
    },
    maxWidth: {
      type: Number,
      default: 1024,
    },
    maxHeight: {
      type: Number,
      default: 1024,
    },
    scaleRatio: {
      type: Number,
      default: 0.7,
    },
    minRatio: {
      type: Number,
      default: 1,
    },
    maxRatio: {
      type: Number,
      default: 3,
    },
    isRotateBtn: {
      type: Boolean,
      default: true,
    },
    isCutSize: {
      type: Boolean,
      default: true,
    },
    radius: {
      type: Number,
      default: 0,
    },
    delay: {
      type: Number,
      default: 250,
    },
  },
  emits: ["confirm", "cancel"],
  data() {
    return {
      inInit: false, //是否初始化
      canvasId: Math.random().toString(36).slice(-6), //获取组件实例
      // 获取原始图片的大小
      origin: {
        imageUrl: "", //设置图片url
        real: {
          //原始图片宽高
          width: 100,
          height: 100,
        },
        body: {
          //页面宽高
          width: 100,
          height: 100,
        },
        frame: {
          //矩形框
          left: 50,
          top: 50,
          width: 200,
          height: 300,
        },
        bgImage: {
          //背景框
          left: 20,
          top: 20,
          width: 300,
          height: 400,
        },
        rotate: 0,
        transit: false,
        canvasWidth: 100,
        canvasHeight: 100,
      },
      //绘制手指触摸
      move: {
        touchType: "body", //移动的类型
        start: {
          //开始的位置
          frame: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          },
          bgImage: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
          },
        },
      },
      touch: {
        touchStart: [], //记录开始触摸
      },
    };
  },
  computed: {
    //计算圆角比列
    cirStyle() {
      const { width } = this.origin.frame;
      const scale = this.width / width;
      const radius = this.radius / scale;
      return `border-radius: ${radius}px`;
    },
  },

  watch: {
    // 监听原始图片的变动
    imageUrl(val) {
      console.warn("imageUrl", val);
      if (val) {
        uni.showLoading({
          title: "请稍候...",
          mask: true,
        });
        this.origin.imageUrl = val; //设置图片url
      }
    },
  },
  mounted() {
    this.onConfirm = this.createConfirm(); //确定按钮防抖
  },
  methods: {
    // 检测图片加载完成
    imageLoad(e) {
      const { width, height } = e.detail;
      this.origin.real.width = width;
      this.origin.real.height = height;
      const query = uni.createSelectorQuery().in(this);
      query
        .select(".preview-body")
        .boundingClientRect((data) => {
          this.origin.body.width = data.width;
          this.origin.body.height = data.height;
          this.inInit = true;
          this.imageReset(); //重置图片
        })
        .exec();
    },

    //重置图片
    imageReset() {
      this.origin.rotate = 0;
      const frameRate = this.width / this.height; //裁剪比列
      let frameHeight = this.origin.body.height * this.scaleRatio; //裁剪框图片高度 * 缩小0.7倍
      let frameWidth = this.origin.body.width * this.scaleRatio; //裁剪框图片宽度 * 缩小0.7倍
      // 缩放后的宽度/高度 > 组件裁剪的比例，就要对宽度重写
      if (frameWidth / frameHeight > frameRate) {
        frameWidth = frameHeight * frameRate;
      } else {
        frameHeight = frameWidth / frameRate;
      }

      // 裁剪框左边距=页面宽度-裁剪框宽度 / 2
      const frameleft = (this.origin.body.width - frameWidth) / 2;
      const frameTop = (this.origin.body.height - frameHeight) / 2;
      this.origin.frame = {
        left: frameleft,
        top: frameTop,
        width: frameWidth,
        height: frameHeight,
      };

      // 背景图片位置：
      const bgRate = this.origin.real.width / this.origin.real.height; //背景比列
      let bgWidth = frameWidth;
      let bgHeight = frameHeight;

      // 裁剪框图片宽度/裁剪框图片高度>实际的图片比例
      if (bgWidth / bgHeight > bgRate) {
        bgHeight = bgWidth / bgRate;
      } else {
        bgWidth = bgHeight * bgRate;
      }

      // 背景左边距
      const bgLeft = (frameWidth - bgWidth) / 2 + this.origin.frame.left;
      // 背景右边距
      const bgTop = (frameHeight - bgHeight) / 2 + this.origin.frame.top;

      this.origin.bgImage = {
        left: bgLeft,
        top: bgTop,
        width: bgWidth,
        height: bgHeight,
      };
      uni.hideLoading();
    },
    // 公共图片背景位置
    comImageStyle(source) {
      const { left, top, width, height } = this.origin.bgImage;
      if (source == "image-wrap") {
        //计算背景盒子样式
        return `
        top: ${top}px;
        left: ${left}px;
        width: ${width}px;
        height: ${height}px;
         `;
      } else if (source == "image") {
        // 计算背景图片样式
        let left = 0;
        let top = 0;
        let width = this.origin.bgImage.width;
        let height = this.origin.bgImage.height;

        if (this.origin.rotate % 180 != 0) {
          width = this.origin.bgImage.height;
          height = this.origin.bgImage.width;
          top = width / 2 - height / 2;
          left = height / 2 - width / 2;
        }
        const style = {};
        style.left = left + "px";
        style.top = top + "px";
        style.width = width + "px";
        style.height = height + "px";
        style.transform = `rotate(${this.origin.rotate}deg)`;
        return style;
      } else if (source == "image-rect") {
        // 计算裁剪框上显示的图片位置
        return `
          top: ${top - this.origin.frame.top}px;
          left: ${left - this.origin.frame.left}px;
          width: ${width}px;
          height: ${height}px;
        `;
      } else if (source == "frame-box") {
        return `
          left: ${this.origin.frame.left}px;
          top: ${this.origin.frame.top}px;
          width: ${this.origin.frame.width}px;
          height: ${this.origin.frame.height}px;
        `;
      }
    },
    // 取消按钮
    onCancle() {
      this.$emit("cancel");
    },
    // 旋转按钮
    onAngle() {
      this.origin.rotate -= 90;
      let width = this.origin.bgImage.height;
      let height = this.origin.bgImage.width;
      let left = this.origin.bgImage.left;
      let top = this.origin.bgImage.top;
      const rate = width / height;
      if (width < this.origin.frame.width) {
        width = this.origin.frame.width;
        height = width / rate;
      }
      if (height < this.origin.frame.height) {
        height = this.origin.frame.height;
        width = height * rate;
      }
      if (left > this.origin.frame.left) {
        left = this.origin.frame.left;
      }
      if (top > this.origin.frame.top) {
        top = this.origin.frame.top;
      }
      if (left + width < this.origin.frame.left + this.origin.frame.width) {
        left = this.origin.frame.left + this.origin.frame.width - width;
      }
      if (top + height < this.origin.frame.top + this.origin.frame.height) {
        top = this.origin.frame.top + this.origin.frame.height - height;
      }
      this.origin.bgImage = {
        left: left,
        top: top,
        width: width,
        height: height,
      };
      this.origin.transit = true;
      setTimeout(() => {
        this.origin.transit = false;
      }, 300);
    },
    // 确定按钮
    onConfirm() {},
    //确定按钮防抖
    createConfirm() {
      return debounce(() => {
        try {
          // #ifdef H5 || APP-PLUS
          this.confirmH5();
          // #endif
          // #ifdef MP-WEIXIN || MP-ALIPAY
          this.confirmWx();
          // #endif
        } catch (error) {
          uni.log.warn("头像剪切错误=>", error);
        }
      }, this.delay);
    },
    async confirmH5() {
      // const this = this;
      const mx = this.computeMatrix(); //获取画布的信息
      // 设备画布的宽高
      this.origin.canvasWidth = mx.tw;
      this.origin.canvasHeight = mx.th;
      uni.showLoading({
        title: "处理中",
      });

      // 设置宽高后等待更新完成在获取Canvas节点
      await new Promise((resolve) => {
        const timer = setTimeout(() => {
          clearTimeout(timer);
          resolve();
        }, 200);
      });

      // 创建一个画布
      const ctx = uni.createCanvasContext(this.canvasId, this);
      // 矩形内清除指定的像素
      await ctx.clearRect(0, 0, mx.tw, mx.th);
      //剪切圆角
      await this.drawClipImage(ctx, mx);
      // 旋转
      ctx.rotate((this.origin.rotate * Math.PI) / 180);
      //绘制图片
      ctx.drawImage(
        this.imageUrl,
        mx.sx,
        mx.sy,
        mx.sw,
        mx.sh,
        mx.dx,
        mx.dy,
        mx.dw,
        mx.dh
      );
      ctx.restore();

      ctx.draw(false, () => {
        uni.canvasToTempFilePath(
          {
            canvasId: this.canvasId,
            // #ifdef H5
            destWidth: this.isCutSize ? mx.tw : this.origin.frame.width,
            destHeight: this.isCutSize ? mx.th : this.origin.frame.height,
            // #endif
            success: (res) => {
              let path = res.tempFilePath;
              console.log("res.tempFilePath=>", res.tempFilePath);
              // #ifdef H5
              path = this.parseBlob(path);
              this.$emit("confirm", {
                errMsg: "parseBlob:ok",
                tempFilePath: path,
              });
              // #endif

              // #ifdef APP-PLUS
              this.$emit("confirm", res);
              // #endif
            },
            fail: (err) => {
              console.log(err);
            },
            complete: () => {
              uni.hideLoading(); //关闭loading
            },
          },
          this
        );
      });
    },
    confirmWx() {
      uni.showLoading({
        title: "处理中",
      });
      const mx = this.computeMatrix(); //获取画布的信息
      uni
        .createSelectorQuery()
        // #ifndef MP-ALIPAY
        .in(this)
        // #endif
        .select("#canvas-cropper")
        .fields({
          node: true,
          size: true,
        })
        .exec(async (res) => {
          const textCanvas = res[0].node;
          const ctx = textCanvas.getContext("2d");

          // 初始化画布大小
          textCanvas.width = mx.tw;
          textCanvas.height = mx.th;
          // //绘制canvas
          await this.drawClipImage(ctx, mx); //剪切圆角
          await ctx.rotate((this.origin.rotate * Math.PI) / 180);
          await this.createImage(this.origin.imageUrl, mx, ctx, textCanvas);

          // #ifdef MP-WEIXIN
          wx.canvasToTempFilePath({
            canvas: textCanvas,
            canvasId: "canvasID",
            success: (res) => {
              this.$emit("confirm", res);
            },
            fail: (err) => {
              console.log(err);
            },
          });
          // #endif

          // #ifdef MP-ALIPAY
          textCanvas.toTempFilePath({
            success: (res) => {
              this.$emit("confirm", res);
            },
            fail: (err) => {
              console.log(err);
            },
          });
          // #endif

          uni.hideLoading(); //关闭loading
        });
    },
    //剪切图片圆角
    drawClipImage(ctx, mx) {
      let { radius } = this;
      if (radius > 0) {
        const w = Math.round(mx.tw); //画布宽度
        const h = Math.round(mx.th); //画布高度

        // 被缩放后的尺寸且裁剪的宽高相同
        if (this.width === this.height && w == h && this.width < w) {
          radius = (w / this.width) * radius;
        }
        // 被缩放后的尺寸且裁剪的宽高不相同
        if (this.width != this.height && w != h && this.width < w) {
          if (w > h) {
            radius = (w / h) * radius;
          } else {
            radius = (h / w) * radius;
          }
        }
        // 如果裁剪是圆形
        if (w === h && radius >= w / 2) {
          // 圆形
          ctx.arc(w / 2, h / 2, w / 2, 0, 2 * Math.PI);
        } else {
          // 圆角矩形
          if (w !== h) {
            // 限制圆角半径不能超过短边的一半
            radius = Math.min(w / 2, h / 2, radius);
          }
          // 其他形状
          ctx.moveTo(radius, 0);
          ctx.arcTo(w, 0, w, h, radius);
          ctx.arcTo(w, h, 0, h, radius);
          ctx.arcTo(0, h, 0, 0, radius);
          ctx.arcTo(0, 0, w, 0, radius);
          ctx.closePath();
        }
        ctx.clip(); //从原始画布剪切任意形状和尺寸的区域
        ctx.restore(); //返回之前保存过的路径状态和属性
      }
    },
    // 创建一个图片
    createImage(img, mx, ctx, textCanvas) {
      return new Promise((resolve) => {
        const headerImg = textCanvas.createImage();
        headerImg.src = img;
        headerImg.onload = () => {
          const result = ctx.drawImage(
            headerImg,
            mx.sx,
            mx.sy,
            mx.sw,
            mx.sh,
            mx.dx,
            mx.dy,
            mx.dw,
            mx.dh
          );
          resolve(result);
        };
      });
    },
    // 计算矩阵
    computeMatrix() {
      let width = this.width;
      let height = this.height;
      let mul = this.origin.bgImage.width / this.origin.real.width;
      if (this.origin.rotate % 180 != 0) {
        mul = this.origin.bgImage.height / this.origin.real.width;
      }
      if (this.mode != "fixed") {
        width = this.origin.frame.width / mul;
        height = this.origin.frame.height / mul;
      }
      const rate = width / height;
      if (width > this.maxWidth) {
        width = this.maxWidth;
        height = width / rate;
      }
      if (height > this.maxHeight) {
        height = this.maxHeight;
        width = height * rate;
      }
      let sx = (this.origin.frame.left - this.origin.bgImage.left) / mul;
      let sy = (this.origin.frame.top - this.origin.bgImage.top) / mul;
      let sw = this.origin.frame.width / mul;
      let sh = this.origin.frame.height / mul;
      let ox = sx + sw / 2;
      let oy = sy + sh / 2;
      if (this.origin.rotate % 180 != 0) {
        const temp = sw;
        sw = sh;
        sh = temp;
      }
      let angle = this.origin.rotate % 360;
      if (angle < 0) {
        angle += 360;
      }
      if (angle == 270) {
        const x = this.origin.real.width - oy;
        const y = ox;
        ox = x;
        oy = y;
      }
      if (angle == 180) {
        const x = this.origin.real.width - ox;
        const y = this.origin.real.height - oy;
        ox = x;
        oy = y;
      }
      if (angle == 90) {
        const x = oy;
        const y = this.origin.real.height - ox;
        ox = x;
        oy = y;
      }
      sx = ox - sw / 2;
      sy = oy - sh / 2;
      let dr = { x: 0, y: 0, w: width, h: height };
      dr = this.parseRect(dr, -this.origin.rotate);
      return {
        tw: width,
        th: height,
        sx: sx,
        sy: sy,
        sw: sw,
        sh: sh,
        dx: dr.x,
        dy: dr.y,
        dw: dr.w,
        dh: dr.h,
      };
    },
    //计算矩阵
    parseRect(rect, angle) {
      const x1 = rect.x;
      const y1 = rect.y;
      const x2 = rect.x + rect.w;
      const y2 = rect.y + rect.h;
      const p1 = this.parsePoint({ x: x1, y: y1 }, angle);
      const p2 = this.parsePoint({ x: x2, y: y2 }, angle);
      const result = {};
      result.x = Math.min(p1.x, p2.x);
      result.y = Math.min(p1.y, p2.y);
      result.w = Math.abs(p2.x - p1.x);
      result.h = Math.abs(p2.y - p1.y);
      return result;
    },
    //计算x、y
    parsePoint(point, angle) {
      const result = {};
      result.x =
        point.x * Math.cos((angle * Math.PI) / 180) -
        point.y * Math.sin((angle * Math.PI) / 180);
      result.y =
        point.y * Math.cos((angle * Math.PI) / 180) +
        point.x * Math.sin((angle * Math.PI) / 180);
      return result;
    },
    //base64转blob
    parseBlob(base64) {
      const arr = base64.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }
      const url = URL || webkitURL;
      return url.createObjectURL(new Blob([u8arr], { type: mime }));
    },
    touchStart(e, touchType = "") {
      // #ifdef APP-PLUS || H5
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      // #endif

      switch (touchType) {
        case "body":
          this.move.touchType = "body";
          break;
        case "left-top":
          this.move.touchType = "left-top";
          break;
        case "left-bottom":
          this.move.touchType = "left-bottom";
          break;
        case "right-top":
          this.move.touchType = "right-top";
          break;
        case "right-bottom":
          this.move.touchType = "right-bottom";
          break;
        default:
          this.move.touchType = "body";
          break;
      }
      this.touch.touchStart = e.touches;
      // 裁剪框的开始位置
      this.move.start.frame.left = this.origin.frame.left;
      this.move.start.frame.top = this.origin.frame.top;
      this.move.start.frame.width = this.origin.frame.width;
      this.move.start.frame.height = this.origin.frame.height;

      // 背景图片的开始位置
      this.move.start.bgImage.left = this.origin.bgImage.left;
      this.move.start.bgImage.top = this.origin.bgImage.top;
      this.move.start.bgImage.width = this.origin.bgImage.width;
      this.move.start.bgImage.height = this.origin.bgImage.height;
      return false;
    },
    touchMove(e) {
      // #ifdef APP-PLUS || H5
      if (e.preventDefault) {
        e.preventDefault();
      }
      if (e.stopPropagation) {
        e.stopPropagation();
      }
      // #endif
      // 单手操作
      if (this.touch.touchStart.length == 1) {
        if (this.move.touchType == "body") {
          // 移动图片
          this.moveImage(this.touch.touchStart[0], e.touches[0]);
        } else {
          if (this.mode != "fixed") {
            // 放大缩小图片
            this.scaleFrame(this.touch.touchStart[0], e.touches[0]);
          }
        }
      } else if (this.touch.touchStart.length == 2 && e.touches.length == 2) {
        const ta = this.touch.touchStart[0];
        const tb = this.touch.touchStart[1];
        let tc = e.touches[0];
        let td = e.touches[1];
        if (ta.identifier != tc.identifier) {
          const temp = tc;
          tc = td;
          td = temp;
        }
        this.scaleImage(ta, tb, tc, td);
      }
    },
    // 移动图片
    moveImage(ta, tb) {
      const mx = tb.clientX - ta.clientX;
      const my = tb.clientY - ta.clientY;
      // 开始移动图片背景 + 移动的左边距离
      this.origin.bgImage.left = this.move.start.bgImage.left + mx;
      this.origin.bgImage.top = this.move.start.bgImage.top + my;

      const frameLeft = this.origin.frame.left;
      const frameTop = this.origin.frame.top;
      const frameWidth = this.origin.frame.width;
      const frameHeight = this.origin.frame.height;

      // 左边触边
      if (this.origin.bgImage.left > frameLeft) {
        this.origin.bgImage.left = frameLeft;
      }
      // 头部触边
      if (this.origin.bgImage.top > frameTop) {
        this.origin.bgImage.top = frameTop;
      }
      // 右边触边
      if (
        this.origin.bgImage.left + this.origin.bgImage.width <
        frameLeft + frameWidth
      ) {
        this.origin.bgImage.left =
          frameLeft + frameWidth - this.origin.bgImage.width;
      }
      // 底部触边：背景距离头部+背景的高度 < 背景高度 + 矩形框顶部
      if (
        this.origin.bgImage.top + this.origin.bgImage.height <
        frameTop + frameHeight
      ) {
        this.origin.bgImage.top =
          frameTop + frameHeight - this.origin.bgImage.height;
      }
    },
    // 缩放裁剪框
    scaleFrame(ta, tb) {
      const mx = tb.clientX - ta.clientX;
      const my = tb.clientY - ta.clientY;
      let x1 = this.move.start.frame.left;
      let y1 = this.move.start.frame.top;
      let x2 = this.move.start.frame.left + this.move.start.frame.width;
      let y2 = this.move.start.frame.top + this.move.start.frame.height;
      let cx1 = false;
      let cy1 = false;
      let cx2 = false;
      let cy2 = false;
      const mix = 30;
      const rate = this.origin.frame.width / this.origin.frame.height;

      //左上角
      if (this.move.touchType == "left-top") {
        x1 += mx;
        y1 += my;
        cx1 = true;
        cy1 = true;
        // 左下角
      } else if (this.move.touchType == "left-bottom") {
        x1 += mx;
        y2 += my;
        cx1 = true;
        cy2 = true;
        // 右上角
      } else if (this.move.touchType == "right-top") {
        x2 += mx;
        y1 += my;
        cx2 = true;
        cy1 = true;
        // 右下角
      } else if (this.move.touchType == "right-bottom") {
        x2 += mx;
        y2 += my;
        cx2 = true;
        cy2 = true;
      }

      if (x1 < this.origin.bgImage.left) {
        x1 = this.origin.bgImage.left;
      }
      if (y1 < this.origin.bgImage.top) {
        y1 = this.origin.bgImage.top;
      }
      if (x2 > this.origin.bgImage.left + this.origin.bgImage.width) {
        x2 = this.origin.bgImage.left + this.origin.bgImage.width;
      }
      if (y2 > this.origin.bgImage.top + this.origin.bgImage.height) {
        y2 = this.origin.bgImage.top + this.origin.bgImage.height;
      }
      if (cx1) {
        if (x1 > x2 - mix) {
          x1 = x2 - mix;
        }
      }
      if (cy1) {
        if (y1 > y2 - mix) {
          y1 = y2 - mix;
        }
      }
      if (cx2) {
        if (x2 < x1 + mix) {
          x2 = x1 + mix;
        }
      }
      if (cy2) {
        if (y2 < y1 + mix) {
          y2 = y1 + mix;
        }
      }
      if (cx1) {
        if (this.mode != "free") {
          const val = x2 - rate * (y2 - y1);
          if (x1 < val) {
            x1 = val;
          }
        }
      }
      if (cy1) {
        if (this.mode != "free") {
          const val = y2 - (x2 - x1) / rate;
          if (y1 < val) {
            y1 = val;
          }
        }
      }
      if (cx2) {
        if (this.mode != "free") {
          const val = rate * (y2 - y1) + x1;
          if (x2 > val) {
            x2 = val;
          }
        }
      }
      if (cy2) {
        if (this.mode != "free") {
          const val = (x2 - x1) / rate + y1;
          if (y2 > val) {
            y2 = val;
          }
        }
      }

      this.origin.frame.left = x1;
      this.origin.frame.top = y1;
      this.origin.frame.width = x2 - x1;
      this.origin.frame.height = y2 - y1;
    },
    scaleImage(ta, tb, tc, td) {
      const x1 = ta.clientX;
      const y1 = ta.clientY;
      const x2 = tb.clientX;
      const y2 = tb.clientY;
      const x3 = tc.clientX;
      const y3 = tc.clientY;
      const x4 = td.clientX;
      const y4 = td.clientY;
      const ol = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
      const el = Math.sqrt((x3 - x4) * (x3 - x4) + (y3 - y4) * (y3 - y4));
      const ocx = (x1 + x2) / 2;
      const ocy = (y1 + y2) / 2;
      const ecx = (x3 + x4) / 2;
      const ecy = (y3 + y4) / 2;
      const ax = ecx - ocx;
      const ay = ecy - ocy;
      let scale = el / ol;

      // 检测放大/缩小倍率
      if (this.move.start.bgImage.width * scale < this.origin.frame.width) {
        scale = this.origin.frame.width / this.move.start.bgImage.width;
      }

      if (this.move.start.bgImage.height * scale < this.origin.frame.height) {
        scale = this.origin.frame.height / this.move.start.bgImage.height;
      }

      // 最大缩放
      if (
        this.move.start.bgImage.width * scale >
        this.origin.frame.width * this.maxRatio
      ) {
        return;
      }

      this.origin.bgImage.left =
        this.move.start.bgImage.left +
        ax -
        (ocx - this.move.start.bgImage.left) * (scale - 1);

      this.origin.bgImage.top =
        this.move.start.bgImage.top +
        ay -
        (ocy - this.move.start.bgImage.top) * (scale - 1);

      this.origin.bgImage.width = this.move.start.bgImage.width * scale;
      this.origin.bgImage.height = this.move.start.bgImage.height * scale;

      if (this.origin.bgImage.left > this.origin.frame.left) {
        this.origin.bgImage.left = this.origin.frame.left;
      }
      if (this.origin.bgImage.top > this.origin.frame.top) {
        this.origin.bgImage.top = this.origin.frame.top;
      }
      if (
        this.origin.bgImage.left + this.origin.bgImage.width <
        this.origin.frame.left + this.origin.frame.width
      ) {
        this.origin.bgImage.left =
          this.origin.frame.left +
          this.origin.frame.width -
          this.origin.bgImage.width;
      }
      if (
        this.origin.bgImage.top + this.origin.bgImage.height <
        this.origin.frame.top + this.origin.frame.height
      ) {
        this.origin.bgImage.top =
          this.origin.frame.top +
          this.origin.frame.height -
          this.origin.bgImage.height;
      }
    },
    // 手指触摸动作结束
    touchEnd() {
      this.touch.touchStart = [];
      this.resizeImage(); //调整图片的大小
    },
    // 手指触摸动作被打断，如来电提醒，弹窗
    touchCancel() {
      this.touch.touchStart = [];
    },
    // 调整图片的大小
    resizeImage() {
      const rate = this.origin.frame.width / this.origin.frame.height; //比列
      let width = this.origin.body.width * this.scaleRatio; //裁剪框图片高度 * 缩小0.7倍
      let height = this.origin.body.height * this.scaleRatio; //裁剪框图片宽度 * 缩小0.7倍
      // 图片的位置：
      // 缩放后的宽度/高度 > 组件裁剪的比例，就要对宽度重写
      if (width / height > rate) {
        width = height * rate;
      } else {
        height = width / rate;
      }
      let left = (this.origin.body.width - width) / 2;
      let top = (this.origin.body.height - height) / 2;
      const mul = width / this.origin.frame.width;
      const ox = this.origin.frame.left - this.origin.bgImage.left;
      const oy = this.origin.frame.top - this.origin.bgImage.top;

      this.origin.frame = {
        left: left,
        top: top,
        width: width,
        height: height,
      };

      width = this.origin.bgImage.width * mul;
      height = this.origin.bgImage.height * mul;
      left = this.origin.frame.left - ox * mul;
      top = this.origin.frame.top - oy * mul;
      this.origin.bgImage = {
        left: left,
        top: top,
        width: width,
        height: height,
      };
      if (mul != 1) {
        this.origin.transit = true;
        setTimeout(() => {
          this.origin.transit = false;
        }, 300);
      }
    },
  },
};
</script>

<style>
page {
  overflow: hidden;
  overscroll-behavior: none;
}
</style>
<style lang="scss" scoped>
@import "./cropper";
</style>
