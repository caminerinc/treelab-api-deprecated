const { checkKeyExists } = require('../util/helper');
const {
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
};
