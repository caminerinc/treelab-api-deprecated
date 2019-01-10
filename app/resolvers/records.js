const { createRecord, deleteRecord } = require('../controllers/records');
const { checkKeyExists } = require('../util/helper');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    const result = await createRecord(params);
    ctx.body = {
      recordId: result.id,
    };
    socketIo.sync({
      op: 'createRecord',
      body: result,
    });
  },
  async resolveDeleteRecord(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'rows');
    await deleteRecord(params);
    ctx.body = { message: 'success' };
  },
};
