const tablesController = require('../controllers').tables;

module.exports = {
  async getTables(ctx) {
    let params = ctx.params;
    if (!params.baseId) {
      ctx.status = 422;
      return (ctx.body = { message: 'baseId is necessary' });
    }
    let tables = await tablesController.findTables(params.baseId);
    tables.forEach(table => {
      table.columns = table.fields;
      delete table.fields;
      table.columns = Array.from(i => (i.type = i.type.name));
    });
    ctx.body = { tableSchemas: tables };
  },
};
