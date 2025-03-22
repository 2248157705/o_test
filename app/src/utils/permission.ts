/**
 * 本模块封装了Android、iOS的应用权限判断、打开应用权限设置界面、以及位置系统服务是否开启
 * https://ext.dcloud.net.cn/plugin?id=594
 */

const isIos = plus.os.name == "iOS";

// 判断推送权限是否开启
function judgeIosPermissionPush() {
  let result = false;
  const UIApplication = plus.ios.import("UIApplication");
  const app = UIApplication.sharedApplication();
  let enabledTypes = 0;
  if (app.currentUserNotificationSettings) {
    const settings = app.currentUserNotificationSettings();
    enabledTypes = settings.plusGetAttribute("types");
    uni.log.info("enabledTypes1:" + enabledTypes);
    if (enabledTypes == 0) {
      uni.log.info("推送权限没有开启");
    } else {
      result = true;
      uni.log.info("已经开启推送功能!");
    }
    plus.ios.deleteObject(settings);
  } else {
    enabledTypes = app.enabledRemoteNotificationTypes();
    if (enabledTypes == 0) {
      uni.log.info("推送权限没有开启!");
    } else {
      result = true;
      uni.log.info("已经开启推送功能!");
    }
    uni.log.info("enabledTypes2:" + enabledTypes);
  }
  plus.ios.deleteObject(app);
  plus.ios.deleteObject(UIApplication);
  return result;
}

// 判断定位权限是否开启
function judgeIosPermissionLocation() {
  let result = false;
  const cllocationManger = plus.ios.import("CLLocationManager");
  const status = cllocationManger.authorizationStatus();
  result = status != 2;
  uni.log.info("定位权限开启：" + result);
  // 以下代码判断了手机设备的定位是否关闭，推荐另行使用方法 checkSystemEnableLocation
  /* var enable = cllocationManger.locationServicesEnabled();
	  var status = cllocationManger.authorizationStatus();
	  uni.log.info("enable:" + enable);
	  uni.log.info("status:" + status);
	  if (enable && status != 2) {
		  result = true;
		  uni.log.info("手机定位服务已开启且已授予定位权限");
	  } else {
		  uni.log.info("手机系统的定位没有打开或未给予定位权限");
	  } */
  plus.ios.deleteObject(cllocationManger);
  return result;
}

// 判断麦克风权限是否开启
function judgeIosPermissionRecord() {
  let result = false;
  const avaudiosession = plus.ios.import("AVAudioSession");
  const avaudio = avaudiosession.sharedInstance();
  const permissionStatus = avaudio.recordPermission();
  uni.log.info("permissionStatus:" + permissionStatus);
  if (permissionStatus == 1684369017 || permissionStatus == 1970168948) {
    uni.log.info("麦克风权限没有开启");
  } else {
    result = true;
    uni.log.info("麦克风权限已经开启");
  }
  plus.ios.deleteObject(avaudiosession);
  return result;
}

// 判断相机权限是否开启
function judgeIosPermissionCamera() {
  let result = false;
  const AVCaptureDevice = plus.ios.import("AVCaptureDevice");
  const authStatus = AVCaptureDevice.authorizationStatusForMediaType("vide");

  uni.log.info("authStatus:" + authStatus);
  if (authStatus == 3) {
    result = true;
    uni.log.info("相机权限已经开启");
  } else {
    uni.log.info("相机权限没有开启");
  }
  plus.ios.deleteObject(AVCaptureDevice);
  return result;
}

// 判断相册权限是否开启
function judgeIosPermissionPhotoLibrary() {
  let result = false;
  const PHPhotoLibrary = plus.ios.import("PHPhotoLibrary");
  const authStatus = PHPhotoLibrary.authorizationStatus();
  uni.log.info("authStatus:" + authStatus);
  if (authStatus == 3) {
    result = true;
    uni.log.info("相册权限已经开启");
  } else {
    uni.log.info("相册权限没有开启");
  }
  plus.ios.deleteObject(PHPhotoLibrary);
  return result;
}

// 判断通讯录权限是否开启
function judgeIosPermissionContact() {
  let result = false;
  const CNContactStore = plus.ios.import("CNContactStore");
  const cnAuthStatus = CNContactStore.authorizationStatusForEntityType(0);
  if (cnAuthStatus == 3) {
    result = true;
    uni.log.info("通讯录权限已经开启");
  } else {
    uni.log.info("通讯录权限没有开启");
  }
  plus.ios.deleteObject(CNContactStore);
  return result;
}

// 判断日历权限是否开启
function judgeIosPermissionCalendar() {
  let result = false;
  const EKEventStore = plus.ios.import("EKEventStore");
  const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(0);
  if (ekAuthStatus == 3) {
    result = true;
    uni.log.info("日历权限已经开启");
  } else {
    uni.log.info("日历权限没有开启");
  }
  plus.ios.deleteObject(EKEventStore);
  return result;
}

// 判断备忘录权限是否开启
function judgeIosPermissionMemo() {
  let result = false;
  const EKEventStore = plus.ios.import("EKEventStore");
  const ekAuthStatus = EKEventStore.authorizationStatusForEntityType(1);
  if (ekAuthStatus == 3) {
    result = true;
    uni.log.info("备忘录权限已经开启");
  } else {
    uni.log.info("备忘录权限没有开启");
  }
  plus.ios.deleteObject(EKEventStore);
  return result;
}

// Android权限查询
function requestAndroidPermission(permissionID) {
  return new Promise((resolve) => {
    console.warn("permissionID", permissionID);
    plus.android.requestPermissions(
      [permissionID], // 理论上支持多个权限同时查询，但实际上本函数封装只处理了一个权限的情况。有需要的可自行扩展封装
      function (resultObj) {
        console.warn("resultObj", resultObj);
        let result = 0;
        for (let i = 0; i < resultObj.granted.length; i++) {
          const grantedPermission = resultObj.granted[i];
          uni.log.info("已获取的权限：" + grantedPermission);
          result = 1;
        }
        for (let i = 0; i < resultObj.deniedPresent.length; i++) {
          const deniedPresentPermission = resultObj.deniedPresent[i];
          uni.log.info("拒绝本次申请的权限：" + deniedPresentPermission);
          result = 0;
        }
        for (let i = 0; i < resultObj.deniedAlways.length; i++) {
          const deniedAlwaysPermission = resultObj.deniedAlways[i];
          uni.log.info("永久拒绝申请的权限：" + deniedAlwaysPermission);
          result = -1;
        }
        resolve(result);
        // 若所需权限被拒绝,则打开APP设置界面,可以在APP设置界面打开相应权限
        // if (result != 1) {
        // gotoAppPermissionSetting()
        // }
      },
      function (error) {
        uni.log.info("申请权限错误：" + error.code + " = " + error.message);
        resolve({
          code: error.code,
          message: error.message,
        });
      }
    );
  });
}

// 使用一个方法，根据参数判断权限
function judgeIosPermission(permissionID) {
  if (permissionID == "location") {
    return judgeIosPermissionLocation();
  } else if (permissionID == "camera") {
    return judgeIosPermissionCamera();
  } else if (permissionID == "photoLibrary") {
    return judgeIosPermissionPhotoLibrary();
  } else if (permissionID == "record") {
    return judgeIosPermissionRecord();
  } else if (permissionID == "push") {
    return judgeIosPermissionPush();
  } else if (permissionID == "contact") {
    return judgeIosPermissionContact();
  } else if (permissionID == "calendar") {
    return judgeIosPermissionCalendar();
  } else if (permissionID == "memo") {
    return judgeIosPermissionMemo();
  }
  return false;
}

// 跳转到**应用**的权限页面
function gotoAppPermissionSetting() {
  if (isIos) {
    const UIApplication = plus.ios.import("UIApplication");
    const application2 = UIApplication.sharedApplication();
    const NSURL2 = plus.ios.import("NSURL");
    // var setting2 = NSURL2.URLWithString("prefs:root=LOCATION_SERVICES");
    const setting2 = NSURL2.URLWithString("app-settings:");
    application2.openURL(setting2);

    plus.ios.deleteObject(setting2);
    plus.ios.deleteObject(NSURL2);
    plus.ios.deleteObject(application2);
  } else {
    // uni.log.info(plus.device.vendor);
    const Intent = plus.android.importClass("android.content.Intent");
    const Settings = plus.android.importClass("android.provider.Settings");
    const Uri = plus.android.importClass("android.net.Uri");
    const mainActivity = plus.android.runtimeMainActivity();
    const intent = new Intent();
    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
    const uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
    intent.setData(uri);
    mainActivity.startActivity(intent);
  }
}

// 检查系统的设备服务是否开启
// var checkSystemEnableLocation = async function () {
function checkSystemEnableLocation() {
  if (isIos) {
    let result = false;
    const cllocationManger = plus.ios.import("CLLocationManager");
    result = cllocationManger.locationServicesEnabled();
    uni.log.info("系统定位开启:" + result);
    plus.ios.deleteObject(cllocationManger);
    return result;
  } else {
    const context = plus.android.importClass("android.content.Context");
    const locationManager = plus.android.importClass(
      "android.location.LocationManager"
    );
    const main = plus.android.runtimeMainActivity();
    const mainSvr = main.getSystemService(context.LOCATION_SERVICE);
    const result = mainSvr.isProviderEnabled(locationManager.GPS_PROVIDER);
    uni.log.info("系统定位开启:" + result);
    return result;
  }
}

// 检查相机权限
async function checkCameraPermission() {
  if (isIos) {
    return judgeIosPermission("camera");
  } else {
    const check = await requestAndroidPermission("android.permission.CAMERA");
    console.log("requestAndroidPermission(permissionID)", check);
    return check === -1 ? false : true;
  }
}
// 检查相册权限
async function checkPhotoLibraryPermission() {
  if (isIos) {
    return judgeIosPermission("camera");
  } else {
    const check = await requestAndroidPermission(
      "android.permission.READ_EXTERNAL_STORAGE"
    );
    console.log("android.permission.READ_EXTERNAL_STORAGE", check);
    return check === -1 ? false : true;
  }
}

export default {
  judgeIosPermission: judgeIosPermission,
  requestAndroidPermission: requestAndroidPermission,
  checkSystemEnableLocation: checkSystemEnableLocation,
  gotoAppPermissionSetting: gotoAppPermissionSetting,
  checkCameraPermission: checkCameraPermission,
  checkPhotoLibraryPermission: checkPhotoLibraryPermission,
};
