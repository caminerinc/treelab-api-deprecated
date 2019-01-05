const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  updateFieldValue,
  createArrayType,
  findOrCreateFieldValue,
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

  async resolveUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await findOrCreateFieldValue(
      params.recordId,
      params.fieldId,
    );
    await createArrayType({
      fieldValueId: fieldValue[0].id,
      value: params.value,
      fieldTypeId: params.fieldTypeId,
    });

    ctx.body = { message: 'success' };
  },
};
