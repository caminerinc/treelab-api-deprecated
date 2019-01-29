const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const fieldValues = require('../queries/fieldValues');
const { createField } = require('./fields');
const { createRecord } = require('./records');
const { error, Status, ECodes } = require('../util/error');

const CREATE_MAP = {
  multipleAttachment: createMultipleAttachment,
  foreignKey: createForeignKeyValue,
};

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};

const DELETE_ARRAY_MAP = {
  multipleAttachment: deleteMultipleAttachment,
  foreignKey: deleteForeignKeyValue,
};

function createMultipleAttachment({ fieldValueId, value }) {
  checkKeyExists(value, 'url', 'fileName', 'fileType');
  return fieldValues.createMultipleAttachmentValue({
    fieldValueId,
    ...value,
  });
}

async function createForeignKeyValue(fieldValueId, value) {
  checkKeyExists(value, 'foreignRowId', 'foreignColumnId');
  const { foreignRowId: recordId, foreignColumnId: fieldId } = value;
  const symmetricFieldValue = await fieldValues.findCreateFindFieldValue(
    recordId,
    fieldId,
  );
  return await foreignKeyValues.createForeignKeyValue({
    fieldValueId,
    symmetricFieldValueId: symmetricFieldValue.id,
    name: value.name,
  });
}

function upsertGenericFieldValue(params, valueName) {
  return fieldValues.upsertGenericFieldValue(params, valueName);
}

function deleteMultipleAttachment({ itemId: id }) {
  return fieldValues.destroyMultipleAttachmentValue(id);
}

async function deleteForeignKeyValue({ recordId, fieldId, itemId }, valueName) {
  const forgienFieldValue = await fieldValues.getForeignFieldValue({
    recordId,
    fieldId,
    itemId,
  });
  if (forgienFieldValue) {
    await fieldValues.destroyForeignFieldValue(
      forgienFieldValue[valueName].fieldValueId,
      forgienFieldValue[valueName].symmetricFieldValueId,
    );
  }
  return;
}

module.exports = {
  createFieldValue(params) {
    return fieldValues.create(params);
  },

  upsertFieldValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const upsertValue = UPSERT_MAP[fieldProps.name];
    return upsertValue(params, fieldProps.name);
  },

  async createArrayValue(params) {
    const fieldValue = await fieldValues.findOrCreateFieldValue(
      params.recordId,
      params.fieldId,
    );
    params.fieldValueId = fieldValue.id;
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createValue = CREATE_MAP[fieldProps.name];
    return await createValue(params);
  },

  findFieldValue(recordId, fieldId) {
    return fieldValues.findOne({ where: { recordId, fieldId } });
  },

  deleteFieldValue({ recordId, fieldId }) {
    return fieldValues.destroy({
      where: { recordId, fieldId },
    });
  },

  deleteArrayValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const deleteValue = DELETE_ARRAY_MAP[fieldProps.name];
    return deleteValue(params, fieldProps);
  },

  async bulkCopyFieldValue({
    sourceColumnConfigs,
    sourceCellValues2dArray,
    tableId,
  }) {
    for (let i = 0; i < sourceColumnConfigs.length; i++) {
      const field = sourceColumnConfigs[i];
      field.tableId = tableId;
      const fieldResult = await createField(field);
      for (let j = 0; j < sourceCellValues2dArray.length; j++) {
        const values = sourceCellValues2dArray[j][i];
        const recordResult = await createRecord({ tableId });
        if (field.fieldTypeId == 1 || field.fieldTypeId == 2) {
          module.exports.upsertFieldValue({
            fieldTypeId: field.fieldTypeId,
            recordId: recordResult.id,
            fieldId: fieldResult.fieldId,
            value: values,
          });
        } else if (field.fieldTypeId == 3) {
          for (let k = 0; k < values.length; k++) {
            const fieldValueResult = await fieldValues.findOrCreateFieldValue(
              recordResult.id,
              fieldResult.foreignFieldId,
            );
            await module.exports.createArrayValue({
              fieldTypeId: field.fieldTypeId,
              fieldValueId: fieldValueResult.id,
              value: {
                name: values[k].foreignRowDisplayName,
                foreignRowId: values[k].foreignRowId,
                foreignColumnId: fieldResult.symmetricFieldId,
              },
            });
          }
        } else if (field.fieldTypeId == 4) {
          for (let k = 0; k < values.length; k++) {
            const fieldValueResult = await fieldValues.findOrCreateFieldValue(
              recordResult.id,
              fieldResult.fieldId,
            );
            await module.exports.createArrayValue({
              fieldTypeId: field.fieldTypeId,
              fieldValueId: fieldValueResult.id,
              value: values[k],
            });
          }
        } else {
          error(Status.Forbidden, ECodes.UNSURPPORTED_FIELD_TYPE);
        }
      }
    }
  },
};
