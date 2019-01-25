const { getBase } = require('../controllers/bases');
const { error, Status, ECodes } = require('../util/error');

const checkBaseExist = async (ctx, next) => {
  const baseId = ctx.request.body.baseId || ctx.params.baseId;
  if (!baseId) error(ECodes.REQUIRED, 'baseId');
  const base = await getBase(baseId);
  if (!base) error(Status.Forbidden, ECodes.BASE_NOT_FOUND);
  ctx.base = base;
  await next();
};

module.exports = {
  checkBaseExist,
};
