const { createRecord, deleteRecord } = require('../controllers/records');
const { checkKeyExists } = require('../util/helper');
const socketIo = require('../../lib/core/socketIo');
const { sequelize } = require('../models/index');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    const result = await sequelize.transaction(() =>
      createRecord(params.tableId),
    );
    ctx.body = { recordId: result.id, position: result.position };
    socketIo.sync({
      op: 'createRecord',
      body: result,
    });
  },

  async resolveDeleteRecord(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'rows');
    params.rows = Array.isArray(params.rows) ? params.rows : [params.rows];
    await sequelize.transaction(() => deleteRecord(params.rows));
    ctx.body = { message: 'success' };
  },
};
