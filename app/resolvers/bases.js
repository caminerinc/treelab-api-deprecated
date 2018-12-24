const basesController = require('../controllers').bases;

module.exports = {
  async getBaseById(ctx) {
    try {
      const base = await basesController.findByBaseId(ctx.params.baseId);
      ctx.body = base;
    } catch (err) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.',
      };
    }
  },
};
