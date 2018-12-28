const helperUtil = require('../util').helper;
const fieldValuesController = require('../controllers').fieldValues;

module.exports = {
  async createOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    helperUtil.checkKeyExists(params, 'textValue');
    const fieldValue = await fieldValuesController.getFieldValue(params.id);
    if (!fieldValue) {
      helperUtil.checkKeyExists(params, 'recordId', 'fieldId');
      await fieldValuesController.create(params);
    } else {
      helperUtil.checkKeyExists(params, 'id');
      await fieldValuesController.update(params);
    }
    ctx.body = { message: 'success' };
  },
};
