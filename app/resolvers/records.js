const recController = require('../controllers/records');
const { checkKeyExists } = require('../util/helper');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    const result = await sequelize.transaction(() =>
      recController.checkTableAndCreate(params.tableId),
    );
    ctx.body = { recordId: result.id, position: result.position };
    socketIo.sync({
      op: 'createRecord',
      body: result,
    });
  },

  async deleteMultiple(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'rows');
    params.rows = Array.isArray(params.rows) ? params.rows : [params.rows];
    await sequelize.transaction(() =>
      recController.deleteMultiple(params.rows),
    );
    ctx.body = { message: 'success' };
  },
};
