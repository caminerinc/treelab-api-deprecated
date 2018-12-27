const recordsController = require('../controllers').records;

module.exports = {
  async createRecord(ctx) {
    const params = ctx.request.body;
    await recordsController.createRecord(params);
    ctx.body = { message: 'success' };
  },
};
