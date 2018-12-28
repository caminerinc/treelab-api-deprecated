const helperUtil = require('../util').helper;
const fieldValuesController = require('../controllers').fieldValues;
const recordsController = require('../controllers').records;

module.exports = {
  async createOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    helperUtil.checkKeyExists(params, 'textValue', 'recordId', 'fieldId');
    let record = recordsController.getRecord(params.recordId);
    if (!record) {
      ctx.status = 400;
      return (ctx.body = { error: `recordId(${recordId}) does not exists` });
    }
    let fieldValue = await fieldValuesController.getFieldValue(
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
