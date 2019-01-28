const { sequelize, tables } = require('../models');

module.exports = {
  createOneTable: params => {
    return tables.create(params);
  },
};
