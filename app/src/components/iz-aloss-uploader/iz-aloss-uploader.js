// const env = require('./config.js');
import env from './config.js';
// import moment from './moment.js'
import dayjs from 'dayjs';
import base64 from './base64.js';
// const base64 = require('./base64.js');
import './hmac.js'
import './sha1.js'
// const Crypto = require('./crypto.js');
import Crypto from './crypto.js';


/*
 *上传文件到阿里云oss
 *@param - filePath :文件的本地资源路径
  @param - path :上传oss哪个路径下
  postfix : 文件后缀
 *@param - successc:成功回调
 *@param - failc:失败回调
 */
export default function (ossAuthData, filePath, fix, successc, failc) {
  const time = dayjs().format("YYYY-MM-DD")
  const path = import.meta.env.MODE == 'development' ? `taogehao/test/${time}` : `taogehao/prod/${time}`;
  fix = fix.replace('.', '')
  if (!filePath || filePath.length < 9) {
    wx.showModal({
      title: '文件错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  if (!fix) {
    fix = ''
  }

  //存放文件命名格式：自定义时间戳给文件名字(可以自己改)
  const aliyunFileKey = path + '/' + new Date().getTime() + parseInt(Math.random() * (9999 - 1000 + 1) + 1000, 10) + '.' + fix.replace('.', '');
  const aliyunServerURL = import.meta.env.VITE_APP_UPLOAD_HOST; //OSS地址，https
  // const accessid = ossAuthData.access_key_id;
  const accessid = ossAuthData.access_key_id;
  const securityToken = ossAuthData.security_token;
  let policyBase64 = getPolicyBase64();
  let signature = getSignature(policyBase64, ossAuthData.access_key_secret);
  return uni.uploadFile({
    url: aliyunServerURL, //开发者服务器 url
    filePath: filePath, //要上传文件资源的路径
    name: 'file', //必须填file
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200',
      'x-oss-security-token': securityToken
    },
    success: function (res) {
      if (res.statusCode != 200) {
        failc(new Error('上传错误:' + JSON.stringify(res)))
        return;
      }
      console.log(res, ' res')
      successc(aliyunFileKey);
    },
    fail: function (err) {
      err.wxaddinfo = aliyunServerURL;
      failc(err);
    },
  })
}

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + env.timeout);
  let srcT = date.toISOString();
  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 
    "conditions": [
      ["content-length-range", 0, env.maxSize] // 设置上传文件的大小限制,5mb
    ]
  };

  const policyBase64 = base64.encode(JSON.stringify(policyText));
  return policyBase64;
}


function izArrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  let signature = base64.encode(binary)
  return signature
}


const getSignature = function (policyBase64, AccessKeySecret) {
  const accesskey = AccessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = izArrayBufferToBase64(bytes)
  return signature;
}


