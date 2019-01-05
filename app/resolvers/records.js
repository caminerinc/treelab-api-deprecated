const { createRecord, deleteRecord } = require('../controllers/records');
const { checkKeyExists } = require('../util/helper');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    await createRecord(params);
    ctx.body = { message: 'success' };
  },
  async resolveDeleteRecord(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'rows');
    await deleteRecord(params);
    ctx.body = { message: 'success' };
  },
};
