const {
  BasePositions,
  FieldPositions,
  RecordPositions,
  TablePositions,
  sequelize,
} = require('../models');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');

const POSITION_MODELS = {
  [POSITION_TYPE.BASE]: BasePositions,
  [POSITION_TYPE.TABLE]: TablePositions,
  [POSITION_TYPE.FIELD]: FieldPositions,
  [POSITION_TYPE.RECORD]: RecordPositions,
};

module.exports = {
  getLast(parentId, type) {
    const PosModel = POSITION_MODELS[type];

    return PosModel.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('position')), 'max']],
      where: { parentId },
    });
  },

  create(params, type) {
    const PosModel = POSITION_MODELS[type];

    return PosModel.create(params);
  },

  getByIds(ids) {
    return Positions.findAll({ where: { id: { $in: ids } } });
  },

  query(sql, options) {
    return sequelize.query(sql, options);
  },

  bulkCreate(records, type) {
    const PosModel = POSITION_MODELS[type];
    return PosModel.bulkCreate(records);
  },

  updateOne(params) {
    const tableName =
      params.type.slice(0, 1).toUpperCase() +
      params.type.slice(1) +
      'Positions';
    const sql = `update "${tableName}" set "position" = case when "position"=${
      params.originalPosition
    } then ${params.targetPosition} when "position"=${
      params.targetPosition
    } then ${params.originalPosition} else "position" end where "parentId"='${
      params.parentId
    }'`;
    return sequelize.query(sql);
  },
};
