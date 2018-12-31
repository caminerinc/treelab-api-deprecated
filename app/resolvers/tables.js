const { get, pick } = require('lodash');
const helperUtil = require('../util').helper;
const tablesController = require('../controllers').tables;
const { FIELD_TYPES } = require('../constants').fieldTypes;

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
  async getTables(ctx) {
    const params = ctx.params;
    helperUtil.checkKeyExists(params, 'baseId');
    const tables = await tablesController.findTables(params.baseId);
    ctx.body = adaptTables(tables);
  },

  async getTable(ctx) {
    ctx.body = adaptTable(ctx.table);
  },
};
