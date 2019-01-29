const { bases, sequelize, positions } = require('../models');

module.exports = {
  getAllBases() {
    return bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: positions,
          as: 'tablePositions',
          attributes: ['id', 'position'],
          where: { type: 'table' },
          required: false,
        },
        {
          model: positions,
          as: 'pos',
          attributes: ['position'],
          where: { type: 'base' },
          required: false,
        },
      ],
      order: [[sequelize.col('tablePositions.position'), 'asc']],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  create(name) {
    return bases.create({ name });
  },

  getBase(id) {
    return bases.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: { id },
    });
  },

  destroy(id) {
    bases.destroy({ where: { id } });
  },
};
