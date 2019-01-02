const { checkKeyExists } = require('../util/helper');
const {
  dbGetFieldValue,
  dbCreateFieldValue,
  dbUpdateFieldValue,
} = require('../controllers/fieldValues');

module.exports = {
  async createOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'textValue', 'recordId', 'fieldId');
    const fieldValue = await dbGetFieldValue(params.recordId, params.fieldId);

    if (!fieldValue) {
      await dbCreateFieldValue(params);
    } else {
      await dbUpdateFieldValue(params);
    }
    ctx.body = { message: 'success' };
  },
};
