const { Service } = require("egg");
const { appId, secret } = require("../../config/mini.config");
const { sign, successData, errorData, verify } = require("../utils");
const WXBizDataCrypt = require("../utils/WXBizDataCrypt");

class UserService extends Service {
  async login(code) {
    try {
      let user = null;
      // 首先判断是否存在这个token
      let token = this.ctx.get("Authorization");
      if (token) {
        let { id } = await verify(token);
        let res = await this.ctx.service.user.findUserById(id);
        if (res.code === 200 && res.data.sessionKeyTime >= Date.now()) {
          // 如果能查到说明这个用户存在的不过我们需要更新sessionKeyTime
          let sessionKeyTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
          let res = await this.updateUserInfo({
            sessionKeyTime,
          });
          if (res.code !== 200) {
            throw new Error(res.message);
          }
          user = res.data;
          user.sessionKeyTime = sessionKeyTime;
        }
      }
      if (!token || !user || user.sessionKeyTime < Date.now()) {
        let { res } = await this.app.curl(
          `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
          {
            dataType: "json",
            method: "GET",
          }
        );
        if (res.data.errcode) {
          return successData(200, null, "code失效");
        }
        let { session_key, openid } = res.data;
        // 根据openid查询是否存在这个注册的用户
        user = await this.ctx.model.User.findOne({ where: { openId: openid } });
        if (user) {
          await this.ctx.model.User.update(
            {
              sessionKeyTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
            },
            {
              where: {
                id: user.id,
              },
            }
          );
        } else {
          let userData = {
            openId: openid,
            sessionKeyTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
          };
          user = await this.ctx.model.User.create(userData);
        }
        // 自定义登录态token
        token = sign({
          session_key,
          openid,
          code,
          id: user.id,
        });
      }
      this.ctx.status = 200;
      return successData(200, token, "登陆成功");
    } catch (error) {
      this.ctx.status = 500;
      return errorData(500, error.message, "服务器异常");
    }
  }
  /**
   *
   * @param {*} id
   * 通过id查询用户信息
   */
  async findUserById(id) {
    try {
      let user = await this.ctx.model.User.findOne({
        where: { id },
        include: [{ model: this.ctx.model.Book, as: "books" }],
      });
      this.ctx.status = 200;
      if (user) {
        return successData(200, user, "查询成功");
      }
      return errorData(500, null, "查无此人");
    } catch (error) {
      console.log(error);
      this.ctx.status = 500;
      return errorData(500, error.message, "服务器异常");
    }
  }
  /**
   *
   * @param {*} user
   * 更新用户信息
   */
  async updateUserInfo({ encryptedData, iv, sessionKeyTime }) {
    try {
      let user = null;
      let token = this.ctx.get("Authorization");
      let { session_key, id } = await verify(token);
      if (sessionKeyTime) {
        user = await this.ctx.model.User.update(
          {
            sessionKeyTime,
          },
          {
            where: {
              id,
            },
          }
        );
      } else {
        var pc = new WXBizDataCrypt(appId, session_key);

        const userData = pc.decryptData(encryptedData, iv);
        userData.sessionKeyTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        userData.timestamp = userData.watermark.timestamp;
        delete userData.watermark;
        user = await this.ctx.model.User.update(
          {
            ...userData,
          },
          {
            where: {
              id,
            },
          }
        );
      }
      this.ctx.status = 200;
      if (user) {
        return {
          code: 200,
          data: user,
          message: "更新成功",
        };
      }
      return errorData(500, null, "服务器异常");
    } catch (error) {
      this.ctx.status = 500;
      console.log(error);
      return errorData(500, error.message, "服务器异常");
    }
  }
}
module.exports = UserService;
