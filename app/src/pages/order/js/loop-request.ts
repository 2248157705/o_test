const config = {
  maxCount: 10,
  times: 3000,
  startTask: true,
  fail: () => {},
  success: () => {},
  check: () => {
    return false;
  },
  close: () => {},
};

let curCount = 1;
let timer = null;

export const loopRequest = (opts = {}) => {
  if (!opts.fail) {
    uni.log.error("opts.fail is required");
    return;
  }
  if (!opts.success) {
    uni.log.error("opts.success is required");
    return;
  }
  if (!opts.check) {
    uni.log.error("opts.check is required");
    return;
  }
  config.startTask = true;
  Object.assign(config, opts);
  timer && clearTimeout(timer);
  curCount = 1;
  uni.$u.sleep(2000).then(() => {
    if (config.startTask) {
      checkStatus();
    }
  });
};

const checkStatus = async () => {
  if (!config.startTask) {
    clearTimeout(timer);
    timer = null;
    config.close();
    return;
  }
  const flag = await config.check();
  uni.log.info("flag", flag);
  if (flag) {
    clearTimeout(timer);
    timer = null;
    config.success();
  } else if (!flag && curCount >= config.maxCount) {
    config.fail();
  } else {
    timer = setTimeout(() => {
      checkStatus();
    }, config.times);
  }
  curCount = curCount + 1;
};

export const closeLoopRequest = () => {
  clearTimeout(timer);
  config.startTask = false;
};
