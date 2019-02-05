const { Records } = require('../models');

module.exports = {
  create(params) {
    return Records.create(params);
  },

  destroy(rows) {
    return Records.destroy({ where: { id: { $in: rows } } });
  },
};
