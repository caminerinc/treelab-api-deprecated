const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { dbGetBases, dbCreateBase } = require('../controllers/bases');

module.exports = {
  async getBases(ctx) {
    const bases = await dbGetBases();
    ctx.body = { bases: bases };
  },

  async createBase(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');
    const bases = await dbCreateBase(params);
    ctx.body = pick(bases, ['id', 'name', 'createdAt']);
  },
};
