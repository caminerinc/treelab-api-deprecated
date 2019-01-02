const { bases, tables } = require('../models');

module.exports = {
  dbGetBases() {
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

  dbCreateBase(params) {
    return bases.create({
      name: params.name,
    });
  },
};
