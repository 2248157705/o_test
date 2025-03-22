import { reactive } from "vue";
import dayjs from "dayjs";
import { useCommonStore } from "@/stores/common";
import {
  debuggerModule,
  installDebugger,
} from "@/uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern";

export const errorHandler = (err, vm, info) => {
  debuggerModule.addVueError(err, vm, info);
  // const commonStore = useCommonStore();
  // if (debuggerModule && commonStore.openDebugger) {
  //   debuggerModule.addVueError(err, vm, info);
  // }
};

export const initDebugger = () => {
  const commonStore = useCommonStore();
  if (installDebugger && commonStore.openDebugger) {
    installDebugger({
      enableRequestInterceptor: true, //默认为false，指示是否拦截网络请求，参见下一条
      showGlobalFloatWindow: false, //默认为true，指定是否添加一个全局的调试按钮，点击可跳转至窗口
    });
  }
};

export const addLog = ({ type, objects }) => {
  const commonStore = useCommonStore();
  if (debuggerModule && commonStore.openDebugger) {
    debuggerModule.addLog({
      time: dayjs().format("HH:MM:ss"),
      type: type,
      objects: getResolve(objects),
    });
  }
};

const getResolve = (arr) => {
  return arr.map((el) => {
    const type = typeof el;
    if (type === "object") {
      return JSON.stringify(el);
    } else {
      return el;
    }
  });
};

export function DebugUtil() {
  const debugData = reactive({
    show: false,
  });

  const open = () => {
    debugData.show = true;
  };

  const close = () => {
    debugData.show = false;
  };

  return {
    debugData,
    open,
    close,
  };
}
