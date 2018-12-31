const { dbGetTable } = require('../controllers/tables');

const checkTableExist = async (ctx, next) => {
  const tableId = ctx.request.body.tableId || ctx.params.tableId;
  if (!tableId) {
    ctx.status = 422;
    return (ctx.body = { error: 'tableId is required' });
  }
  const table = await dbGetTable(tableId);
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
