const { checkKeyExists } = require('../util/helper');
const {
  createArrayType,
  findOrCreateFieldValue,
  upsertFieldValue,
  deleteFieldValue,
  bulkCopyFieldValue,
} = require('../controllers/fieldValues');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    await upsertFieldValue(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createOrUpdatePrimitiveField',
      body: params,
    });
  },

  async resolveClearFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');
    await deleteFieldValue(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'clearFieldValue',
      body: params,
    });
  },

  async resolveUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await findOrCreateFieldValue(
      params.recordId,
      params.fieldId,
    );

    const result = await createArrayType({
      fieldTypeId: params.fieldTypeId,
      fieldValueId: fieldValue.id,
      value: params.value,
    });

    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },

  async resolveBulkCopyFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(
      params,
      'sourceColumnConfigs',
      'sourceCellValues2dArray',
      'tableId',
    );
    params.sourceColumnConfigs = JSON.parse(params.sourceColumnConfigs);
    params.sourceCellValues2dArray = JSON.parse(params.sourceCellValues2dArray);
    if (
      !Array.isArray(params.sourceColumnConfigs) ||
      !Array.isArray(params.sourceCellValues2dArray)
    ) {
      ctx.status = 422;
      return (ctx.body = {
        error: 'sourceColumnConfigs and sourceCellValues2dArray must be array',
      });
    }
    ctx.body = await bulkCopyFieldValue(params);
    socketIo.sync({
      op: 'bulkCopyFieldValue',
      body: params,
    });
  },
};
