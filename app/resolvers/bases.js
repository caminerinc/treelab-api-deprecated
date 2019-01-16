const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getBases, createBase } = require('../controllers/bases');
const socketIo = require('../../lib/core/socketIo');

const adaptBases = bases => {
  return Array.from(bases, base => {
    base = JSON.parse(JSON.stringify(base));
    return {
      id: base.id,
      name: base.name,
      primaryTableId: base.tablePositions[0] ? base.tablePositions[0].id : null,
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
    const result = await createBase(params);
    ctx.body = pick(result.base, ['id', 'name', 'createdAt']);
    socketIo.sync({
      op: 'createBase',
      body: result,
    });
  },
};
