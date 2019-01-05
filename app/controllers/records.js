const { records } = require('../models');

module.exports = {
  createRecord(params) {
    return records.create(params);
  },
  deleteRecord({ rows }) {
    records.destroy({
      where: {
        id: {
          $in: rows,
        },
      },
    });
  },
};
