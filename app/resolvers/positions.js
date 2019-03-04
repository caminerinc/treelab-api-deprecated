const { checkKeyExists } = require('../util/helper');
const posController = require('../controllers/positions');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');
const { POSITION_TYPE } = require('../constants/app');

const changePosition = async ctx => {
  const params = ctx.request.body;
  checkKeyExists(
    params,
    'originalPosition',
    'targetPosition',
    'parentId',
    'type',
  );
  params.originalPosition = parseInt(params.originalPosition);
  params.targetPosition = parseInt(params.targetPosition);
  if (!(params.originalPosition > 0) || !(params.targetPosition > 0))
    error(Status.Forbidden, ECodes.ILLEGAL_POSITION);
  await sequelize.transaction(() => posController.changePosition(params));
  ctx.body = { message: 'success' };
  socketIo.sync({
    op: 'changePosition',
    body: params,
  });
};

module.exports = {
  changePosition,
};
