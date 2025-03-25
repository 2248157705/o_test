import { getInstall } from "@/utils/openinstall/openinstall";
import { getCurPage, checkIsBarPage } from "@/utils/login";

interface UrlParamsProps {
  campaign_id: string;
  channel?: string;
  path?: string;
  apk?: string;
}

let prevPage = null;
/**
 * 检测openinstall传参是否有path,如果有就跳转到对应的页面
 * @returns
 */
export async function checkOpenInstallPath() {
  // 获取安装信息
  const installData = await getInstall(8);
  uni.log.info("checkOpenInstallPath installData", installData);
  if (installData?.bindData) {
    const jsonData: UrlParamsProps = JSON.parse(installData?.bindData);
    // const jsonData = {
    //   path: "pages/my/index",
    // };
    if (jsonData?.path) {
      const path = decodeURIComponent(jsonData?.path);
      const pid = path.split("?")[0];
      const curPath = getCurPage();
      const flag = checkIsBarPage(pid);

      // uni.log.info(path, pid, prevPage, curPath, flag);
      // 判断是否是当前页面或已跳转过
      if ((curPath && curPath.includes(pid)) || prevPage === path) {
        return;
      }

      prevPage = path;

      const fail = () => {
        uni.log.info(`scheme page ${path} navigate failed`);
      };

      const success = () => {};

      if (flag) {
        return uni.switchTab({
          url: `/${path}`,
          success,
          fail,
        });
      }
      uni.navigateTo({
        url: `/${path}`,
        success,
        fail,
      });
    }
  }
}
