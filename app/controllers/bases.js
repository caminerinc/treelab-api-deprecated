const Bases = require('../models').bases;

module.exports = {
  findByBaseId(baseId) {
    return Bases.findOne({
      where: {
        id: baseId,
      },
    });
  },
};
