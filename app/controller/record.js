const { Controller } = require("egg");

class RecordController extends Controller {
  async show() {
    const { id } = this.ctx.query;
    let res = this.ctx.service.record.findReocrdById(id);
    this.ctx.body = res
  }
  async getRecordsByBId() {
    const { pageSize, pageIndex, bId } = this.ctx.query;
    let noPage = false;
    if (pageSize && pageIndex) {
      noPage = true;
    }
    let res = await this.ctx.service.record.getRecordsByBId(
      pageSize,
      pageIndex,
      noPage,
      bId
    );
    this.ctx.body = res;
  }
  async getTotals(){
   let res = await this.service.record.getRecordTotal() 
   this.ctx.body = res
  }
}
module.exports = RecordController;
