const { records } = require('../models');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async createRecord(params) {
    const result = await records.create(params);

    return socketIo.sync({
      op: 'createRecord',
      body: {
        result,
      },
    });
  },
};
