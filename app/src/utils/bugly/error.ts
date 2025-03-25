import { errorHandler } from "@/utils/debug";
import { reportError } from "@/utils/bugly/index";
import { reportErrorEvent } from "@/utils/report/report";
import { useReportStore } from "@/stores/report/index";
import { encodeBase64 } from "@/utils/index";

export default {
  install: (app) => {
    app.config.errorHandler = (err, vm, info) => {
      console.error(err, vm, info);
      const reportStore = useReportStore();
      //   console.log("handlerError---------", err, vm, info);
      errorHandler(err, vm, info);
      reportError({
        errorMsg: err.toString(),
        errorType: "error",
        stack: err.stack + "\n" + info,
        extraInfo: {
          device_info: reportStore.deviceInfo,
          common: reportStore.userData,
        },
      });
      reportErrorEvent({
        errorMsg: encodeBase64(err),
        errorType: "error",
        stack: encodeBase64(err.stack + "\n" + info),
      });
    };

    app.config.warnHandler = (err, vm, info) => {
      console.warn(err, vm, info);
      //   console.log("warnHandler---------", err, vm, info);
      const reportStore = useReportStore();
      reportError({
        errorMsg: err.toString(),
        errorType: "warn",
        stack: err.stack + "\n" + info,
        extraInfo: {
          device_info: reportStore.deviceInfo,
          common: reportStore.userData,
        },
      });
    };
  },
};
