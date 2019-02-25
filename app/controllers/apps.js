const appsQueries = require('../queries/apps');

module.exports = {
  getAll() {
    return appsQueries.getAll();
  },

  getOne(id) {
    return appsQueries.getOne(id);
  },
};
