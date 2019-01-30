const { checkKeyExists } = require('../util/helper');
const bases = require('../controllers/bases');
const socketIo = require('../../lib/core/socketIo');
const { sequelize } = require('../models/index');

const adaptBases = bases => {
  return bases.map(base => ({
    id: base.id,
    name: base.name,
    primaryTableId: base.tablePositions[0] ? base.tablePositions[0].id : null,
  }));
};

module.exports = {
  async resolveGetBases(ctx) {
    const result = await bases.getBases();
    ctx.body = { bases: adaptBases(result) };
  },

  async resolveCreateBase(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');
    const result = await sequelize.transaction(() => bases.createBase(params));
    ctx.body = {
      id: result.base.id,
      name: result.base.name,
      primaryTableId: result.table.table.id,
    };
    socketIo.sync({
      op: 'createBase',
      body: ctx.body,
    });
  },

  async resolveDeleteBase(ctx) {
    await sequelize.transaction(() => bases.deleteBase(ctx.params.baseId));
    ctx.body = { message: 'success' };
  },

  async resolveGetBase(ctx) {
    ctx.body = ctx.base;
  },
};
