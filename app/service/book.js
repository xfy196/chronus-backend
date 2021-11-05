const { Service } = require("egg");
const user = require("../model/user");
const { successData, errorData } = require("../utils");

class BookService extends Service {
  /**
   *
   * @param {*} limit
   * @param {*} offset
   * 分页请求数据
   */
  async getBooks(pageSize = 10, pageIndex = 1, noPage = false) {
    try {
      let user = this.ctx.session.user;
      let res = null;
      let pAll = [];
      if (noPage) {
        res = await this.ctx.model.Book.findAll({ where: { u_id: user.id } });
        for (let i = 0; i < res.length; i++) {
          res[i].dataValues.totalTime = 0;
          let r = await this.ctx.model.Record.findAll({
            where: { b_id: res[i].id },
          });
          if (r) {
            r.forEach((item) => {
              res[i].dataValues.totalTime += item.time;
            });
          }
        }
      } else {
        res = await this.ctx.model.Book.findAll({
          where: { u_id: user.id },
          limit: pageSize,
          offset: (pageIndex - 1) * pageSize,
        });
      }
      return successData(res ? 200 : 500, res, res ? "查询成功" : "查询失败");
    } catch (error) {
      return errorData(500, error.message, "服务器异常");
    }
  }
  /**
   *
   * @param {*} book
   * 添加新的书籍
   */
  async addBook(book) {
    try {
      let user = this.ctx.session.user;
      let res = await this.ctx.model.Book.create({
        ...book,
        u_id: user.id,
      });
      return successData(res ? 200 : 500, res, res ? "创建成功" : "创建失败");
    } catch (error) {
      console.log(error);
      errorData(500, error.message, "服务错误");
    }
  }
  /**
   *
   * @param {*} book
   * 更新书籍的信息
   */
  async updateBook(book) {
    try {
      let res = this.ctx.model.Book.update(book);
      return successData(res ? 200 : 500, res, res ? "修改成功" : "修改失败");
    } catch (error) {
      errorData(500, error.message, "服务器错误");
    }
  }

  /**
   * 根据id删除这个目标
   * @param {*} id
   */
  async deleteBookById(id) {
    try {
      let res = this.ctx.model.Book.destroy({
        where: {
          id,
        },
      });
      return successData(res ? 200 : 500, res, res ? "删除成功" : "删除失败");
    } catch (error) {
      errorData(500, error.message, "服务器错误");
    }
  }
  // 小程序获取树相关的信息
  async getBookById(id){
    try {
      let book = await this.ctx.model.Book.findOne({
        where: {
          id
        }
      })
      let record = await this.ctx.model.Record.findOne({
        where: {
          b_id: id
        }
      })
      let totalTime = 0
      let highTime = 0
      for(let i = 0; i < record.length; i++){
        if(record[i].time > highTime){
          highTime = record[i].time
        }
        totalTime += record[i].time
      }
      book.dataValues.totalTime = totalTime,
      book.dataValues.highTime = highTime
      this.ctx.status = 200
      if(book){
       return successData(200, book, "查询成功")
      }
      return errorData(500, book, "查无此人")
    } catch (error) {
      this.ctx.status = 500
      return errorData(500, error, "服务器错误")
    }
  }
}
module.exports = BookService;
