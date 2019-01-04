const { blocks } = require('../models');

module.exports = {
  getBlock(where) {
    return blocks.findOne({ where });
  },
};
