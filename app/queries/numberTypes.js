const { sequelize, numberTypes } = require('../models');

module.exports = {
  create(params) {
    return numberTypes.create(params);
  },
};
