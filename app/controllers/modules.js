const { modules } = require('../models');

module.exports = {
  getModules() {
    return modules.findAll({
      attributes: ['id', 'name'],
    });
  },
};
