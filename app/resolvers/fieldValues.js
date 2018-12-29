const helperUtil = require('../util').helper;
const fieldValuesController = require('../controllers').fieldValues;

module.exports = {
  async createOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    helperUtil.checkKeyExists(params, 'textValue', 'recordId', 'fieldId');
    const fieldValue = await fieldValuesController.getFieldValue(
      params.recordId,
      params.fieldId,
    );
    if (!fieldValue) {
      await fieldValuesController.create(params);
    } else {
      await fieldValuesController.update(params);
    }
    ctx.body = { message: 'success' };
  },
};
