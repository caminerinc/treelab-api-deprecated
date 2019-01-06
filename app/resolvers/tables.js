const { get, pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getTables } = require('../controllers/tables');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const adaptTables = tables => {
  return {
    tableSchemas: tables.map(table => ({
      ...pick(table, ['id', 'name']),
      columns: table.fields.map(field => {
        const fieldProps = FIELD_TYPES[field.fieldTypeId];
        const otherProps = {};
        if (field.typeOptions) {
          otherProps.typeOptions = pick(
            get(field, `typeOptions[${fieldProps.typeName}]`),
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
      rowsById: getRowsById(table.records),
    },
    viewDatas: [
      {
        columnOrder: table.fieldPositions,
        rowOrder: table.recordPositions,
      },
    ],
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
    const fieldTypeId = get(fieldValue, 'field.fieldTypeId');
    const fieldProps = fieldTypeId && FIELD_TYPES[fieldTypeId];
    if (!fieldProps)
      throw new Error('field type id does not exist in fieldValue');
    cellAccum[fieldValue.fieldId] = fieldValue[fieldProps.valueName];
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
    ctx.body = adaptTable(ctx.table);
  },
};
