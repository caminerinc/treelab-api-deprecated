const { pick } = require('lodash');
const fldQueries = require('../queries/fields');
const posController = require('../controllers/positions');
const fldValController = require('../controllers/fieldValues');
const { POSITION_TYPE } = require('../constants/app');
const { checkKeyExists, trim } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');
const { checkField, checkType, getByName } = require('../util/fieldTypes');

const checkNameWithinTable = async (tableId, name) => {
  const tblController = require('../controllers/tables');
  await tblController.checkTable(tableId);

  const field = await fldQueries.getFieldByTableAndName(tableId, name);
  if (field) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
};

const createWithPosition = async params => {
  const field = await fldQueries.create(params);
  await posController.create({
    parentId: params.tableId,
    siblingId: field.id,
    type: POSITION_TYPE.FIELD,
  });

  return field;
};

const getUniqueFieldName = async (tableId, fieldName, index = 0) => {
  let newFieldName = index ? `${fieldName} (${index})` : fieldName;
  const field = await fldQueries.getFieldByTableAndName(tableId, newFieldName);
  if (field) {
    index++;
    return await getUniqueFieldName(tableId, fieldName, index);
  }
  return newFieldName;
};

const createReferenceField = async (params, createdField) => {
  checkKeyExists(params, 'typeOptions');
  checkKeyExists(params.typeOptions, 'referenceTableId', 'relationship');
  const tblCtrl = require('../controllers/tables');
  const currentTable = await tblCtrl.getEasyTable(params.tableId);
  const fieldName = await getUniqueFieldName(
    params.typeOptions.referenceTableId,
    currentTable.name,
  );

  // Create Reference field using the newly created field
  const referenceField = await createWithPosition({
    name: fieldName,
    tableId: params.typeOptions.referenceTableId,
    fieldTypeId: await checkType('reference'),
    typeOptions: {
      relationship: params.typeOptions.relationship,
      referenceTableId: createdField.tableId,
      referenceColumnId: createdField.id,
    },
  });

  // Update newly created field with referenceTableId
  await fldQueries.update(
    {
      typeOptions: {
        relationship: params.typeOptions.relationship,
        referenceTableId: params.typeOptions.referenceTableId,
        referenceColumnId: referenceField.id,
      },
    },
    createdField.id,
  );

  // Return the referenceColumnId so that front end can also receive
  return { ...referenceField.toJSON(), type: 'reference' };
};

const convertFieldValues = async params => {
  //TODO number can not be saved as string in jsonb field
  if (params.field.types.name === params.type) {
    if (
      params.type === 'number' &&
      params.field.typeOptions.precision !== params.typeOptions.precision
    ) {
      return await changeToNumber(params);
    } else {
      return;
    }
  } else {
    const targetTypes = await getByName(params.type);
    if (params.field.types.isPrimitive) {
      if (params.type === 'number') {
        return await changeToNumber(params);
      } else if (targetTypes.isPrimitive) {
        return;
      }
    }
  }
  error(Status.Forbidden, ECodes.UNSUPPORTED_TYPE_CONVERSION, params.type);
};

const changeToNumber = async params => {
  checkKeyExists(params, 'typeOptions');
  checkKeyExists(params.typeOptions, 'precision');
  let values = await fldValController.getValuesByFieldId(params.fieldId);
  let precision = parseInt(params.typeOptions.precision);
  precision = isNaN(precision) || precision === null ? 1 : precision;
  values = values.map(i => {
    const _value =
      i.value !== null
        ? parseFloat(i.value.toString().replace(/[^0-9\+.-]/g, '')).toFixed(
            precision,
          )
        : null;
    return {
      id: i.id,
      value: isNaN(_value) ? null : _value,
    };
  });
  return await fldValController.bulkUpdateToNumber(params.fieldId, values);
};

module.exports = {
  async checkFieldByTableAndName(tableId, name) {
    const field = await fldQueries.getFieldByTableAndName(tableId, name);
    if (field) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
  },

  async create(params) {
    const result = { data: {}, external: {} };
    params.name = trim(params.name);
    if (params.name === '') error(Status.Forbidden, ECodes.FIELD_NAME_EMPTY);
    await checkNameWithinTable(params.tableId, params.name);

    const fieldParams = pick(params, ['id', 'tableId', 'name', 'typeOptions']);
    fieldParams.fieldTypeId = await checkType(params.type);
    const field = await createWithPosition(fieldParams);

    if (params.type === 'reference') {
      result.external = await createReferenceField(params, field);
      field.typeOptions.referenceColumnId = result.external.id;
    }
    result.data = { ...field.toJSON(), type: params.type };
    return result;
  },

  async update(params) {
    // TODO handle reference fieldTypes
    const field = await checkField(params.fieldId);
    params.name = trim(params.name);
    if (params.name === '') error(Status.Forbidden, ECodes.FIELD_NAME_EMPTY);
    const updatedFields = pick(params, ['typeOptions', 'name']);
    updatedFields.fieldTypeId = await checkType(params.type);
    if (params.name === field.name) {
      delete updatedFields.name;
    } else {
      const _field = await fldQueries.getFieldByTableAndName(
        field.tableId,
        params.name,
      );
      if (_field) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
    }
    params.field = field;
    await convertFieldValues(params);
    return await fldQueries.update(updatedFields, params.fieldId);
  },

  async updateWidth({ fieldId: id, width }) {
    await checkField(id);
    return fldQueries.updateWidth(id, width);
  },

  async delete(id) {
    // TODO handle reference fieldTypes
    // TODO can not delete first column
    await checkField(id);
    await fldQueries.destroy(id);
  },

  getById(id) {
    return fldQueries.getById(id);
  },

  bulkCreate(records) {
    return fldQueries.bulkCreate(records);
  },
};
