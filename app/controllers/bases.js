const { bases, positions, sequelize } = require('../models');

module.exports = {
  getBases() {
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
      ],
      order: [[sequelize.col('tablePositions.position'), 'asc']],
    });
  },

  async createBase(params) {
    return await bases.create({
      name: params.name,
    });
  },

  getBase(id) {
    return bases.findOne({
      attributes: ['id', 'name'],
      where: { id },
    });
  },
};
