const { pick, map } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const {
  getBases,
  createBase,
  deleteBase,
  findSymmetricFieldId,
} = require('../controllers/bases');
const { createTable, getTableByBaseId } = require('../controllers/tables');
const { createField } = require('../controllers/fields');
const socketIo = require('../../lib/core/socketIo');
const { deleteParentId } = require('../controllers/positions');

const adaptBases = bases => {
  return Array.from(bases, base => {
    base = JSON.parse(JSON.stringify(base));
    return {
      id: base.id,
      name: base.name,
      primaryTableId: base.tables[0] ? base.tables[0].id : null,
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
    const table = await createTable({ baseId: bases.id, name: 'Table 1' });
    const field = await createField({
      tableId: table.id,
      name: 'Field 1',
      fieldTypeId: 1,
    });
    ctx.body = pick(bases, ['id', 'name', 'createdAt']);
    socketIo.sync({
      op: 'createBase',
      body: {
        base: ctx.body,
        table,
        field,
      },
    });
  },
  async resolveDeleteBase(ctx) {
    checkKeyExists(ctx.params, 'baseId');
    const symmetricFieldIds = await findSymmetricFieldId(ctx.params);
    await deleteBase(ctx.params.baseId, symmetricFieldIds);
    let tableIds = await getTableByBaseId(ctx.params);
    tableIds = map(tableIds, 'id');
    await deleteParentId([ctx.params.baseId, ...tableIds]);
    ctx.body = { message: 'success' };
  },
};
