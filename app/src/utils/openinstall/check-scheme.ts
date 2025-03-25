import { reactive } from "vue";
import { getCurPage, checkIsBarPage } from "@/utils/login";

export function SchemeUtils() {
  const schemeData = reactive({
    prevPage: null,
  });

  /**
   * 获取scheme url;
   * @returns string
   */
  const getSchemeUrl = () => {
    const args = plus.runtime?.arguments;
    // console.log("args---", args);
    if (!args) {
      return null;
    }
    const scheme = args.split("//")[1];
    const flag = checkIsBarPage(scheme);
    // uni.log.info("checkScheme", args, scheme, flag, schemeData);
    if (flag) {
      // 判断如果scheme url 跟上一次一样时，不跳转
      if (scheme === schemeData.prevPage) {
        return null;
      }
      schemeData.prevPage = scheme;
      return scheme;
    }
    return null;
  };

  /**
   * 获取剪切板数据
   * @returns string
   */
  const getClipboardData = () => {
    return new Promise((resolve) => {
      uni.getClipboardData({
        success: function (res) {
          // uni.log.info("getClipboardData", res.data);
          if (res.data && checkIsBarPage(res.data)) {
            resolve(res.data);
          } else {
            resolve(null);
          }
        },
        fail: function () {
          resolve(null);
        },
      });
    });
  };

  /**
   * 检查scheme地址
   * @returns string
   */
  const checkSchemePage = async () => {
    const clipboardPage = await getClipboardData();
    const schemePage = getSchemeUrl();
    const page = clipboardPage || schemePage;
    uni.log.info("checkSchemePage", page, clipboardPage, schemePage);
    if (page) {
      navigateTo(page);
    }
  };

  /**
   * 跳转到目标页
   * @returns string
   */
  const navigateTo = (fullPage: string) => {
    const curFullPath = getCurPage();
    const page = fullPage.split("?")[0];
    const curPage = curFullPath.split("?")[0];
    uni.log.info("navigateTo", fullPage, curFullPath, page, curPage);
    if (curPage !== page) {
      const flag = checkIsBarPage(page);

      const fail = () => {
        uni.log.info(`scheme page ${fullPage} navigate failed`);
      };
      const success = () => {
        uni.setClipboardData({
          data: "",
          showToast: false,
        });
      };

      if (flag) {
        uni.switchTab({
          url: `/${fullPage}`,
          success,
          fail,
        });
      } else {
        uni.navigateTo({
          url: `/${fullPage}`,
          success,
          fail,
        });
      }
    }
  };

  /**
   * 监听剪切板数据
   * @returns string
   */
  const onClipboardData = () => {
    checkSchemePage();
  };

  return {
    onClipboardData,
  };
}
