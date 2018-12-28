const pick = require('lodash').pick;
const helperUtil = require('../util').helper;
const tablesController = require('../controllers').tables;
const { FIELD_TYPES } = require('../constants').fieldTypes;
const adaptTables = tables => {
  return {
    tableSchemas: tables.map(table => ({
      ...pick(table, ['id', 'name']),
      columns: table.fields.map(field => {
        let other = {
          type: FIELD_TYPES[field.fieldTypeId].name,
        };
        if (field.typeOptions) {
          if (
            field.typeOptions[FIELD_TYPES[field.fieldTypeId].typeModel.name]
          ) {
            other.typeOptions = pick(
              field.typeOptions[FIELD_TYPES[field.fieldTypeId].typeModel.name],
              ['format', 'precision', 'negative'],
            );
          }
        }
        return {
          ...pick(field, ['id', 'name']),
          ...other,
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
    cellAccum[fieldValue.fieldId] =
      fieldValue[
        FIELD_TYPES[fieldValue.field.dataValues.fieldTypeId].valueModel.name
      ].value ||
      fieldValue[
        FIELD_TYPES[fieldValue.field.dataValues.fieldTypeId].valueModel.name
      ];
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
