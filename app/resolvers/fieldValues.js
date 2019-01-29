const { checkKeyExists } = require('../util/helper');
const fieldValues = require('../controllers/fieldValues');
const socketIo = require('../../lib/core/socketIo');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async resolveCreateOrUpdatePrimitiveField(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value', 'fieldTypeId');
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    if (fieldProps.isArrayValue)
      error(
        Status.Forbidden,
        ECodes.UNSURPPORTED_FIELD_TYPE,
        params.fieldTypeId,
      );
    await sequelize.transaction(() => fieldValues.upsertFieldValue(params));
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createOrUpdatePrimitiveField',
      body: params,
    });
  },

  async resolveClearFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');
    await fieldValues.deleteFieldValue(params);
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
    if (!fieldProps.isArrayValue)
      error(
        Status.Forbidden,
        ECodes.UNSURPPORTED_FIELD_TYPE,
        params.fieldTypeId,
      );
    const result = await sequelize.transaction(() =>
      fieldValues.createArrayValue(params),
    );
    ctx.body = { id: result.id };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },

  async resolveDeleteArrayValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'itemId', 'fieldTypeId');
    await sequelize.transaction(() => fieldValues.deleteArrayValue(params));
    ctx.body = { message: 'success' };
  },

  async resolveBulkCopyFieldValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(
      params,
      'sourceColumnConfigs',
      'sourceCellValues2dArray',
      'tableId',
    );
    params.sourceColumnConfigs = JSON.parse(params.sourceColumnConfigs);
    params.sourceCellValues2dArray = JSON.parse(params.sourceCellValues2dArray);
    if (
      !Array.isArray(params.sourceColumnConfigs) ||
      !Array.isArray(params.sourceCellValues2dArray)
    )
      error(null, ECodes.BULK_COPY_PARAMS_MISSING);
    await sequelize.transaction(() => fieldValues.bulkCopyFieldValue(params));
    ctx.body = { message: 'sucess' };
    socketIo.sync({
      op: 'bulkCopyFieldValue',
      body: params,
    });
  },
};
