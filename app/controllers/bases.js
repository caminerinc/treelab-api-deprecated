const { bases, tables } = require('../models');

module.exports = {
  getBases() {
    return bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: tables,
          as: 'tables',
          attributes: [['id', 'primaryTableId']],
        },
      ],
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
