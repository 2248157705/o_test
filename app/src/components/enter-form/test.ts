// 校验规则

//手机号校验
export function mobileAddSpaceLogin(mobile) {
  mobile = spaceStrChangeMobile(mobile);
  var myRe =
      /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    isNum = myRe.test(mobile),
    newMobile = "";
  if (isNum) {
    if (mobile)
      for (var i = 1; i <= mobile.length; i++)
        newMobile += i % 4 === 0 ? " " + mobile[i - 1] : mobile[i - 1];
  } else {
    return false;
  }
  return newMobile;
}

// 截图
export function checkImageLength(image) {
  return image?.length >= 3;
}

// 价格校验
export function verifyPrice(price) {
  const env = import.meta.env.VITE_APP_ENV;
  if (env == "test") return true;
  else return price >= 50 && price <= 999999 && /^\d+(\.\d{1,2})?$/.test(price);
}

//去手机空格
function spaceStrChangeMobile(str) {
  return (str += ""), (str = str.replace(/\ +/g, ""));
}

//金额转换(格式：XXXX.XXXX.00)
export function formatMoney(num) {
  return (num.toFixed(2) + "").replace(/\d{1,4}(?=(\d{4})+(\.\d*)?$)/g, "$&,");
}

// 密码校验 js 正则---验证密码为6-16位数字与字母组合方法
export function checkPwd(val) {
  if (/^\d*$/.test(val)) return false;
  return /^[a-zA-Z0-9_]{6,16}$/.test(val);
}

// 判断字符串是否为空
// 判断字符串长度
export function totalWord(str = "") {
  return str
    .replace(/[\u0021-\u007E]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) + 0xff01 - 0x21);
    })
    .replace(/ /g, "\u3000").length;
}
