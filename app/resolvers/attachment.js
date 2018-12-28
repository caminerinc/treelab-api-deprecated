const helperUtil = require('../util').helper;
const attachmentController = require('../controllers').attachment;

module.exports = {
  async updateArrayTypeByAdding(ctx) {
    helperUtil.checkKeyExists(
      ctx.request.body,
      'recordId',
      'fieldId',
      'value',
      'typeId',
    );
    const fieldValue = await attachmentController.findFieldValue(
      ctx.request.body,
    );
    if (!fieldValue) {
      ctx.status = 400;
      return (ctx.body = {
        error: '没有找到该单元格',
      });
    }
    await attachmentController.addFieldValue({
      fieldValueId: fieldValue.id,
      typeId: ctx.request.body.typeId,
      value: ctx.request.body.value,
    });

    ctx.body = { message: 'success' };
  },
};
