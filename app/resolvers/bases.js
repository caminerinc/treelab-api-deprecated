const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { dbGetBases, dbCreateBase } = require('../controllers/bases');

const adaptBases = bases => {
  return Array.from(bases, base => {
    base = JSON.parse(JSON.stringify(base));
    return {
      id: base.id,
      name: base.name,
      primaryTableId: base.tables[0] ? base.tables[0].primaryTableId : null,
    };
  });
};

module.exports = {
  async getBases(ctx) {
    const bases = await dbGetBases();
    ctx.body = { bases: adaptBases(bases) };
  },

  async createBase(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');
    const bases = await dbCreateBase(params);
    ctx.body = pick(bases, ['id', 'name', 'createdAt']);
  },
};
