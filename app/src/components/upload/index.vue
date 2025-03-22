<template>
  <view class="upload-wrapper">
    <!-- <view
      class="re-upload"
      :style="`width:${width};height:${height};`"
      @click="handleReUpload"
    >
    </view> -->

    <u-upload
      ref="uploadRef"
      :fileList="fileList1"
      name="6"
      :multiple="multiple"
      :maxCount="maxCount"
      :width="width"
      :height="height"
      :customStyle="customStyle"
      :deletable="deletable"
      :previewFullImage="previewFullImage"
      uploadText="上传头像"
      @after-read="afterRead"
      @delete="deletePic"
      @click="handleReUpload"
      @error="handleError"
    >
    </u-upload>
  </view>
  <ImageCropper
    mode="ratio"
    :imageUrl="imageUrl"
    :width="200"
    :height="200"
    :radius="500"
    :delay="300"
    @cancel="handleImageCropperCancel"
    @confirm="handleImageCropperConfirm"
  >
  </ImageCropper>

  <!-- <view @click="dddd">dddddd</view> -->
</template>
<script lang="ts" setup>
import { reactive, ref } from "vue";
import uploadFile from "@/components/iz-aloss-uploader/iz-uploader.js";
import ImageCropper from "@/uni_modules/image-cropper/components/cropper/cropper.vue";
import { getCosAuth } from "@/api/common";
// import permission from "@/utils/permission";
import { chooseImagePermission } from "@/utils/choose-file";
// import { useMainStore } from "@/stores/main";
// const mainStore = useMainStore();

const props = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [Number, String],
    default: "192rpx",
  },
  height: {
    type: [Number, String],
    default: "192rpx",
  },
  maxCount: {
    type: [Number, String],
    default: 1,
  },
  deletable: {
    type: Boolean,
    default: false,
  },
  previewFullImage: {
    type: Boolean,
    default: false,
  },
  imageList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  cropper: {
    type: Boolean,
    default: false,
  },
});
const ossAuthData = reactive({});
getCosAuth().then((res) => {
  // 获取oss信息
  Object.assign(ossAuthData, res);
});

const customStyle = reactive({
  //   height: props.height + "px",
  //   width: props.width + "px",
});

const fileList1 = ref([]);
// 删除图片
const deletePic = (event) => {
  fileList1.value.splice(event.index, 1);
};

const imageUrl = ref("");
const afterReadList = ref([]);
// 新增图片
const afterRead = async (event) => {
  // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  const lists = [].concat(event.file);

  if (!props.previewFullImage) {
    // 重新上传
    fileList1.value = [];
  }

  afterReadList.value = lists;
  if (props.cropper) {
    // 需要裁剪
    imageUrl.value = lists[0].url;
    return;
  }
  uploadFileList();
};

const uploadFileList = async () => {
  let fileListLen = fileList1.value.length;

  afterReadList.value.map((item) => {
    fileList1.value.push({
      ...item,
      status: "uploading",
      message: "上传中",
    });
  });

  for (let i = 0; i < afterReadList.value.length; i++) {
    const result = await uploadFilePromise(afterReadList.value[i].url);
    const item = fileList1.value[fileListLen];
    fileList1.value.splice(fileListLen, 1, {
      ...item,
      status: "success",
      message: "",
      url: result + "?x-oss-process=image/format,webp",
    });
    fileListLen++;
  }
  console.log("fileList1.value", fileList1.value);
};

const uploadFilePromise = (url) => {
  return new Promise((resolve, reject) => {
    uploadFile(
      ossAuthData,
      url,
      "png",
      (data) => {
        console.warn(
          "datadatadatadata",
          import.meta.env.VITE_APP_CDN_HOST + data
        );
        resolve(import.meta.env.VITE_APP_CDN_HOST + data);
      },
      (err) => {
        uni.$u.toast("上传失败,请稍后重试");
        console.warn("上传失败=>", err);
        reject(err);
      }
    );
    // resolve(1);
  });
};

const uploadRef = ref(null);
// 重新上传
const handleReUpload = async () => {
  if (fileList1.value.length) {
    uploadRef.value?.chooseFile();
  }
};
const handleError = async (err: any) => {
  console.error("handleError", err);
  const { code } = err;
  chooseImagePermission(code);
};
// const emit = defineEmits('result')
const getUploadResult = () => {
  const record = fileList1.value.some((item) => item.status !== "success");
  if (record) {
    return;
  }
  return fileList1.value;
};

const setImage = (url: string) => {
  fileList1.value = [
    {
      size: 25367,
      type: "image",
      url: url,
      thumb: "",
      status: "success",
      message: "",
    },
  ];
};

//
const handleImageCropperCancel = () => {
  imageUrl.value = "";
};
const handleImageCropperConfirm = (res) => {
  imageUrl.value = "";
  if (afterReadList.value && afterReadList.value.length > 0) {
    fileList1.value = [];
    afterReadList.value[0].url = res.tempFilePath;
    afterReadList.value[0].thumb = res.tempFilePath;
    uploadFileList();
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dddd = () => {
  // checkPermission();
  // permission.gotoAppPermissionSetting();
  permission.judgeIosPermission("camera");
};

defineExpose({
  getUploadResult,
  setImage,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkPermission = async () => {
  const system = uni.getSystemInfoSync();
  if (system.platform === "ios") {
    let result = false;
    const AVCaptureDevice = plus.ios.import("AVCaptureDevice");
    const authStatus = AVCaptureDevice.authorizationStatusForMediaType("vide");
    console.log("authStatus:" + authStatus);
    if (authStatus == 3 || authStatus == 0) {
      //authStatus == 0 时为初次打开相机  ios系统有默认授权弹窗
      result = true;
      return result;
    } else {
      uni.showModal({
        title: "提示",
        content: "请打开相机权限",
        success(res) {
          if (res.confirm) {
            const UIApplication = plus.ios.import("UIApplication");
            const application2 = UIApplication.sharedApplication();
            const NSURL2 = plus.ios.import("NSURL");
            const setting2 = NSURL2.URLWithString("app-settings:");
            application2.openURL(setting2);
            plus.ios.deleteObject(setting2);
            plus.ios.deleteObject(NSURL2);
            plus.ios.deleteObject(application2);
          }
        },
      });
    }
    plus.ios.deleteObject(AVCaptureDevice);
    return result;
  } else {
    plus.android.requestPermissions(
      ["android.permission.CAMERA"],
      (e) => {
        if (e.deniedAlways.length > 0) {
          //权限被永久拒绝
          // 弹出提示框解释为何需要权限，引导用户打开设置页面开启
          uni.showModal({
            title: "提示",
            content: "请打开手机相机功能（点击确定后在权限中授权相机功能）",
            // showCancel: false, // 不显示取消按钮
            success(res) {
              if (res.confirm) {
                const Intent = plus.android.importClass(
                  "android.content.Intent"
                );
                const Settings = plus.android.importClass(
                  "android.provider.Settings"
                );
                const Uri = plus.android.importClass("android.net.Uri");
                const mainActivity = plus.android.runtimeMainActivity();
                const intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                const uri = Uri.fromParts(
                  "package",
                  mainActivity.getPackageName(),
                  null
                );
                intent.setData(uri);
                mainActivity.startActivity(intent);
              }
            },
          });
        } else if (e.deniedPresent.length > 0) {
          //权限被临时拒绝
          // 弹出提示框解释为何需要权限，可再次调用plus.android.requestPermissions申请权限
          uni.showModal({
            title: "提示",
            content: "请打开手机相机功能（点击确定后在权限中授权相机功能）",
            // showCancel: false, // 不显示取消按钮
            success(res) {
              if (res.confirm) {
                const Intent = plus.android.importClass(
                  "android.content.Intent"
                );
                const Settings = plus.android.importClass(
                  "android.provider.Settings"
                );
                const Uri = plus.android.importClass("android.net.Uri");
                const mainActivity = plus.android.runtimeMainActivity();
                const intent = new Intent();
                intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                const uri = Uri.fromParts(
                  "package",
                  mainActivity.getPackageName(),
                  null
                );
                intent.setData(uri);
                mainActivity.startActivity(intent);
              }
            },
          });
        } else {
          console.log("已有权限！");
          return true;
        }
      },
      (e) => {
        // console.log(e);
        console.log("Request Permissions error:" + JSON.stringify(e));
        return true;
      }
    );
  }
};
</script>
<style lang="scss" scoped>
:deep(.u-upload__success__icon) {
  display: none !important;
}
.u-upload {
  border-radius: 50rpx !important;
  //   background: red;
}
.upload-wrapper {
  position: relative;
  .re-upload {
    position: absolute;
    border: 1rpx solid red;
  }
}
</style>
