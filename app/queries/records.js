const { sequelize, records } = require('../models');

module.exports = {
  create(params) {
    return records.create(params);
  },

  destroy(rows) {
    return records.destroy({ where: { id: { $in: rows } } });
  },
};
