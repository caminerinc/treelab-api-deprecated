const { records } = require('../models');

module.exports = {
  createRecord(params) {
    return records.create(params);
  },
};
