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
    const result = await bases.create({
      name: params.name,
    });
    return result;
  },
};
