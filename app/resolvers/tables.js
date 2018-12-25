const { pick } = require('lodash');
const { helper, fields } = require('../util');

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
      ...pick(table, ['id']),
      rowsById: getRowsById(table.records),
    },
  };
};

const getRowsById = records =>
  records.reduce((rowAccum, record) => {
    rowAccum[record.id] = {
      ...pick(record, ['id', 'createdAt']),
      cellValuesByColumnId: getCellValuesByColumnId(record.fieldValues),
    };
    return rowAccum;
  }, {});

const getCellValuesByColumnId = fieldValues =>
  fieldValues.reduce((cellAccum, fieldValue) => {
    cellAccum[fieldValue.fieldId] = fieldValue.value.value;
    return cellAccum;
  }, {});

module.exports = {
  async getTables(ctx) {
    const params = ctx.params;
    helper.checkKeyExists(params, 'baseId');
    const tables = await tablesController.findTables(params.baseId);
    ctx.body = adaptTables(tables);
  },

  async getTable(ctx) {
    const params = ctx.params;
    helper.checkKeyExists(params, 'tableId');
    const table = await tablesController.findTable(params.tableId);
    if (!table) {
      ctx.status = 400;
      return (ctx.body = { error: 'table does not exist' });
    }
    ctx.body = adaptTable(table);
  },

  async createField(ctx) {
    const params = ctx.request.body;
    helper.checkKeyExists(params, 'tableId', 'name', 'type');
    const fieldTypes = await fields.getFieldTypes();
    console.log(fieldTypes);
    if (fieldTypes.indexOf(params.type) === -1) {
      ctx.status = 422;
      return (ctx.body = { error: `unsupported type ${params.type}` });
    }
    await tablesController.createField(params);
    ctx.body = { message: 'success' };
  },
};
