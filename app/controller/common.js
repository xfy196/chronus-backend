const {Controller} = require("egg")
class CommonController extends Controller {
    async getConfig(){
        this.ctx.body = {
            code: 200,
            msg: "查询成功",
            env: {
                NODE_ENV: process.env.NODE_ENV,
                TEST: process.env.TEST
            }
        }
    }
}
module.exports = CommonController