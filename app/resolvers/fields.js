const helperUtil = require('../util').helper;
const fieldsController = require('../controllers').fields;
const FIELD_TYPES = require('../constants').fieldTypes.FIELD_TYPES;

module.exports = {
  async createField(ctx) {
    const params = ctx.request.body;
    helperUtil.checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');
    if (!FIELD_TYPES[params.fieldTypeId]) {
      ctx.status = 400;
      return (ctx.body = {
        error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
      });
    }
    await fieldsController.createField(params);
    ctx.body = { message: 'success' };
  },
};
