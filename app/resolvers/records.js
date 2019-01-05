const { createRecord } = require('../controllers/records');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    await createRecord(params);
    ctx.body = { message: 'success' };
  },
  async resolveDeleteRecord(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'rows');
    console.log(rows);
    await deleteRecord(params);
    ctx.body = { message: 'success' };
  },
};
