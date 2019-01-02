const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getBases, createBase } = require('../controllers/bases');

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
  async resolveGetBases(ctx) {
    const bases = await getBases();
    ctx.body = { bases: adaptBases(bases) };
  },

  async resolveCreateBase(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');
    const bases = await createBase(params);
    ctx.body = pick(bases, ['id', 'name', 'createdAt']);
  },
};
