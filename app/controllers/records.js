const { records } = require('../models');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async createRecord(params) {
    const result = await records.create(params);

    socketIo.sync({
      op: 'createRecord',
      body: {
        result,
      },
    });

    return result;
  },
};
