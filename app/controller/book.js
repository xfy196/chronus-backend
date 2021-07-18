const { Controller } = require("egg");
class BookController extends Controller {
  async index() {
    const { pageSize, pageIndex } = this.ctx.query;
    let noPage = false;
    if (pageSize && pageIndex) {
      noPage = true;
    }
    let res = await this.service.book.getBooks(pageSize, pageIndex, noPage);
    return res;
  }
  async create() {
    const book = this.ctx.request.body;
    let res = await this.ctx.service.book.addBook(book);
    this.ctx.body = res;
  }
  async update() {
    const { id } = this.ctx.query;
    const book = this.ctx.request.body;
    let res = await this.ctx.service.book.updateBook(book);
    this.ctx.body = res;
  }
}
module.exports = BookController;
