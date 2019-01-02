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

  createBase(params) {
    return bases.create({
      name: params.name,
    });
  },
};
