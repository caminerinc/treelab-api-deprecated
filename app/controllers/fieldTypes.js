const fldTypesQueries = require('../queries/fieldTypes');

module.exports = {
  getAll() {
    return fldTypesQueries.getAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    });
  },
};
