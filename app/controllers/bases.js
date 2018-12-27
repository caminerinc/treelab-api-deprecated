const Bases = require('../models').bases;

module.exports = {
  findBases() {
    return Bases.findAll({
      attributes: ['id', 'name'],
    });
  },

  createBase(params) {
    return Bases.create({
      name: params.name,
    });
  },
};
