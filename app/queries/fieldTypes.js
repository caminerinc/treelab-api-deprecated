const { FieldTypes, sequelize } = require('../models');

module.exports = {
  getAll() {
    return FieldTypes.findAll();
  },
};
