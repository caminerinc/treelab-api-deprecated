const basesController = require('../controllers').bases;

module.exports = {
  async getBaseById(ctx) {
    const base = await basesController.findByBaseId(ctx.params.baseId);
    ctx.body = base;
  },

  async getBases(ctx) {
    const bases = await basesController.findBases();
    ctx.body = { bases: bases };
  },

  async createBase(ctx) {
    const params = ctx.request.body;
    if (!params.name) {
      ctx.status = 422;
      return (ctx.body = { message: 'the name of base is necessary' });
    }
    const bases = await basesController.createBase(params);
    ctx.body = bases;
  },
};
