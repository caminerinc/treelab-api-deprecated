const { checkKeyExists } = require('../util/helper');
const fldValController = require('../controllers/fieldValues');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');

module.exports = {
  async createOrUpdatePrimitive(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    // TODO Check field type is valid
    // const fieldProps = FIELD_TYPES[params.fieldTypeId];
    // if (fieldProps.isArrayValue)
    //   error(
    //     Status.Forbidden,
    //     ECodes.UNSURPPORTED_FIELD_TYPE,
    //     params.fieldTypeId,
    //   );
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
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    // TODO Check field types and values, prop is put into "item"
    // const fieldProps = FIELD_TYPES[params.fieldTypeId];
    // if (!fieldProps.isArrayValue)
    //   error(
    //     Status.Forbidden,
    //     ECodes.UNSURPPORTED_FIELD_TYPE,
    //     params.fieldTypeId,
    //   );
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
    checkKeyExists(params, 'recordId', 'fieldId', 'item', 'fieldTypeId');
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
