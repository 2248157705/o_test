import { addLog } from "@/utils/debug";

const log = {
  info: (...arg) => {
    addLog({
      type: "log",
      objects: arg,
    });
    console.log(...arg);
  },
  error: (...arg) => {
    addLog({
      type: "error",
      objects: arg,
    });

    console.error(...arg);
  },
  warn: (...arg) => {
    addLog({
      type: "warn",
      objects: arg,
    });
    console.warn(...arg);
  },
};

export default log;
