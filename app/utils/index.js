const jwt = require("jsonwebtoken");
const { secret } = require("../../config/mini.config");
// 加密
exports.sign = (obj) => {
  return jwt.sign(obj, secret);
};
// 解密
exports.verify = (token) => {
  return new Promise((reslove, reject) => {
    jwt.verify(token, secret, (error, payload) => {
      if (error) {
        reject(error);
      } else {
        reslove(payload);
      }
    });
  });
};

exports.successData = (code=200, data=null, message="请求成功") => {
    return {
        code,
        data,
        message
    }
}
exports.errorData = (code=500, data=null, message="请求失败") => {
    return {
        code,
        data,
        message
    }
}