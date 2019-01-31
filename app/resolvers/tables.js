const { get, pick, forEach, map } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const tables = require('../controllers/tables');
const { getPrimaryFieldId } = require('../controllers/positions');
const fieldValues = require('../controllers/fieldValues');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');
const { error, Status, ECodes } = require('../util/error');
const { sequelize } = require('../models/index');

const adaptForeignKey = async (fieldValue, fieldProps) => {
  let foreignRecords = [];
  for (const foreignKeyValues of fieldValue[fieldProps.valueName]) {
    const fgn = foreignKeyValues.symFldV || foreignKeyValues.fldV;
    if (fgn) {
      const primaryFieldId = await getPrimaryFieldId(fgn.rec.tableId);
      const foreignDisplayName = await fieldValues.findFieldValue(
        fgn.rec.dataValues.id,
        primaryFieldId.id,
      );
      foreignRecords.push({
        foreignRowId: fgn.dataValues.rec.id,
        foreignDisplayName: foreignDisplayName
          ? foreignDisplayName.dataValues.textValue ||
            foreignDisplayName.dataValues.numberValue
          : null,
      });
    }
  }
  return foreignRecords;
};

const ADAPT_MAP = {
  foreignKey: adaptForeignKey,
};

const adaptTables = tables => {
  return {
    tableSchemas: tables.map(table => ({
      ...pick(table, ['id', 'name']),
      columns: table.flds.map(field => {
        const fieldProps = FIELD_TYPES[field.fieldTypeId];
        const otherProps = {};
        if (fieldProps.isTypeOptionsRequired) {
          otherProps.typeOptions = pick(
            get(field, fieldProps.typeName),
            fieldProps.typeProps,
          );
        }
        return {
          ...pick(field, ['id', 'name']),
          ...otherProps,
          type: fieldProps.name,
        };
      }),
    })),
  };
};

const adaptTable = async table => {
  return {
    tableDatas: {
      ...pick(table, ['id']),
      rowsById: await getRowsById(table.recs),
    },
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
  };
};

const getRowsById = async records => {
  let rowAccum = {};
  for (const record of records) {
    rowAccum[record.id] = {
      ...pick(record, ['id', 'createdAt']),
      cellValuesByColumnId: await getCellValuesByColumnId(record.fldVs),
    };
  }
  return rowAccum;
};

const getCellValuesByColumnId = async fieldValues => {
  let cellAccum = {};
  for (const fieldValue of fieldValues) {
    const fieldTypeId = get(fieldValue.dataValues, 'fld.fieldTypeId');
    const fieldProps = fieldTypeId && FIELD_TYPES[fieldTypeId];
    if (!fieldProps)
      error(Status.Forbidden, ECodes.UNSURPPORTED_FIELD_TYPE, fieldTypeId);
    const adaptData = ADAPT_MAP[fieldProps.name];
    if (adaptData) {
      cellAccum[fieldValue.fieldId] = await adaptData(fieldValue, fieldProps);
    } else {
      cellAccum[fieldValue.fieldId] = fieldValue[fieldProps.valueName];
    }
  }
  return cellAccum;
};

const adaptGetRowsMatchingName = async (table, tableSchema) => {
  table = await adaptTable(table);
  let result = {
    rowResults: [],
    columnsById: {},
    columnOrder: table.viewDatas[0].columnOrder,
  };
  for (const i in table.viewDatas[0].rowOrder) {
    const rowId = table.viewDatas[0].rowOrder[i].id;
    result.rowResults.push(table.tableDatas.rowsById[rowId]);
  }
  tableSchema.forEach(i => {
    result.columnsById[i.id] = {
      id: i.id,
      name: i.name,
      type: FIELD_TYPES[i.fieldTypeId].name,
      typeOptions: i.numberTypes || i.foreignKeyTypes,
    };
  });
  return result;
};

module.exports = {
  async resolveGetTables(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'baseId');
    const tablesResult = await tables.getTables(params.baseId);
    ctx.body = adaptTables(tablesResult);
  },

  async resolveGetTable(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const table = await tables.getTable(params.tableId);
    if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);
    ctx.body = await adaptTable(table);
  },

  async resolveCreateTable(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'name');
    const result = await sequelize.transaction(() =>
      tables.createTable(params),
    );
    result.fields = result.fields.map(i =>
      Object.assign({}, i, {
        fieldTypeName: FIELD_TYPES[i.fieldTypeId].name,
      }),
    );
    ctx.body = result;
    socketIo.sync({ op: 'createTable', body: result });
  },

  async resolveDeleteTable(ctx) {
    const params = ctx.params;
    await sequelize.transaction(() => tables.deleteTable(params.tableId));
    ctx.body = { message: 'success' };
  },

  async resolveGetRowsMatchingName(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const { table, tableSchema } = await tables.getRowsMatchingName(
      params.tableId,
    );
    ctx.body = await adaptGetRowsMatchingName(table, tableSchema);
  },
};
