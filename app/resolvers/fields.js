const { checkKeyExists } = require('../util/helper');
const {
  createField,
  deleteField,
  findFieldType,
  updateFieldWidth,
  updateField,
  replaceField,
} = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async resolveCreateField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (!fieldProps)
      error(
        Status.Forbidden,
        ECodes.UNSURPPORTED_FIELD_TYPE,
        params.fieldTypeId,
      );
    if (fieldProps.isTypeOptionsRequired && !params.typeOptions)
      error(null, ECodes.REQUIRED, 'typeOptions');
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
    if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);
    await deleteField(field);
    ctx.body = { message: 'success' };
  },

  async resolveResizeColumn(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId', 'width');
    await updateFieldWidth(params);
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
    if (params.fieldTypeId) {
      const fieldProps = FIELD_TYPES[params.fieldTypeId];
      if (!fieldProps) {
        error(
          Status.Forbidden,
          ECodes.UNSURPPORTED_FIELD_TYPE,
          params.fieldTypeId,
        );
      }
      if (field.fieldTypeId == params.fieldTypeId) {
        await updateField(params);
      } else {
        ctx.body = await replaceField(field, params);
      }
    } else {
      await updateField(params);
      ctx.body = { message: 'success' };
    }
  },
};
