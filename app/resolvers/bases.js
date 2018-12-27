const pick = require('lodash').pick;
const helperUtil = require('../util').helper;
const basesController = require('../controllers').bases;

module.exports = {
  async getBases(ctx) {
    const bases = await basesController.findBases();
    ctx.body = { bases: bases };
  },

  async createBase(ctx) {
    const params = ctx.request.body;
    helperUtil.checkKeyExists(params, 'name');
    const bases = await basesController.createBase(params);
    ctx.body = pick(bases, ['id', 'name', 'createdAt']);
  },
};
