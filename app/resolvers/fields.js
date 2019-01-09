const { checkKeyExists } = require('../util/helper');
const { createField } = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');

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
    const result = await createField(params);
    ctx.body = result;
    socketIo.sync({
      op: 'createField',
      body: result,
    });
  },
};
