const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  createArrayType,
  upsertFieldValue,
  deleteFieldValue,
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
    const result = await deleteFieldValue(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'clearFieldValue',
      body: params,
    });
  },

  async resoverUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await getFieldValue(params.recordId, params.fieldId);
    if (!fieldValue) fieldValue = await createFieldValue(params);
    const result = await createArrayType({
      fieldValueId: fieldValue.id,
      value: params.value,
      fieldTypeId: params.fieldTypeId,
    });
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },
};
