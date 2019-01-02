const { checkKeyExists } = require('../util/helper');
const { getFieldValue, addFieldValue } = require('../controllers/findValues');

module.exports = {
  async resoverUpdateArrayTypeByAdding(ctx) {
    checkKeyExists(ctx.request.body, 'recordId', 'fieldId', 'value', 'typeId');
    const fieldValue = await findFieldValue(ctx.request.body);
    if (!fieldValue) {
      ctx.status = 400;
      return (ctx.body = {
        error: '没有找到该单元格',
      });
    } else {
      await createFieldValue({
        fieldValueId: fieldValue.id,
        value: ctx.request.body.value,
      });
    }
    await addFieldValue({
      fieldValueId: fieldValue.id,
      value: ctx.request.body.value,
    });

    ctx.body = { message: 'success' };
  },
};
