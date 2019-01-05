const { createRecord } = require('../controllers/records');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    const result = await createRecord(params);
    ctx.body = { message: 'success' };
    socketIo.sync({
      op: 'createRecord',
      body: result,
    });
  },
};
