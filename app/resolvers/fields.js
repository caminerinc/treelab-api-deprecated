const { checkKeyExists } = require('../util/helper');
const {
  createField,
  deleteField,
  findFieldType,
  updateField,
} = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');
const { createPosition } = require('../controllers/positions');

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
    if (fieldProps.name === 'foreignKey') {
      await createPosition({
        parentId: params.tableId,
        id: result.foreignFieldId,
        type: 'field',
      });
      await createPosition({
        parentId: params.tableId,
        id: result.symmetricFieldId,
        type: 'field',
      });
    } else {
      await createPosition({
        parentId: params.tableId,
        id: result.fieldId || result.id,
        type: 'field',
      });
    }
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
        error: `error fieldId: ${params.fieldId}`,
      });
    }
    await deleteField(field);
    ctx.body = { message: 'success' };
  },

  async resolveUpdateField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');

    if (params.name && params.name.length == 0) {
      ctx.status = 400;
      return (ctx.body = {
        error: `name can't null`,
      });
    }
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (!fieldProps) {
      ctx.status = 400;
      return (ctx.body = {
        error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
      });
    }
    const field = await findFieldType(params);
    if (!field) {
      ctx.status = 400;
      return (ctx.body = {
        error: `field is not found`,
      });
    }
    ctx.body = await updateField(field, params);
  },
};
