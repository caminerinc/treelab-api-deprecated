const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const tblController = require('../controllers/tables');
const socketIo = require('../../lib/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const adaptTables = tables => ({
  tableSchemas: tables.map(table => ({
    ...pick(table, ['id', 'name']),
    columns: table.flds.map(field => {
      return pick(field, ['id', 'name', 'fieldTypeId', 'typeOptions']);
    }),
  })),
});

const adaptTable = table => ({
  tableDatas: {
    ...pick(table, ['id']),
    rowsById: getRowsById(table.recs),
  },
  // TODO: Needs refactor
  viewDatas: [
    {
      columnOrder: table.positions
        .filter(i => {
          if (i.type === 'field') return i;
        })
        .map(i => {
          return {
            id: i.id,
            position: i.position,
            width: i.field ? i.field.width : null,
          };
        }),
      rowOrder: table.positions
        .filter(i => {
          if (i.type === 'record') return i;
        })
        .map(i => {
          return { id: i.id, position: i.position };
        }),
    },
  ],
});

const getRowsById = records => {
  let rowAccum = {};
  for (const record of records) {
    rowAccum[record.id] = {
      ...pick(record, ['id', 'createdAt']),
      cellValuesByColumnId: getCellValuesByColumnId(record.fldVs),
    };
  }
  return rowAccum;
};

const getCellValuesByColumnId = fieldValues => {
  let cellAccum = {};
  for (const fieldValue of fieldValues) {
    cellAccum[fieldValue.fieldId] = fieldValue.value;
  }
  return cellAccum;
};

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name', 'baseId');
    const result = await sequelize.transaction(() =>
      tblController.createNewTableSet(params),
    );
    ctx.body = result;
    socketIo.sync({ op: 'createTable', body: result });
  },

  async getAll(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'baseId');
    const tables = await tblController.getAll(params.baseId);
    ctx.body = adaptTables(tables);
  },

  async getOne(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const table = await tblController.getOne(params.tableId);
    if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);
    ctx.body = adaptTable(table);
  },

  async getShallowRows(ctx) {
    // TODO: INCOMPLETE
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const { table, tableSchema } = await tblController.getShallowRows(
      params.tableId,
    );
    ctx.body = await adaptGetRowsMatchingName(table, tableSchema);
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    await sequelize.transaction(() => tblController.delete(params.tableId));
    ctx.body = { message: 'success' };
  },
};
