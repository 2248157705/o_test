import permission from "@/utils/permission";
import { useMainStore } from "@/stores/main";

export const chooseImagePermission = async (code: number) => {
  const mainStore = useMainStore();
  console.warn("code", code);
  if (code === 11) {
    // 相机没有权限
    const check = await permission.checkCameraPermission();
    if (!check) {
      mainStore.setPermissionPopup({
        visible: true,
        text: "请打开手机相机功能（点击确定后在权限中授权相机功能）",
      });
    }
  }
  if (code === 12) {
    // 相册没有权限
    const check = await permission.checkPhotoLibraryPermission();
    if (!check) {
      mainStore.setPermissionPopup({
        visible: true,
        text: "请打开手机相册功能（点击确定后在权限中授权相册功能）",
      });
    }
  }
};
