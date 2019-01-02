const { checkKeyExists } = require('../util/helper');
const { findFieldValue, addFieldValue } = require('../controllers/attachment');

module.exports = {
  async updateArrayTypeByAdding(ctx) {
    checkKeyExists(ctx.request.body, 'recordId', 'fieldId', 'value', 'typeId');
    const fieldValue = await findFieldValue(ctx.request.body);
    if (!fieldValue) {
      ctx.status = 400;
      return (ctx.body = {
        error: '没有找到该单元格',
      });
    }
    await addFieldValue({
      fieldValueId: fieldValue.id,
      value: ctx.request.body.value,
    });

    ctx.body = { message: 'success' };
  },
};
