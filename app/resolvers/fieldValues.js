const { checkKeyExists } = require('../util/helper');
const {
  getFieldValue,
  createFieldValue,
  updateFieldValue,
  upsertFieldValue,
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
    checkKeyExists(params, 'recordId', 'fieldId', 'fieldTypeId');

    await upsertFieldValue({
      ...params,
      value: null,
    });
    ctx.body = { message: 'success' };
  },
};
