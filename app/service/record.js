const { Service } = require("egg");
const { successData, errorData } = require("../utils");
class RecordService extends Service {
  /**
   *
   * @param {*} id
   * 通过id查询记录信息
   */
  async findReocrdById(id) {
    try {
      let record = await this.ctx.model.Record.findOne({ where: { id } });
      this.ctx.status = 200;
      successData(200, record, record ? "查询成功" : "查无此人");
    } catch (error) {
      this.ctx.status = 500;
      errorData(500, error.message, "服务器错误");
    }
  }
  /**
   * 获取所有的记录数据通过书的id
   */
  async getRecordsByBId(pageSize = 10, pageIndex = 1, noPage = false, b_id) {
    try {
      let records = null;
      let book = null
      if (noPage) {
        book = this.ctx.model.Book.findOne({
          where: {
            id: b_id
          }
        })
        records = await this.ctx.model.Record.findAll({ where: { b_id } });
      } else {
        records = await this.ctx.model.Record.findAll({
          where: { b_id },
          limit: pageSize,
          pageIndex: (pageIndex - 1) * pageSize,
        });
      }
      this.ctx.status = 200
      return successData(
        records ? 200 : 500,
        records,
        records ? "查询成功" : "查询失败"
      );
    } catch (error) {
        this.ctx.status = 500
        errorData(500, error.message, "服务器错误")
    }
  }
  // 获取当前用户的总读书记录
  async getRecordTotal(){
    try {
      let res = await this.service.book.getBooks(1, 10, true)
      let books = res.data
      let total = 0;
      for(let i = 0; i < books.length; i++){
        total += books[i].dataValues.totalTime
      }
      this.ctx.status = 200
      return successData(200, total, "查询成功")
    } catch (error) {
      this.ctx.status = 500
      errorData(500, error.message, "服务器错误")
    }
  }
}
module.exports = RecordService;
