const { sequelize, foreignKeyTypes } = require('../models');

module.exports = {
  create: params => {
    return foreignKeyTypes.create(params);
  },
};
