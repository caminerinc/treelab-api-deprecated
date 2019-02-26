const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const bseController = require('../controllers/bases');
const socketIo = require('../../lib/socketIo');
const { sequelize } = require('../models/index');

const adaptBases = bases =>
  bases.map(base => ({
    ...pick(base, ['id', 'name', 'budId']),
    primaryTableId: base.tablePositions[0]
      ? base.tablePositions[0].siblingId
      : null,
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
      primaryTableId: result.table.table.id,
    };
    socketIo.sync({
      op: 'createBase',
      body: ctx.body,
    });
  },

  async getOne(ctx) {
    const baseId = ctx.request.body.baseId || ctx.params.baseId;
    if (!baseId) error(null, ECodes.REQUIRED, 'baseId');
    const base = await bseController.getOne(baseId);
    let result = base.toJSON();
    if (!result.bud) delete result.bud;
    ctx.body = result;
  },

  async getAll(ctx) {
    const result = await bseController.getAll();
    ctx.body = { bases: adaptBases(result) };
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'baseId');
    bseController.delete(params.baseId);
    ctx.body = { message: 'success' };
  },

  async getAllBuds(ctx) {
    const result = await bseController.getAllBuds();
    ctx.body = { bases: adaptBases(result) };
  },
};
