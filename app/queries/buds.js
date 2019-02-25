const { Buds, Bases, Apps, sequelize } = require('../models');

module.exports = {
  create(params) {
    return Buds.create(params);
  },

  getOne(budId) {
    return Bases.findOne({
      attributes: ['id', 'name'],
      where: { budId },
      include: [
        {
          model: Buds,
          as: 'bud',
          attributes: { exclude: ['updatedAt', 'createdAt'] },
          include: [
            {
              model: Apps,
              as: 'app',
              attributes: { exclude: ['updatedAt', 'createdAt'] },
            },
          ],
        },
      ],
    });
  },
};
