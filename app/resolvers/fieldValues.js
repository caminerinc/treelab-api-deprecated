const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  createArrayType,
  upsertFieldValue,
  deleteFieldValue,
} = require('../controllers/fieldValues');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');

    await upsertFieldValue(params);
    ctx.body = { message: 'success' };
  },

  async resolveClearFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');

    await deleteFieldValue(params);
    ctx.body = { message: 'success' };
  },

  async resoverUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await getFieldValue(params.recordId, params.fieldId);
    if (!fieldValue) {
      fieldValue = await createFieldValue(params);
    }
    await createArrayType({
      fieldValueId: fieldValue.id,
      value: params.value,
      fieldTypeId: params.fieldTypeId,
    });

    ctx.body = { message: 'success' };
  },
};
