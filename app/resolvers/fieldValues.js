const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  updateFieldValue,
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
};
