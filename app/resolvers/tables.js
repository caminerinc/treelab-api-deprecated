const { get, pick } = require('lodash');
const { checkKeyExists } = require('../util/helper');
const { getTables } = require('../controllers/tables');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const adaptForeignKey = (fieldValue, fieldProps) => {
  const foreignRecords = fieldValue[fieldProps.valueName].map(
    fieldValues => fieldValues.symFldV.rec.id,
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
      rowsById: getRowsById(table.recs),
    },
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
    ctx.body = adaptTable(ctx.table);
  },
};
