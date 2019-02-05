const { Bases, Positions, sequelize } = require('../models');

module.exports = {
  create(name) {
    return Bases.create({ name });
  },

  getAll() {
    return Bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Positions,
          as: 'tablePositions',
          attributes: ['id', 'position'],
          where: { type: 'table' },
          required: false,
        },
        {
          model: Positions,
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

  getOne(id) {
    return Bases.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: { id },
    });
  },

  destroy(id) {
    return Bases.destroy({ where: { id } });
  },
};
