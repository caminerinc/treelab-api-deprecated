const { getTable } = require('../controllers/tables');
// const { checkKeyExists } = require('../util/helper');

const checkTableExist = async (ctx, next) => {
  // checkKeyExists(ctx.request.body || ctx.params, 'tableId');
  const tableId = ctx.request.body.tableId || ctx.params.tableId;
  if (!tableId) {
    ctx.status = 422;
    return (ctx.body = { error: 'tableId is required' });
  }
  const table = await getTable(tableId);
  if (!table) {
    ctx.status = 400;
    return (ctx.body = { error: 'table does not exist' });
  }
  ctx.table = table;
  await next();
};

module.exports = {
  checkTableExist,
};
