const pick = require('lodash.pick');

const tablesController = require('../controllers').tables;

const adaptTables = tables => {
  return {
    tableSchemas: tables.map(table => ({
      ...pick(table, ['id', 'name']),
      columns: table.fields.map(field => ({
        ...pick(field, ['id', 'name']),
        type: field.type.name,
      })),
    })),
  };
};

module.exports = {
  async getTables(ctx) {
    let params = ctx.params;
    if (!params.baseId) {
      ctx.status = 422;
      return (ctx.body = { message: 'baseId is required' });
    }
    let tables = await tablesController.findTables(params.baseId);
    ctx.body = adaptTables(tables);
  },
};
