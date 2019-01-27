const { getEasyTable } = require('../controllers/tables');
const { error, Status, ECodes } = require('../util/error');

const checkTableExist = async (ctx, next) => {
  const tableId = ctx.request.body.tableId || ctx.params.tableId;
  if (!tableId) error(null, ECodes.REQUIRED, 'tableId');
  const table = await getEasyTable(tableId);
  if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);
  ctx.table = table;
  await next();
};

module.exports = {
  checkTableExist,
};
