const { Service } = require("egg");
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
      if (noPage) {
        res = await user.findAll({ where: { u_id: user.id } });
      } else {
        res = await user.findAll({
          where: { id: user.id },
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
      return successData(
        res ? 200 : 500,
        res,
        res ? "创建成功" : "创建失败"
      );
    } catch (error) {
        console.log(error)
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
        let res = this.ctx.model.Book.update(book)
        return successData(res ? 200: 500, res, res? "修改成功": "修改失败")
    } catch (error) {
      errorData(500, error.message, "服务器错误");
    }
  }

  /**
   * 根据id删除这个目标
   * @param {*} id 
   */
  async deleteBookById(id){
    try {
      let res = this.ctx.model.Book.destroy({
        where: {
          id
        }
      })
      return successData(res ? 200: 500, res, res ? "删除成功": "删除失败")
    } catch (error) {
      errorData(500, error.message, "服务器错误");
      
    }
  }
}
module.exports = BookService;
