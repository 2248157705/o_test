import { isArray, isNull, isUndefined, isString, isBoolean } from "lodash-es";
import md5 from "./md5";

/**
 * 执行签名
 *
 * @param {object} params
 * @param {string} secretKey
 * @returns
 */
export const getRequestSign = (params = {}, secretKey = "") => {
  const newkey = Object.keys(params).sort();
  //创建一个新的对象，用于存放排好序的键值对
  let str = "";
  const noSignKeys = [
    "sign",
    "content",
    "info",
    "s",
    "device_info",
    "launch_option",
  ]; // 不参与签名
  for (let i = 0; i < newkey.length; i++) {
    const key = newkey[i];
    let value = params[key];
    if (isString(value)) {
      value = value.trim();
    }
    if (
      value !== "" &&
      !isBoolean(value) &&
      !isNull(value) &&
      !isUndefined(value) &&
      !isArray(value) &&
      !noSignKeys.includes(key)
    ) {
      str += key + "=" + value + "&";
    }
  }
  str = str + secretKey;
  // console.log("sign str", str);
  const encrypt = new md5();
  return encrypt.hex_md5(str);
};
