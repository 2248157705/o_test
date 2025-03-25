import xss from "xss"; // 导入xss包
const options = {
  // 白名单
  whiteList: {
    view: ["style"],
    div: ["style"],
    text: ["style"],
    a: ["style", "href", "title", "target"],
    p: ["style"],
    br: ["style"],
    style: ["style"], //新添
  },
  // 去掉不在白名单上的标签
  stripIgnoreTag: true,
  // 去掉HTML备注
  allowCommentTag: false,
  // 彻底去除script标签
  stripIgnoreTagBody: ["script", "noscript"],
};
const myxss = new xss.FilterXSS(options);
export default myxss;
