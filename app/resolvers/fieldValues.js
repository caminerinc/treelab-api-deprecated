const { checkKeyExists } = require('../util/helper');
const {
  createArrayValue,
  findOrCreateFieldValue,
  upsertFieldValue,
  deleteFieldValue,
  deleteArrayValue,
} = require('../controllers/fieldValues');
const { findFieldType } = require('../controllers/fields');
const socketIo = require('../../lib/core/socketIo');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (fieldProps.isArrayValue) {
      ctx.status = 400;
      return (ctx.body = {
        error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
      });
    }
    await upsertFieldValue(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createOrUpdatePrimitiveField',
      body: params,
    });
  },

  async resolveClearFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');
    await deleteFieldValue(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'clearFieldValue',
      body: params,
    });
  },

  async resolveUpdateArrayTypeByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (!fieldProps.isArrayValue) {
      ctx.status = 400;
      return (ctx.body = {
        error: `unsupported fieldTypeId: ${params.fieldTypeId}`,
      });
    }
    const fieldValue = await findOrCreateFieldValue(
      params.recordId,
      params.fieldId,
    );

    const result = await createArrayValue({
      fieldTypeId: params.fieldTypeId,
      fieldValueId: fieldValue.id,
      value: params.value,
    });
    ctx.body = {
      id: result.id,
      fieldValueId: result.fieldValueId,
    };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },
  async resolveDeleteArrayValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'itemId');

    const field = await findFieldType(params);
    params.fieldTypeId = field.fieldTypeId;
    const fieldValue = await deleteArrayValue(params);

    ctx.body = { message: 'success' };
  },
};
