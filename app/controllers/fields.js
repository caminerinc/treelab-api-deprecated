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
  const fromTypes = params.field.types;
  const toTypes = await getByName(params.type);
  if (fromTypes.name === toTypes.name) {
    return;
  } else {
    const values = await fldValController.getValuesByFieldId(params.field.id);
    if (!values.length) return;
    if (fromTypes.isPrimitive && toTypes.name === 'number') {
      return await primeToNumber(params, values);
    } else if (fromTypes.name === 'reference' && toTypes.name === 'text') {
      return await referenceToText(params, values);
    } else if (fromTypes.name === 'multilineText' && toTypes.name === 'text') {
      return await multilineTextToText(params, values);
    } else if (fromTypes.name === 'text' && toTypes.name === 'multilineText') {
      return;
    } else if (fromTypes.name === 'number' && toTypes.isPrimitive) {
      return await numberToPrime(params, values);
    } else {
      error(Status.Forbidden, ECodes.UNSUPPORTED_TYPE_CONVERSION, params.type);
    }
  }
};

const numberToPrime = async (params, values) => {
  values = values.map(i => {
    return {
      id: i.id,
      value:
        i.value !== null
          ? i.value.toFixed(params.field.typeOptions.precision).toString()
          : null,
    };
  });
  return await fldValController.bulkUpdate(params.field.id, values);
};

const multilineTextToText = async (params, values) => {
  values = values.map(i => {
    return {
      id: i.id,
      value: i.value !== null ? i.value.replace(/\\n/g, ' ') : null,
    };
  });
  return await fldValController.bulkUpdate(params.field.id, values);
};

const referenceToText = async (params, values) => {
  const tblController = require('../controllers/tables');
  const primaryFieldId = (await tblController.getPrimaryField(
    params.field.typeOptions.referenceTableId,
  )).id;
  let recordIds = {};
  values.forEach(i => {
    if (i.value) {
      i.value.forEach(j => {
        recordIds[j.referenceRowId] = '';
      });
    }
  });
  const convertValues = await fldValController.getValuesWithRecords(
    primaryFieldId,
    Object.keys(recordIds),
  );
  convertValues.forEach(i => {
    recordIds[i.recordId] = i.value;
  });
  values = values.map(i => {
    return {
      id: i.id,
      value:
        i.value !== null
          ? i.value
              .reduce((s, j) => {
                return (s += recordIds[j.referenceRowId] + ', ');
              }, '')
              .slice(0, -1)
          : null,
    };
  });
  return await fldValController.bulkUpdate(params.field.id, values);
};

const primeToNumber = async (params, values) => {
  checkKeyExists(params, 'typeOptions');
  checkKeyExists(params.typeOptions, 'precision');
  values = values.map(i => {
    const _value =
      i.value !== null
        ? parseFloat(i.value.toString().replace(/[^0-9\+.-]/g, ''))
        : null;
    return {
      id: i.id,
      value: isNaN(_value) ? null : _value,
    };
  });
  return await fldValController.bulkUpdate(params.field.id, values);
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
    const field = await checkField(id);
    if (field.fieldPosition && field.fieldPosition.position === 1)
      error(Status.Forbidden, ECodes.UNDELETABLE_PRIMARY_FIELD);

    if (field.types.name === 'reference') {
      const referenceField = await checkField(
        field.typeOptions.referenceColumnId,
      );
      const updatedFields = {
        fieldTypeId: await checkType('text'),
        typeOptions: null,
      };
      await fldQueries.update(
        updatedFields,
        field.typeOptions.referenceColumnId,
      );
      const _params = { type: 'text', field: referenceField };
      await convertFieldValues(_params);
    }
    await fldQueries.destroy(id);
  },

  getById(id) {
    return fldQueries.getById(id);
  },

  bulkCreate(records) {
    return fldQueries.bulkCreate(records);
  },
};
