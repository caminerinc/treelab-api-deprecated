const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  updateFieldValue,
} = require('../controllers/fieldValues');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldValue = await getFieldValue(params.recordId, params.fieldId);

    if (!fieldValue) {
      await createFieldValue(params);
    } else {
      await updateFieldValue(params);
    }
    ctx.body = { message: 'success' };
  },
  resolveClearFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'typeId');

    updateFieldValue();
  },
};
