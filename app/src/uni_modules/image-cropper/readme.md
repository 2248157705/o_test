# t-cropper

> **t-cropper  一款高性能移动端图片裁剪工具**

## 平台兼容

| App   |   H5   |   微信小程序 |   支付宝小程序 |
| :---: | :---:  | :----------: | :-----------: |
|  √    |     √  |      √       |      √        |

### 属性说明

|属性         |类型     |默认     |备注      |
| :--------: | :-----: | :----:  | :----:  |
| mode       |String   | "ratio"  | 裁剪模式|
| imageUrl   |String   |   " "    | 需要裁剪的图片路径|
| width      |Number   | 200     | 图片裁剪后的宽度，固定大小时有效|
| height     |Number   | 200     | 图片裁剪后的高度，固定大小时有效|
| maxWidth   |Number   | 1024    | 图片裁剪后的最大宽度 |
| maxHeight  |Number   | 1024    | 图片裁剪后的最大高度 |
| scaleRatio |Number   | 0.7    | 裁剪比列缩放,建议不超过0.95 |
| minRatio  |Number   | 1    | 最小缩放 |
| maxRatio  |Number   | 3    | 最大缩放 |
| radius  |Number   | 0    | 裁剪图片圆角半径，单位px |
| delay   |Number   | 250    | 确定按钮快速重复点击时间 |
| isRotateBtn  |Boolean   | true    | 是否显示旋转按钮 |
| isCutSize  |Boolean   | true    | 是否导出高清裁剪原图(h5) |

### mode有效值

| 模式     |值       |说明   |
| :-----: | :-----: | :----: |
| 固定模式 |fixed    | 裁剪出指定大小的图片，一般用于头像上传    |
| 等比缩放 |ratio    | 限定宽高比，裁剪大小不固定  |
| 自由模式 |free     | 不限定宽高比，裁剪大小不固定  |

### 事件说明

|事件名称     |说明     |返回     |
| :--------: | :-----: | :----:  |
| confirm        |点击确定按钮    |   object    |
| cancel      |点击取消按钮  | -  |

### 示例

```html
<template>
  <view>
    <tt-cropper
      mode="ratio"
      :imageUrl="model.imageUrl"
      :width="500"
      :height="500"
      :radius="90"
      :delay="300"
      @cancel="onCancel"
      @confirm="onConfirm"
    ></tt-cropper>
    <view class="preview">
      <image
        v-for="(item, index) in model.resultUrl"
        :key="item.id"
        class="images"
        @click="prviewImgae(index, item.url)"
        :src="item.url"
      />
    </view>
    <button class="button" type="primary" @click="selectFile">选择图片</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      model: {
        imageUrl: "",
        resultUrl: [],
      },
    };
  },
  methods: {
    // 选择图片
    selectFile() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.model.imageUrl = res.tempFilePaths[0];
        },
      });
    },
    // 关闭
    onCancel() {
      this.model.imageUrl = "";
    },
    // 确定裁剪
    onConfirm(res) {
      const params = {
        id: new Date().getTime(),
        url: res.tempFilePath,
      };
      this.model.resultUrl.push(params);
      this.model.imageUrl = "";
    },
    // 预览图片
    prviewImgae(index, url) {
      uni.previewImage({
        current: index, // 当前资源下标
        urls: [url],
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.preview {
  padding: 32rpx;

  .images {
    margin: 10rpx;
    width: 200rpx;
    height: 200rpx;
  }
}
.button {
  margin: 0 20rpx;
}
</style>


```

### 注意

1.uni-app版本不断更新，插件有时无法适应新版本，感谢大家及时提交bug，但希望大家手下留情，不要轻易给差评！
