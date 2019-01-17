const { checkKeyExists } = require('../util/helper');
const {
  createField,
  deleteField,
  findFieldType,
  updateField,
  replaceField,
} = require('../controllers/fields');
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

  async resolveDeleteField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');
    const field = await findFieldType(params);
    if (!field) {
      ctx.status = 400;
      return (ctx.body = {
        error: `fieldId(${params.fieldId}) dose not exist`,
      });
    }
    await deleteField(field);
    ctx.body = { message: 'success' };
  },

  async resolveUpdateField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');

    const field = await findFieldType(params);
    if (!field) {
      ctx.status = 400;
      return (ctx.body = {
        error: `field is not found`,
      });
    }
    if (params.fieldTypeId && field.fieldTypeId != params.fieldTypeId) {
      const fieldProps = FIELD_TYPES[params.fieldTypeId];
      if (!fieldProps) {
        ctx.status = 400;
        return (ctx.body = {
          error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
        });
      }
      ctx.body = await replaceField(field, params);
    } else {
      await updateField(field, params);
      ctx.body = { message: 'success' };
    }
  },
};
