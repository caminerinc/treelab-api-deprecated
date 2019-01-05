const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  createArrayType,
  findOrCreateFieldValue,
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

  async resolveUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await findOrCreateFieldValue(
      params.recordId,
      params.fieldId,
    );
    const result = await createArrayType({
      fieldValueId: fieldValue[0].id,
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
