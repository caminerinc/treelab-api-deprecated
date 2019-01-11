const { records } = require('../models');

module.exports = {
  async createRecord(params) {
    return await records.create(params);
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
