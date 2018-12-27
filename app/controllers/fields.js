const Fields = require('../models').fields;

module.exports = {
  create(params) {
    return Fields.create(params);
  },
};
