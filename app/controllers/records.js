const { records } = require('../models');

module.exports = {
  dbCreateRecord(params) {
    return records.create(params);
  },
};
