const { findFieldById } = require('../controllers/fields');
const { findRecordById } = require('../controllers/records');
const { checkKeyExists } = require('../util/helper');

const checkFieldIdAndRecordId = async (ctx, next) => {
  const params = ctx.request.body;
  checkKeyExists(params, 'recordId', 'fieldId');
  const field = await findFieldById({ id: params.fieldId });
  if (!field) {
    ctx.status = 422;
    return (ctx.body = { error: 'fieldId is required' });
  }
  const record = await findRecordById({ id: params.recordId });
  if (!record) {
    ctx.status = 422;
    return (ctx.body = { error: 'recordId is required' });
  }
  await next();
};

module.exports = {
  checkFieldIdAndRecordId,
};
