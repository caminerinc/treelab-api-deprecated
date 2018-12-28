const Records = require('../models').records;

module.exports = {
  createRecord(params) {
    return Records.create(params);
  },
};
