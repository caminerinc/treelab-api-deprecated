const { helper } = require('../util');
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
    helper.checkKeyExists(params, 'name');
    const bases = await basesController.createBase(params);
    ctx.body = bases;
  },
};
