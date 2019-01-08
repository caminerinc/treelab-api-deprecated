const { checkKeyExists } = require('../util/helper');
const { changePosition } = require('../controllers/positions');
const socketIo = require('../../lib/core/socketIo');

const resolveChangePosition = async ctx => {
  const params = ctx.request.body;
  checkKeyExists(
    params,
    'originalPositions',
    'targetPosition',
    'parentId',
    'prefix',
  );
  if (params.originalPositions.length === 0) {
    ctx.status = 422;
    return (ctx.body = { error: 'originalPositions can not be empty' });
  }
  if (!Array.isArray(params.originalPositions))
    params.originalPositions = [params.originalPositions];
  params.parentId = params.prefix + '_' + params.parentId;
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
