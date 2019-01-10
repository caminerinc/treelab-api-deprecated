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
  async findRecordById({ id }) {
    return await records.findOne({
      where: { id },
      attributes: ['id'],
      raw: true,
    });
  },
};
