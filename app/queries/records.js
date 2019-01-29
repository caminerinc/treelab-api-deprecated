const { sequelize, records } = require('../models');

module.exports = {
  create(params) {
    return records.create(params);
  },
};
