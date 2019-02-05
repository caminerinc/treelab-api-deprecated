const { checkKeyExists } = require('../util/helper');
const bseController = require('../controllers/bases');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');

const adaptBases = bases =>
  bases.map(base => ({
    id: base.id,
    name: base.name,
    // primaryTableId: base.tablePositions[0] ? base.tablePositions[0].id : null,
  }));

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');

    const result = await sequelize.transaction(() =>
      bseController.create(params),
    );
    ctx.body = {
      id: result.base.id,
      name: result.base.name,
      // primaryTableId: result.table.table.id,
    };
  },

  async getOne(ctx) {
    const baseId = ctx.request.body.baseId || ctx.params.baseId;
    if (!baseId) error(null, ECodes.REQUIRED, 'baseId');

    const base = await bseController.getOne(baseId);
    ctx.body = base;
  },

  async getAll(ctx) {
    const result = await bseController.getAll();
    ctx.body = { bases: adaptBases(result) };
  },
  // async resolveCreateBase(ctx) {
  //   const params = ctx.request.body;
  //   checkKeyExists(params, 'name');
  //   const result = await sequelize.transaction(() => bases.createBase(params));
  //   ctx.body = {
  //     id: result.base.id,
  //     name: result.base.name,
  //     primaryTableId: result.table.table.id,
  //   };
  //   socketIo.sync({
  //     op: 'createBase',
  //     body: ctx.body,
  //   });
  // },
  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'baseId');
    await sequelize.transaction(() => bseController.delete(params.baseId));
    ctx.body = { message: 'success' };
  },
};
