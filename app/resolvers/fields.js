const { checkKeyExists } = require('../util/helper');
const fldController = require('../controllers/fields');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId', 'name', 'fieldTypeId');
    // Check if table exists first in controller?

    // const fieldProps = FIELD_TYPES[params.fieldTypeId];
    // if (!fieldProps)
    //   error(
    //     Status.Forbidden,
    //     ECodes.UNSURPPORTED_FIELD_TYPE,
    //     params.fieldTypeId,
    //   );
    // if (fieldProps.isTypeOptionsRequired && !params.typeOptions)
    //   error(null, ECodes.REQUIRED, 'typeOptions');
    const result = await sequelize.transaction(() =>
      fldController.create(params),
    );
    ctx.body = result;
    // socketIo.sync({
    //   op: 'createField',
    //   body: result,
    // });
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fldController.delete(params.fieldId));
    ctx.body = { message: 'success' };
  },

  async resizeColumn(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId', 'width');
    await fldController.updateWidth(params);
    ctx.body = { message: 'success' };
  },

  async update(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'fieldId');
    await sequelize.transaction(() => fldController.update(params));
    ctx.body = { message: 'success' };
  },
};
