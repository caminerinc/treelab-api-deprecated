const { createRecord, deleteRecord } = require('../controllers/records');
const { createPosition } = require('../controllers/positions');
const { checkKeyExists } = require('../util/helper');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    const result = await createRecord(params);
    await createPosition({
      parentId: params.tableId,
      id: result.id,
      type: 'record',
    });
    ctx.body = { message: 'success' };
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
