const { checkKeyExists } = require('../util/helper');
const { createField, deleteField } = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  async resolveCreateField(ctx) {
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

    await createField(params);
    ctx.body = { message: 'success' };
  },

  async resolveDeleteField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId', 'fieldTypeId');

    await deleteField(params);
    ctx.body = { message: 'success' };
  },
};
