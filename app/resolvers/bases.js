const { pick, map } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const {
  getBases,
  createBase,
  deleteBase,
  findSymmetricFieldId,
  getBase,
} = require('../controllers/bases');
const { getTableByBaseId } = require('../controllers/tables');
const socketIo = require('../../lib/core/socketIo');
const { deleteParentId } = require('../controllers/positions');

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
    ctx.body = {
      id: result.base.id,
      name: result.base.name,
      tableId: result.table.table.id,
    };
    socketIo.sync({
      op: 'createBase',
      body: result,
    });
  },
  async resolveDeleteBase(ctx) {
    checkKeyExists(ctx.params, 'baseId');
    const base = await getBase(ctx.params.baseId);
    if (!base) {
      ctx.status = 400;
      return (ctx.body = { error: 'base does not exist' });
    }
    const symmetricFieldIds = await findSymmetricFieldId(ctx.params);
    await deleteBase(ctx.params.baseId, symmetricFieldIds);
    let tableIds = await getTableByBaseId(ctx.params);
    tableIds = map(tableIds, 'id');
    await deleteParentId([ctx.params.baseId, ...tableIds]);
    ctx.body = { message: 'success' };
  },
};
