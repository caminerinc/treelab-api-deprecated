const { pick } = require('lodash');

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

const adaptTable = table => {
  return {
    tableDatas: {
      id: table.id,
      rowsById: table.records.reduce((obj, record) => {
        obj[record.id] = {
          id: record.id,
          createdAt: record.createdAt,
          cellValuesByColumnId: record.fieldValues.reduce(
            (_obj, fieldValue) => {
              _obj[fieldValue.fieldId] = fieldValue.value.value;
              return _obj;
            },
            {},
          ),
        };
        return obj;
      }, {}),
    },
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

  async getTable(ctx) {
    let params = ctx.params;
    if (!params.tableId) {
      ctx.status = 422;
      return (ctx.body = { message: 'tableId is required' });
    }
    let table = await tablesController.findTable(params.tableId);
    if (!table) {
      ctx.status = 400;
      return (ctx.body = { message: 'table does not exist' });
    }
    ctx.body = adaptTable(table);
  },
};
