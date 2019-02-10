const fldController = require('../controllers/fields');
const { sequelize } = require('../models/index');
const { checkKeyExists } = require('../util/helper');
const socketIo = require('../../lib/socketIo');

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');

    const result = await sequelize.transaction(() =>
      fldController.create(params),
    );
    ctx.body = result;
    socketIo.sync({
      op: 'createField',
      body: result,
    });
  },

  async update(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fldController.update(params));
    ctx.body = { message: 'success' };
  },

  async resizeColumn(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId', 'width');
    await fldController.updateWidth(params);
    ctx.body = { message: 'success' };
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fldController.delete(params.fieldId));
    ctx.body = { message: 'success' };
  },
};
