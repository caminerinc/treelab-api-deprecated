const { checkKeyExists } = require('../util/helper');
const fldValController = require('../controllers/fieldValues');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');
const { checkField } = require('../util/fieldTypes');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async createOrUpdatePrimitive(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value');
    const field = await checkField(params.fieldId);
    if (!field.types.isPrimitive)
      error(Status.Forbidden, ECodes.UNSUPPORTED_FIELD_TYPE);

    await sequelize.transaction(() => fldValController.upsertPrimitive(params));
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createOrUpdatePrimitiveField',
      body: params,
    });
  },

  async clearValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');
    await fldValController.delete(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'clearFieldValue',
      body: params,
    });
  },

  async updateArrayByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value');
    const field = await checkField(params.fieldId);
    if (!field.types.isArray)
      error(Status.Forbidden, ECodes.UNSUPPORTED_FIELD_TYPE);

    params.type = field.types.name;
    const result = await sequelize.transaction(() =>
      fldValController.updateArrayFieldTypesByAdding(params),
    );
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },

  async deleteArrayValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'item');
    const field = await checkField(params.fieldId);

    params.type = field.types.name;
    await sequelize.transaction(() =>
      fldValController.deleteArrayFieldTypesByRemoving(params),
    );
    ctx.body = { message: 'success' };
  },

  // async resolveBulkCopyFieldValue(ctx) {
  //   const params = ctx.request.body;
  //   checkKeyExists(
  //     params,
  //     'sourceColumnConfigs',
  //     'sourceCellValues2dArray',
  //     'tableId',
  //   );
  //   params.sourceColumnConfigs = JSON.parse(params.sourceColumnConfigs);
  //   params.sourceCellValues2dArray = JSON.parse(params.sourceCellValues2dArray);
  //   if (
  //     !Array.isArray(params.sourceColumnConfigs) ||
  //     !Array.isArray(params.sourceCellValues2dArray)
  //   )
  //     error(null, ECodes.BULK_COPY_PARAMS_MISSING);
  //   await sequelize.transaction(() => fieldValues.bulkCopyFieldValue(params));
  //   ctx.body = { message: 'sucess' };
  //   socketIo.sync({
  //     op: 'bulkCopyFieldValue',
  //     body: params,
  //   });
  // },
};
