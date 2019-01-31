const { checkKeyExists } = require('../util/helper');
const fields = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

module.exports = {
  async resolveCreateField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (!fieldProps)
      error(
        Status.Forbidden,
        ECodes.UNSURPPORTED_FIELD_TYPE,
        params.fieldTypeId,
      );
    if (fieldProps.isTypeOptionsRequired && !params.typeOptions)
      error(null, ECodes.REQUIRED, 'typeOptions');
    const result = await sequelize.transaction(() =>
      fields.createField(params),
    );
    ctx.body = result;
    socketIo.sync({
      op: 'createField',
      body: result,
    });
  },

  async resolveDeleteField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fields.deleteField(params.fieldId));
    ctx.body = { message: 'success' };
  },

  async resolveResizeColumn(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId', 'width');
    await fields.updateFieldWidth(params);
    ctx.body = { message: 'success' };
  },

  async resolveUpdateField(ctx) {
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fields.updateField(params));
    ctx.body = { message: 'success' };
  },
};
