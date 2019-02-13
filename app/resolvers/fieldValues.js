const { checkKeyExists } = require('../util/helper');
const fldValController = require('../controllers/fieldValues');
const fldController = require('../controllers/fields');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');
const { getFieldTypes } = require('../util/fieldTypes');
const { error, Status, ECodes } = require('../util/error');

const checkFieldAndFieldType = async fieldId => {
  const field = await fldController.getById(fieldId);
  if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);
  if (!field.types || !field.types.isPrimitive)
    error(Status.Forbidden, ECodes.UNSURPPORTED_FIELD_TYPE);
  return field;
};

module.exports = {
  async createOrUpdatePrimitive(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value');
    await checkFieldAndFieldType(params.fieldId);

    await sequelize.transaction(() => fldValController.upsertPrimitive(params));
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createOrUpdatePrimitiveField',
      body: params,
    });
  },

  async clearValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId');
    await fldValController.delete(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'clearFieldValue',
      body: params,
    });
  },

  async updateArrayByAdding(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'value');
    const field = await checkFieldAndFieldType(params.fieldId);

    params.type = field.types.name;
    const result = await sequelize.transaction(() =>
      fldValController.updateArrayFieldTypesByAdding(params),
    );
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'updateArrayTypeByAdding',
      body: result,
    });
  },

  async deleteArrayValue(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'recordId', 'fieldId', 'item');
    const field = await checkFieldAndFieldType(params.fieldId);

    params.type = field.types.name;
    await sequelize.transaction(() =>
      fldValController.deleteArrayFieldTypesByRemoving(params),
    );
    ctx.body = { message: 'success' };
  },

  // async resolveBulkCopyFieldValue(ctx) {
  //   const params = ctx.request.body;
  //   checkKeyExists(
  //     params,
  //     'sourceColumnConfigs',
  //     'sourceCellValues2dArray',
  //     'tableId',
  //   );
  //   params.sourceColumnConfigs = JSON.parse(params.sourceColumnConfigs);
  //   params.sourceCellValues2dArray = JSON.parse(params.sourceCellValues2dArray);
  //   if (
  //     !Array.isArray(params.sourceColumnConfigs) ||
  //     !Array.isArray(params.sourceCellValues2dArray)
  //   )
  //     error(null, ECodes.BULK_COPY_PARAMS_MISSING);
  //   await sequelize.transaction(() => fieldValues.bulkCopyFieldValue(params));
  //   ctx.body = { message: 'sucess' };
  //   socketIo.sync({
  //     op: 'bulkCopyFieldValue',
  //     body: params,
  //   });
  // },
};
