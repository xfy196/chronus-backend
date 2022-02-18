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
    if (!(pageSize && pageIndex)) {
      noPage = true;
    }
    // 目标数据
    let records = await this.ctx.service.record.getRecordsByBId(
      pageSize,
      pageIndex,
      noPage,
      bId
    );
    this.ctx.body = records;
  }
  async create(){
    let body = this.ctx.request.body
    let res = await this.service.record.addRecord(body)
    this.ctx.body = res
  }
  async getTotals(){
   let res = await this.service.record.getRecordTotal() 
   this.ctx.body = res
  }
}
module.exports = RecordController;
