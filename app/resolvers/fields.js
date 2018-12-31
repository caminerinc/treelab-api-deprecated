const { checkKeyExists } = require('../util/helper');
const { dbCreateField } = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  async createField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');

    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (!fieldProps) {
      ctx.status = 400;
      return (ctx.body = {
        error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
      });
    }

    if (fieldProps.isTypeOptionsRequired && !params.typeOptions) {
      return (ctx.body = {
        error: `typeOptions are required`,
      });
    }

    await dbCreateField(params);
    ctx.body = { message: 'success' };
  },
};
