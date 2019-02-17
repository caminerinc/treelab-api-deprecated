const { pick } = require('lodash');
const { checkKeyExists, trim } = require('../util/helper');
const tblController = require('../controllers/tables');
const socketIo = require('../../lib/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const adaptTables = tables => ({
  tableSchemas: tables.map(table => ({
    ...pick(table, ['id', 'name']),
    columns: table.flds.map(field => ({
      ...pick(field, ['id', 'name', 'typeOptions']),
      type: field.types.name,
    })),
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
      columnOrder: table.fieldPositions.map(fieldPos => ({
        id: fieldPos.siblingId,
        width: fieldPos.field ? fieldPos.field.width : null,
      })),
      rowOrder: table.recordPositions.map(recPos => ({ id: recPos.siblingId })),
    },
  ],
});

const adaptShallowRows = (table, tableSchema) => {
  const adaptedTable = adaptTable(table);
  let rowResults = [];
  let columnsById = {};

  for (const i in adaptedTable.viewDatas[0].rowOrder) {
    const rowId = adaptedTable.viewDatas[0].rowOrder[i].id;
    rowResults.push(adaptedTable.tableDatas.rowsById[rowId]);
  }

  for (const col of tableSchema) {
    columnsById[col.id] = {
      ...pick(col, ['id', 'name', 'typeOptions']),
      type: col.types.name,
    };
  }

  return {
    rowResults,
    columnsById,
    columnOrder: adaptedTable.viewDatas[0].columnOrder,
  };
};

const adaptCreateTable = ({ table, fields }) => ({
  tableSchemas: [
    {
      name: table.name,
      id: table.id,
      columns: fields.map(i => pick(i, ['id', 'name', 'typeOptions', 'type'])),
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
    if (fieldValue.value !== null && fieldValue.value !== '')
      cellAccum[fieldValue.fieldId] = fieldValue.value;
  }
  return cellAccum;
};

module.exports = {
  async create(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name', 'baseId');
    params.name = trim(params.name);
    if (params.name === '') error(null, ECodes.TABLE_NAME_EMPTY);
    const result = await sequelize.transaction(() =>
      tblController.createNewTableSet(params),
    );
    ctx.body = adaptCreateTable(result);
    socketIo.sync({ op: 'createTable', body: ctx.body });
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
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const { table, tableSchema } = await tblController.getShallowRows(
      params.tableId,
    );
    const adaptedData = adaptShallowRows(table, tableSchema);
    ctx.body = adaptedData;
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    await sequelize.transaction(() => tblController.delete(params.tableId));
    ctx.body = { message: 'success' };
  },

  async update(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tableId');
    params.name = trim(params.name);
    if (params.name === '') error(null, ECodes.TABLE_NAME_EMPTY);
    await tblController.update(params);
    ctx.body = { message: 'success' };
  },

  async bulkTables(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'tables', 'baseId');
    try {
      params.tables = JSON.parse(params.tables);
    } catch (e) {
      error(Status.Forbidden, ECodes.INVALID_JSON);
    }
    await sequelize.transaction(() =>
      tblController.bulkTables(params.baseId, params.tables),
    );
    ctx.body = { message: 'success' };
  },
};
