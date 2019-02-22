const {
  Bases,
  BasePositions,
  TablePositions,
  sequelize,
} = require('../models');

module.exports = {
  create({ name, icon, color }) {
    return Bases.create({ name, icon, color });
  },

  getAll() {
    return Bases.findAll({
      attributes: ['id', 'name', 'icon', 'color'],
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
