const { createRecord } = require('../controllers/records');

module.exports = {
  async resolveCreateRecord(ctx) {
    const params = ctx.request.body;
    await createRecord(params);
    ctx.body = { message: 'success' };
  },
};
