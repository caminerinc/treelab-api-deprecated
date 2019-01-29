const { sequelize, positions } = require('../models');

module.exports = {
  getLastPosition(parentId, type) {
    return positions.findOne({
      attributes: [[sequelize.fn('max', sequelize.col('position')), 'max']],
      where: { parentId, type },
    });
  },

  create(params) {
    return positions.create(params);
  },

  getPositionsByParentIdAndType(parentId, type) {
    return positions.findAll({
      attributes: ['id', 'position'],
      where: { parentId, type },
      order: [['position', 'asc']],
    });
  },

  getPositionsByIds(ids) {
    return positions.findAll({ where: { id: { $in: ids } } });
  },

  getPrimaryFieldId(tableId) {
    return positions.findOne({
      attributes: ['id'],
      where: {
        parentId: tableId,
        position: 1,
        type: 'field',
      },
    });
  },

  deleteParentId(parentId) {
    return positions.destroy({ where: { parentId: { $in: parentId } } });
  },

  deletePositions(deletePositions) {
    return positions.destroy({
      where: {
        position: { $in: deletePositions },
        parentId,
        type,
      },
    });
  },

  query(sql, options) {
    return sequelize.query(sql, options);
  },
};
