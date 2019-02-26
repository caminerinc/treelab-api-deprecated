const {
  Bases,
  Buds,
  BasePositions,
  TablePositions,
  sequelize,
} = require('../models');

module.exports = {
  create(params) {
    return Bases.create(params);
  },

  getAll() {
    return Bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: TablePositions,
          as: 'tablePositions',
          attributes: ['siblingId', 'position'],
          required: false,
        },
        {
          model: BasePositions,
          as: 'pos',
          attributes: ['position'],
        },
      ],
      where: {
        budId: null,
      },
      order: [[sequelize.col('tablePositions.position'), 'asc']],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  getOne(id) {
    return Bases.findOne({
      attributes: ['id', 'name'],
      where: { id },
      include: [
        {
          model: Buds,
          as: 'bud',
          attributes: { exclude: ['updatedAt', 'createdAt'] },
        },
      ],
    });
  },

  destroy(id) {
    return Bases.destroy({ where: { id } });
  },

  getAllBuds() {
    return Bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: TablePositions,
          as: 'tablePositions',
          attributes: ['siblingId', 'position'],
          required: false,
        },
        {
          model: BasePositions,
          as: 'pos',
          attributes: ['position'],
        },
      ],
      where: {
        budId: { $not: null },
      },
      order: [[sequelize.col('tablePositions.position'), 'asc']],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  getOneBud(id) {
    return Bases.findOne({
      attributes: ['id', 'name', 'budId'],
      include: [
        {
          model: TablePositions,
          as: 'tablePositions',
          attributes: ['siblingId', 'position'],
          required: false,
        },
      ],
      where: { id },
    });
  },
};
