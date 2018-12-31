const { bases } = require('../models');

module.exports = {
  dbGetBases() {
    return bases.findAll({
      attributes: ['id', 'name'],
    });
  },

  dbCreateBase(params) {
    return bases.create({
      name: params.name,
    });
  },
};
