const { get, pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getTables, createTable, getTable } = require('../controllers/tables');
const { getBase } = require('../controllers/bases');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');

const adaptForeignKey = (fieldValue, fieldProps) => {
  const foreignRecords = fieldValue[fieldProps.valueName].map(fieldValues =>
    fieldValues.symFldV ? fieldValues.symFldV.rec.id : null,
  );
  const symmetricRecords = fieldValue[fieldProps.symmetricName].map(
    fieldValues => fieldValues.fldV.rec.id,
  );

  return foreignRecords.concat(symmetricRecords);
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

const adaptTable = table => {
  return {
    tableDatas: {
      ...pick(table, ['id']),
      rowsById: getRowsById(table.recs),
    },
    viewDatas: [
      {
        columnOrder: table.positions
          .filter(i => {
            if (i.type === 'field') return i;
          })
          .map(i => {
            return { id: i.id, position: i.position };
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

const getRowsById = records =>
  records.reduce((rowAccum, record) => {
    rowAccum[record.id] = {
      ...pick(record, ['id', 'createdAt']),
      cellValuesByColumnId: getCellValuesByColumnId(record.fldVs),
    };
    return rowAccum;
  }, {});

const getCellValuesByColumnId = fieldValues =>
  fieldValues.reduce((cellAccum, fieldValue) => {
    const fieldTypeId = get(fieldValue.dataValues, 'fld.fieldTypeId');
    const fieldProps = fieldTypeId && FIELD_TYPES[fieldTypeId];
    if (!fieldProps)
      throw new Error('field type id does not exist in fieldValue');

    const adaptData = ADAPT_MAP[fieldProps.name];
    if (adaptData) {
      cellAccum[fieldValue.fieldId] = adaptData(fieldValue, fieldProps);
    } else {
      cellAccum[fieldValue.fieldId] = fieldValue[fieldProps.valueName];
    }

    return cellAccum;
  }, {});

module.exports = {
  async resolveGetTables(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'baseId');
    const tables = await getTables(params.baseId);
    ctx.body = adaptTables(tables);
  },

  async resolveGetTable(ctx) {
    const params = ctx.params;
    checkKeyExists(params, 'tableId');
    const table = await getTable(params.tableId);
    if (!table) {
      ctx.status = 400;
      return (ctx.body = { error: 'table does not exist' });
    }
    ctx.body = adaptTable(table);
  },

  async resolveCreateTable(ctx) {
    const params = ctx.request.body;
    checkKeyExists(params, 'baseId', 'name');
    const base = await getBase(params.baseId);
    if (!base) {
      ctx.status = 400;
      return (ctx.body = { error: 'base does not exist' });
    }
    const result = await createTable(params);
    ctx.body = result.table;
    socketIo.sync({
      op: 'createTable',
      body: result,
    });
  },
};
