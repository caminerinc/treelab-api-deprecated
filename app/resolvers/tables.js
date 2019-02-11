const { pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const tblController = require('../controllers/tables');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const adaptTables = tables => ({
  tableSchemas: tables.map(table => ({
    ...pick(table, ['id', 'name']),
    columns: table.flds.map(field => ({
      ...pick(field, ['id', 'name', 'typeOptions']),
      type: FIELD_TYPES[field.fieldTypeId].name,
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
      type: FIELD_TYPES[col.fieldTypeId].name,
    };
  }

  return {
    rowResults,
    columnsById,
    columnOrder: adaptedTable.viewDatas[0].columnOrder,
  };
};

const adaptCreateTable = ({ table, fields, records }) => ({
  name: table.name,
  id: table.id,
  columns: fields.map(i =>
    pick(i, ['id', 'name', 'typeOptions', 'fieldTypeId']),
  ),
  records: records.map(i => pick(i, ['id'])),
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
    console.log('CMON WHY IS ADAPTEDD DATA', adaptedData);
    ctx.body = adaptedData;
  },

  async delete(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    await sequelize.transaction(() => tblController.delete(params.tableId));
    ctx.body = { message: 'success' };
  },
};
