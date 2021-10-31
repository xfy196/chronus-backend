// app/controller/users.js
const Controller = require("egg").Controller;
class UserController extends Controller {
  // 用户授权
  async login() {
    const { code} = this.ctx.request.body;
    let res = await this.service.user.login(code);
    this.ctx.body = res;
  }
  // 保存用户信息
  async create() {
  }
  async update() {
    const {encryptedData, iv } = this.ctx.request.body
    let res = await this.ctx.service.user.updateUserInfo({encryptedData, iv });
    this.ctx.body = res;
  }
  async show() {
    let res = await this.ctx.service.user.findUserById(this.ctx.params.id);
    this.ctx.body = res;
  }
  async getUserInfo(){
    let res = await this.ctx.service.user.findUserById(this.ctx.session.user.id)
    this.ctx.body = res
  }
}

module.exports = UserController;
