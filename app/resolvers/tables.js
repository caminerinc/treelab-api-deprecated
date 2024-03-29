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

const adaptTable = table => {
  let result = {
    tableDatas: { id: '', rowsById: {} },
    viewDatas: [{ columnOrder: [], rowOrder: [] }],
  };
  let lastFieldId = '';
  let recordIds = {};
  for (let i = 0; i < table.length; i++) {
    const value = table[i];
    if (!result.tableDatas.id) result.tableDatas.id = value.id;
    if (!result.tableDatas.rowsById[value['Records.id']])
      result.tableDatas.rowsById[value['Records.id']] = {
        id: value['Records.id'],
        cellValuesByColumnId: {},
      };
    if (
      value['FieldValues.value'] !== null &&
      value['FieldValues.value'] !== ''
    ) {
      result.tableDatas.rowsById[value['Records.id']].cellValuesByColumnId[
        value['Fields.id']
      ] = value['FieldValues.value'];
    }
    if (value['Fields.id'] !== lastFieldId) {
      result.viewDatas[0].columnOrder.push({
        id: value['Fields.id'],
        width: value['Fields.width'],
      });
      lastFieldId = value['Fields.id'];
    }
    if (!recordIds[value['Records.id']]) {
      result.viewDatas[0].rowOrder.push({
        id: value['Records.id'],
      });
      recordIds[value['Records.id']] = 1;
    }
  }
  return result;
};

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
      columns: fields.map(i =>
        pick(i.data, ['id', 'name', 'typeOptions', 'type']),
      ),
    },
  ],
});

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
    socketIo.sync({
      op: 'createTable',
      body: ctx.body,
      params: { baseId: params.basId },
    });
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
    const table = (await tblController.getOne(params.tableId))[0];
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
    if (!params.tables.length) return (ctx.body = { tableSchemas: [] });
    const result = await sequelize.transaction(() =>
      tblController.bulkTables(params.baseId, params.tables),
    );

    ctx.body = result;
    return result;
  },
};
