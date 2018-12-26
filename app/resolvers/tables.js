const pick = require('lodash').pick;
const helper = require('../util').helper;
const tablesController = require('../controllers').tables;

const adaptTables = tables => {
  return {
    tableSchemas: tables.map(table => ({
      ...pick(table, ['id', 'name']),
      columns: table.fields.map(field => ({
        ...pick(field, ['id', 'name']),
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
    ctx.body = adaptTable(ctx.table);
  },
};
