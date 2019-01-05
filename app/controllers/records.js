const { records } = require('../models');

module.exports = {
  async createRecord(params) {
    return await records.create(params);
  },
};
