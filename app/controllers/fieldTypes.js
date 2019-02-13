const fltQueries = require('../queries/fieldTypes');

module.exports = {
  getAll() {
    return fltQueries.getAll({ attributes: ['id', 'name'] });
  },
};
