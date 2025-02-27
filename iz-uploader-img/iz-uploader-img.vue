<template>
  <template v-if="number > 1">
    <view v-if="!imageList.length" class="screenshot" @click="addImages">
      <view class="icon">
        <image
          style="width: 48rpx; height: 48rpx"
          src="/static/images/sell/icon_add.png"
        ></image>
      </view>
      <view class="intro">
        <text class="text1">点击此处上传图片</text>
        <text class="text2">{{
          placeholder || "第一张图将自动作为封面图，截图越详细越能吸引买家"
        }}</text>
      </view>
    </view>
    <view class="con" :class="{ active: imageList.length }">
      <movable-area
        class="area"
        :style="{ height: areaHeight }"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >
        <block v-for="(item, index) in imageList" :key="item.id">
          <movable-view
            class="view"
            :x="item.x"
            :y="item.y"
            direction="all"
            :damping="40"
            :disabled="item.disable"
            :style="{
              width: viewWidth + 'px',
              height: viewWidth + 'px',
              'z-index': item.zIndex,
              opacity: item.opacity,
            }"
            @change="onChange($event, item)"
            @touchstart="touchstart(item)"
            @mousedown="touchstart(item)"
            @touchend="touchend(item)"
            @mouseup="touchend(item)"
          >
            <view class="area-con">
              <image
                class="pre-image"
                :src="item.src"
                mode="aspectFill"
              ></image>
              <view
                v-show="item.progress > 0 && item.progress < 100"
                class="progress"
              >
                {{ item.progress }}%
              </view>
              <view
                class="del-con"
                @click="delImage(item, index)"
                @touchstart.stop="delImageMp(item, index)"
                @touchend.stop="nothing()"
                @mousedown.stop="nothing()"
                @mouseup.stop="nothing()"
              >
                <view class="del-wrap">
                  <image
                    class="del-image"
                    src="/static/images/sell/icon_delete.png"
                  ></image>
                </view>
              </view>
            </view>
          </movable-view>
        </block>
        <view
          v-if="imageList.length < number"
          class="add"
          :style="{
            top: add.y,
            left: add.x,
            width: viewWidth + 'px',
            height: viewWidth + 'px',
          }"
          @click="addImages"
        >
          <view class="add-wrap">
            <image
              style="width: 48rpx; height: 48rpx"
              src="/static/images/sell/icon_add.png"
            ></image>
          </view>
        </view>
      </movable-area>
    </view>
  </template>
  <template v-else>
    <view class="pic-box">
      <view>
        <image class="example" :src="previewImageUrl" @tap="handleExample" />
      </view>

      <view
        style="position: relative"
        @tap="
          () => {
            !imageList[0] && addImages();
          }
        "
      >
        <view
          v-if="imageList[0]"
          class="del-con"
          @tap.stop="delImage(imageList[0], 0)"
          @touchstart.stop="delImageMp(imageList[0], 0)"
          @touchend.stop="nothing()"
          @mousedown.stop="nothing()"
          @mouseup.stop="nothing()"
        >
          <view class="del-wrap">
            <image
              class="del-image"
              src="/static/images/sell/icon_delete.png"
            ></image>
          </view>
        </view>
        <u-upload
          uploadText="上传图片"
          :fileList="
            imageList[0]
              ? [
                  {
                    url: imageList[0]?.src,
                  },
                ]
              : []
          "
          :maxCount="1"
          :disabled="true"
          :deletable="false"
        />
      </view>
    </view>
  </template>
  <canvas
    v-if="canvasposterStyle.width"
    :style="canvasposterStyle"
    class="canvas-poster"
    canvas-id="canvasposter"
  ></canvas>
</template>

<script>
import uploadFile from "@/components/iz-aloss-uploader/iz-uploader.js";
import { getCosAuth } from "@/api/common";
import { chooseImagePermission } from "@/utils/choose-file";
import { getCosAuthJava } from "@/api/common";
import { isArray } from "lodash-es";

export default {
  name: "DragImage",
  props: {
    isSell: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    // 选择图片数量限制
    number: {
      type: Number,
      default: 9,
    },
    // 图片父容器宽度（实际显示的图片宽度为 imageWidth / 1.1 ），单位 rpx
    imageWidth: {
      type: Number,
      default: 100,
    },
    // 图片列数（cols > 0 则 imageWidth 无效）
    cols: {
      type: Number,
      default: 5,
    },
    // 图片周围空白填充，单位 rpx
    padding: {
      type: Number,
      default: 8,
    },
    // 拖动图片时放大倍数 [0, ∞)
    scale: {
      type: Number,
      default: 1.1,
    },
    // 拖动图片时不透明度
    opacity: {
      type: Number,
      default: 0.7,
    },
    // 自定义添加（需配合 @aaddImage 事件使用）
    custom: {
      type: Boolean,
      default: false,
    },
    previewImageUrl: {
      type: String,
      default: "",
    },
    previewImageViewUrl: {
      type: String,
      default: "",
    },
    popupTitle: {
      type: String,
      default: "",
    },
  },
  emits: ["change", "example", "addImage"],
  data() {
    return {
      imageSrc: "",
      canvasposterStyle: {
        width: "",
        height: "",
      },
      imageList: [],
      width: 0,
      add: {
        x: 0,
        y: 0,
      },
      colsValue: 0,
      viewWidth: 0,
      tempItem: null,
      timer: null,
      changeStatus: true,
      preStatus: true,
      previewList: [],
      ossAuthData: {},
      exampleShow: false,
    };
  },
  computed: {
    areaHeight() {
      if (this.imageList.length < this.number) {
        return (
          Math.ceil((this.imageList.length + 1) / this.colsValue) *
            this.viewWidth +
          "px"
        );
      } else {
        return (
          Math.ceil(this.imageList.length / this.colsValue) * this.viewWidth +
          "px"
        );
      }
    },
    childWidth() {
      return this.viewWidth - this.rpx2px(this.padding) * 2 + "px";
    },
  },
  created() {
    this.width = uni.getSystemInfoSync().windowWidth;
    this.viewWidth = this.rpx2px(this.imageWidth);
    getCosAuth().then((res) => {
      this.ossAuthData = res;
    });
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this);
    query.select(".area").boundingClientRect((data) => {
      if (data?.width) {
        this.colsValue = Math.floor(data.width / this.viewWidth);
        if (this.cols > 0) {
          this.colsValue = this.cols;
          this.viewWidth = data.width / this.cols;
        }
      }
    });
    query.exec();
  },
  methods: {
    init(imgs) {
      imgs.forEach((img) => {
        this.addProperties(img, 6);
      });
    },
    handleExample() {
      this.$emit("example");
    },
    onChange(e, item) {
      if (!item) return;
      item.oldX = e.detail.x;
      item.oldY = e.detail.y;
      if (e.detail.source === "touch") {
        if (item.moveEnd) {
          item.offset = Math.sqrt(
            Math.pow(item.oldX - item.absX * this.viewWidth, 2) +
              Math.pow(item.oldY - item.absY * this.viewWidth, 2)
          );
        }
        const x = Math.floor(
          (e.detail.x + this.viewWidth / 2) / this.viewWidth
        );
        if (x >= this.colsValue) return;
        const y = Math.floor(
          (e.detail.y + this.viewWidth / 2) / this.viewWidth
        );
        const index = this.colsValue * y + x;
        if (item.index != index && index < this.imageList.length) {
          this.changeStatus = false;
          for (const obj of this.imageList) {
            if (
              item.index > index &&
              obj.index >= index &&
              obj.index < item.index
            ) {
              this.change(obj, 1);
            } else if (
              item.index < index &&
              obj.index <= index &&
              obj.index > item.index
            ) {
              this.change(obj, -1);
            } else if (obj.id != item.id) {
              obj.offset = 0;
              obj.x = obj.oldX;
              obj.y = obj.oldY;
              setTimeout(() => {
                this.$nextTick(() => {
                  obj.x = obj.absX * this.viewWidth;
                  obj.y = obj.absY * this.viewWidth;
                });
              }, 0);
            }
          }
          item.index = index;
          item.absX = x;
          item.absY = y;
          this.sortList();
        }
      }
    },
    change(obj, i) {
      obj.index += i;
      obj.offset = 0;
      obj.x = obj.oldX;
      obj.y = obj.oldY;
      obj.absX = obj.index % this.colsValue;
      obj.absY = Math.floor(obj.index / this.colsValue);
      setTimeout(() => {
        this.$nextTick(() => {
          obj.x = obj.absX * this.viewWidth;
          obj.y = obj.absY * this.viewWidth;
        });
      }, 0);
    },
    touchstart(item) {
      this.imageList.forEach((v) => {
        v.zIndex = "auto";
      });
      item.zIndex = 99;
      item.moveEnd = true;
      this.tempItem = item;
      this.timer = setTimeout(() => {
        item.scale = this.scale;
        item.opacity = this.opacity;
        clearTimeout(this.timer);
        this.timer = null;
      }, 200);
    },
    touchend(item) {
      this.previewImage(item);
      item.scale = 1;
      item.opacity = 1;
      item.x = item.oldX;
      item.y = item.oldY;
      item.offset = 0;
      item.moveEnd = false;
      setTimeout(() => {
        this.$nextTick(() => {
          item.x = item.absX * this.viewWidth;
          item.y = item.absY * this.viewWidth;
          this.tempItem = null;
          this.changeStatus = true;
        });
      }, 0);
    },
    previewImage(item) {
      if (
        this.timer &&
        this.preStatus &&
        this.changeStatus &&
        item.offset < 28.28
      ) {
        clearTimeout(this.timer);
        this.timer = null;
        const src = this.previewList.findIndex((v) => v === item.src);
        uni.previewImage({
          urls: this.previewList,
          current: src,
          success: () => {
            this.preStatus = false;
            setTimeout(() => {
              this.preStatus = true;
            }, 600);
          },
        });
      } else if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    mouseenter() {
      //#ifdef H5
      this.imageList.forEach((v) => {
        v.disable = false;
      });
      //#endif
    },
    mouseleave() {
      //#ifdef H5
      if (this.tempItem) {
        this.imageList.forEach((v) => {
          v.disable = true;
          v.zIndex = v.index + 9;
          v.offset = 0;
          v.moveEnd = false;
          if (v.id == this.tempItem.id) {
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            v.scale = 1;
            v.opacity = 1;
            v.x = v.oldX;
            v.y = v.oldY;
            this.$nextTick(() => {
              v.x = v.absX * this.viewWidth;
              v.y = v.absY * this.viewWidth;
              this.tempItem = null;
            });
          }
        });
        this.changeStatus = true;
      }
      //#endif
    },

    async file2Img(src) {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src,
          success: (image) => {
            resolve(image);
          },
        });
      });
    },

    //绘制到canvas
    viewDrawToCanvas: function (src, src2) {
      console.log(src, src2);
      // 创建两个Image对象来加载两张图片
      var image1 = new Image();
      var image2 = new Image();
      const that = this;
      return new Promise((resolve, reject) => {
        uni.$main.toast("上传中...");
        image1.onload = function () {
          // 当第一张图片加载完毕后执行
          image2.onload = function () {
            // 当第二张图片加载完毕后执行
            var canvas = document.createElement("canvas");
            canvas.width = image1.width; // 设置画布宽度为两张图片相加的宽度
            canvas.height = image1.height; // 设置画布高度为两张图片中最大的高度

            let width2 = image2.width;
            let height2 = image2.height;
            if (image1.width / width2 < 1) {
              width2 = image1.width / width2;
              height2 = image1.height / height2;
            }

            var ctx = canvas.getContext("2d");
            ctx.drawImage(image1, 0, 0, image1.width, image1.height); // 绘制第一张图片到画布的左上角
            ctx.drawImage(
              image2,
              image1.width - width2,
              image1.height - height2,
              width2,
              height2
            ); // 绘制第二张图片到画布的第一张图片宽度的位置
            // 把合成后的图片转换为Base64格式
            var mergedImage = canvas.toDataURL();
            console.log(canvas.toDataURL, "---");
            that.imageSrc = mergedImage;
            that.addProperties(mergedImage);
            uni.$main.clearToast();
            resolve();
            // 在此处使用合成后的图片
          };

          image2.src = src2; // 加载第二张图片
          image2.setAttribute("crossOrigin", "anonymous");
        };
        image1.setAttribute("crossOrigin", "anonymous");

        image1.src = src; // 加载第一张图片
      });
    },

    //获取临时路径
    getTempFilePath: function () {
      // 当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
      uni.canvasToTempFilePath({
        canvasId: "canvasposter",
        success: (res) => {
          console.log(res);
        },
      });
    },
    addImages() {
      if (this.custom) {
        this.$emit("addImage");
      } else {
        const checkNumber = this.number - this.imageList.length;
        uni.chooseImage({
          count: checkNumber,
          sizeType: "original",
          sourceType: ["album", "camera"],
          success: async (res) => {
            const count =
              checkNumber <= res.tempFilePaths.length
                ? checkNumber
                : res.tempFilePaths.length;

            let cosAuth = this.ossAuthData;
            if (!this.isSell) {
              cosAuth = [];
              const data = await getCosAuthJava({
                type: "idCard",
                source_file_name_list: res.tempFiles.map((temp) => temp.name),
              });
              cosAuth = data.map((item) => {
                return {
                  path: item.oss_file_key,
                  access_key_id: item.oss_key_resp.tmp_secret_id,
                  security_token: item.oss_key_resp.session_token,
                  access_key_secret: item.oss_key_resp.tmp_secret_key,
                  domain: item.oss_key_resp.domain,
                };
              });
            }

            for (let i = 0; i < count; i++) {
              if (this.isSell) {
                await this.viewDrawToCanvas(
                  res.tempFilePaths[i],
                  `${import.meta.env.VITE_APP_CDN_HOST}/taogehao/resource/images/icon-watermark.png`
                );
              } else {
                this.addProperties(res.tempFilePaths[i]);
              }
            }
            this.upload(cosAuth);
          },
          fail: ({ code }) => {
            chooseImagePermission(code);
          },
        });
      }
    },
    addImage(image) {
      this.addProperties(image);
      this.upload();
    },
    delImage(item, index) {
      this.imageList.splice(index, 1);
      for (const obj of this.imageList) {
        if (obj.index > item.index) {
          obj.index -= 1;
          obj.x = obj.oldX;
          obj.y = obj.oldY;
          obj.absX = obj.index % this.colsValue;
          obj.absY = Math.floor(obj.index / this.colsValue);
          this.$nextTick(() => {
            obj.x = obj.absX * this.viewWidth;
            obj.y = obj.absY * this.viewWidth;
          });
        }
      }
      this.add.x =
        (this.imageList.length % this.colsValue) * this.viewWidth + "px";
      this.add.y =
        Math.floor(this.imageList.length / this.colsValue) * this.viewWidth +
        "px";
      this.sortList();
    },
    delImageMp(item, index) {
      //#ifdef MP
      this.delImage(item, index);
      //#endif
    },
    sortList() {
      const list = this.imageList.slice();
      list.sort((a, b) => {
        return a.index - b.index;
      });
      const urlList = [];
      const previewList = [];
      let upSuccessCount = 0;
      let upLoadingCount = 0;
      list.forEach((img) => {
        if (img.status == 2 || img.status == 6) {
          upSuccessCount++;
          const path = img.path ? img.path : import.meta.env.VITE_APP_CDN_HOST;
          urlList.push(path + img.url);
        }
        previewList.push(img.src);
        if (img.status == 1) {
          upLoadingCount++;
        }
      });
      const data = {
        details: list,
        urls: urlList,
        upLoadingCount: upLoadingCount,
        upSuccessCount: upSuccessCount,
        imgCount: this.imageList.length,
      };
      this.previewList = previewList;
      this.$emit("change", data);
    },
    upload(ossAuth) {
      const that = this;
      const promises = [];
      console.log(isArray(ossAuth));
      this.imageList.forEach((img, index) => {
        if (img.status == 0) {
          img.status = 1;
          const promise = new Promise(function (resolve, reject) {
            const uploadTask = uploadFile(
              isArray(ossAuth) ? ossAuth[index] : ossAuth,
              img.src,
              "png",
              (data) => {
                resolve(data);
              },
              reject
            );
            img.uploadTask = uploadTask;
            uploadTask.onProgressUpdate(async function (res) {
              that.$set(img, "progress", res.progress);
              img.uploadInfo = res;
            });
          })
            .then((res) => {
              console.log("1");
              img.progress = 100;
              img.status = 2;
              img.url = res;
            })
            .catch((e) => {
              console.log("2");
              img.status = 99;
              console.log(e);
            });
          promises.push(promise);
        }
      });

      uni.$main.showLoading({
        title: `正在上传...`,
      });
      // console.log("promises===>",promises)
      Promise.all(promises)
        .then((res) => {
          console.log("3");
          uni.$main.hideLoading();
          this.sortList();
        })
        .catch(function (e) {
          uni.$main.hideLoading();
        });
    },
    addProperties(item, status) {
      if (status === undefined) {
        status = 0;
      }
      const absX = this.imageList.length % this.colsValue;
      const absY = Math.floor(this.imageList.length / this.colsValue);
      const x = absX * this.viewWidth;
      const y = absY * this.viewWidth;
      this.imageList.push({
        src: status == 6 ? item.src : item,
        url: status == 6 ? item.url : "",
        path: item.path,
        progress: 0,
        status: status,
        x,
        y,
        oldX: x,
        oldY: y,
        absX,
        absY,
        scale: 1,
        zIndex: 9,
        opacity: 1,
        index: this.imageList.length,
        id: this.guid(),
        disable: false,
        offset: 0,
        moveEnd: false,
      });
      this.add.x =
        (this.imageList.length % this.colsValue) * this.viewWidth + "px";
      this.add.y =
        Math.floor(this.imageList.length / this.colsValue) * this.viewWidth +
        "px";
      this.sortList();
    },
    nothing() {},
    rpx2px(v) {
      return (this.width * v) / 750;
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.pic-box {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;

  .example {
    width: 160rpx;
    height: 160rpx;
    margin-right: 16rpx;
  }

  .del-con {
    position: absolute;
    top: -10rpx;
    right: 10rpx;
    z-index: 999;

    .del-wrap {
      width: 28rpx;
      height: 28rpx;
      border-radius: 0 10rpx 0 5rpx;
      display: flex;
      justify-content: center;
      align-items: center;

      .del-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba($color: #000000, $alpha: 0.5);
  color: #fff;
  border-radius: 10rpx;
}

.screenshot {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #f4f5f6;
  border-radius: 4rpx;
  border: 2rpx solid #e5e7eb;
  padding: 24rpx 30rpx;
  box-sizing: border-box;

  .icon {
    margin-right: 24rpx;
  }

  .intro {
    display: flex;
    flex-direction: column;

    .text1 {
      font-weight: 400;
      font-size: 24rpx;
      color: #606060;
    }

    .text2 {
      font-weight: 400;
      font-size: 20rpx;
      color: #afafaf;
    }
  }
}

.con {
  width: 100%;
  flex: 1;
  padding: 8rpx 12rpx;
  background: #f4f5f6;
  box-sizing: border-box;
  border-radius: 4rpx;
  visibility: hidden;
  height: 0;

  &.active {
    visibility: visible;
    height: auto;
  }

  .area {
    width: 100%;

    .view {
      display: flex;
      justify-content: center;
      align-items: center;

      .area-con {
        position: relative;
        width: 108rpx;
        height: 84rpx;

        .pre-image {
          border-radius: 10rpx;
          width: 100%;
          height: 100%;
        }

        .del-con {
          position: absolute;
          top: -14rpx;
          right: -14rpx;

          .del-wrap {
            width: 28rpx;
            height: 28rpx;
            border-radius: 0 10rpx 0 5rpx;
            display: flex;
            justify-content: center;
            align-items: center;

            .del-image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .add {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;

      .add-wrap {
        width: 108rpx;
        height: 84rpx;
        display: flex;
        border-radius: 10rpx;
        justify-content: center;
        align-items: center;
        background-color: #e9e9e9;
      }
    }
  }
}
.canvas-poster {
  position: fixed;
  top: 100%;
  left: 100%;
  z-index: -1;
}
</style>
