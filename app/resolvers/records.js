const { createRecord, deleteRecord } = require('../controllers/records');
const {
  createPosition,
  deletePositions,
  getPositionsByIds,
} = require('../controllers/positions');
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
    params.rows = Array.isArray(params.rows) ? params.rows : [params.rows];
    await deleteRecord(params);
    const result = await getPositionsByIds(params.rows);
    if (result.length) {
      await deletePositions({
        deletePositions: Array.from(result, i => i.position),
        parentId: result[0].parentId,
        type: 'record',
      });
    }
    ctx.body = { message: 'success' };
  },
};
