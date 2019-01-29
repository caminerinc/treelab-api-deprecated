const { sequelize, modules } = require('../models');

module.exports = {
  getAllModules() {
    return modules.findAll({
      attributes: ['id', 'name'],
    });
  },
};
