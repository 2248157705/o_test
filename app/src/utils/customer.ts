import { useUserStore } from "@/stores/user";

export function toCustomerService() {
  const userStore = useUserStore();
  if (userStore.userInfo?.uid) {
    const title = "客服中心";
    const url = `https://kefu.whxiaoli.top/?uid=${userStore.userInfo?.uid}&groupid=484345593&app=淘个号`;
    uni.navigateTo({
      url: `/pages/web-view/index?url=${url}&title=${title}`,
    });
  } else {
    uni.$main.toast("进入客服中心失败");
  }
}
