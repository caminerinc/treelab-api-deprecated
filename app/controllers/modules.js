const modules = require('../queries/modules');

module.exports = {
  getModules() {
    return modules.getAllModules();
  },
};
