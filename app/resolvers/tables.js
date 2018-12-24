const tablesController = require('../controllers').tables;

module.exports = {
  async getTables(ctx) {
    let params = ctx.params;
    if (!params.baseId) {
      ctx.status = 422;
      return (ctx.body = { message: 'baseId is necessary' });
    }
    let tables = await tablesController.findTables(params.baseId);
    tables = JSON.parse(JSON.stringify(tables));
    tables = Array.from(tables, table => {
      table.columns = table.fields;
      table.columns = Array.from(table.columns, column => {
        column.type = column.type.name;
        return column;
      });
      delete table.fields;
      return table;
    });
    ctx.body = { tableSchemas: tables };
  },
};
