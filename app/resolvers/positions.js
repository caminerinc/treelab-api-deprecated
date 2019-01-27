const { checkKeyExists } = require('../util/helper');
const { changePosition } = require('../controllers/positions');
const socketIo = require('../../lib/core/socketIo');
const { error, Status, ECodes } = require('../util/error');

const resolveChangePosition = async ctx => {
  const params = ctx.request.body;
  checkKeyExists(
    params,
    'originalPositions',
    'targetPosition',
    'parentId',
    'type',
  );
  if (params.originalPositions.length === 0)
    error(null, ECodes.ORIGINAL_POSITIONS_MISSING);
  if (!(params.targetPosition > 1)) error(null, ECodes.ILLEGAL_TARGET_POSITION);
  if (!Array.isArray(params.originalPositions))
    params.originalPositions = [params.originalPositions];
  await changePosition(params);
  ctx.body = { message: 'success' };
  socketIo.sync({
    op: 'changePosition',
    body: params,
  });
};

module.exports = {
  resolveChangePosition,
};
