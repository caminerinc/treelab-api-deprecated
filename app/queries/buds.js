const { Buds, sequelize } = require('../models');

module.exports = {
  create(params) {
    return Buds.create(params);
  },
};
