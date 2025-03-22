import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import uviewPlus from "@/uni_modules/uview-plus";
import { createUnistorage } from "@/uni_modules/pinia-plugin-unistorage";
import App from "./App.vue";
import tools from "@/utils/tools";
import error from "@/utils/bugly/error";

export function createApp() {
  const app = createSSRApp(App);
  const store = Pinia.createPinia();

  // 持久化
  store.use(createUnistorage());
  app.use(error);
  app.use(store);
  app.use(uviewPlus);

  app.config.globalProperties.$TOOL = tools;

  return {
    app,
    Pinia,
  };
}
