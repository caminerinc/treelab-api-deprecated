const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  updateFieldValue,
  createArrayType,
} = require('../controllers/fieldValues');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'textValue', 'recordId', 'fieldId');
    const fieldValue = await getFieldValue(params.recordId, params.fieldId);

    if (!fieldValue) {
      await createFieldValue(params);
    } else {
      await updateFieldValue(params);
    }
    ctx.body = { message: 'success' };
  },

  async resoverUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'typeId');
    const fieldValue = await getFieldValue(params.recordId, params.fieldId);
    if (!fieldValue) {
      fieldValue = await createFieldValue(params);
    }
    await createArrayType({
      fieldValueId: fieldValue.id,
      value: params.value,
      typeId: params.typeId,
    });

    ctx.body = { message: 'success' };
  },
};
