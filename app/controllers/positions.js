const posQueries = require('../queries/positions');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  changePosition(params) {
    if (
      params.type === POSITION_TYPE.FIELD &&
      (params.targetPosition === 1 || params.originalPosition === 1)
    )
      error(Status.Forbidden, ECodes.ILLEGAL_POSITION);
    return posQueries.updateOne(params);
  },

  async create({ siblingId, parentId, type }) {
    const lastPosition = await posQueries.getLast(parentId, type);
    const position = (lastPosition.dataValues.max || 0) + 1;
    return await posQueries.create({ siblingId, position, parentId }, type);
  },

  getByIds(ids) {
    return posQueries.getByIds(ids);
  },

  bulkCreate(records, type) {
    return posQueries.bulkCreate(records, type);
  },

  getLastPosition(parentId, type) {
    return posQueries.getLast(parentId, type);
  },
};
