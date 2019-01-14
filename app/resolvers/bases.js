const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getBases, createBase, deleteBase } = require('../controllers/bases');
const { createTable } = require('../controllers/tables');
const { createField } = require('../controllers/fields');
const socketIo = require('../../lib/core/socketIo');

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
    await deleteBase(ctx.params);
    ctx.body = { message: 'success' };
  },
};
