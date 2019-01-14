const {
  fieldValues,
  multipleAttachmentValues,
  foreignKeyValues,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const { createField } = require('./fields');
const { createRecord } = require('./records');

const CREATE_MAP = {
  multipleAttachment: createMultipleAttachment,
  foreignKey: createForeignKeyValue,
};

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};

async function createMultipleAttachment({ fieldValueId, value }) {
  checkKeyExists(value, 'url', 'fileName', 'fileType');
  return await multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
}

function createForeignKeyValue({ fieldValueId, value }) {
  checkKeyExists(value, 'foreignRowId', 'foreignColumnId');
  async function transactionSteps(t) {
    const transact = { transaction: t };
    const { foreignRowId: recordId, foreignColumnId: fieldId } = value;
    const symmetricFieldValue = await fieldValues
      .findCreateFind({ where: { recordId, fieldId } }, transact)
      .spread(fieldValue => fieldValue);
    await foreignKeyValues.create(
      {
        fieldValueId,
        symmetricFieldValueId: symmetricFieldValue.id,
        name: value.name,
      },
      transact,
    );
  }

  return sequelize.transaction(transactionSteps);
}

async function upsertGenericFieldValue(params, fieldProps) {
  return await fieldValues.upsert(
    {
      recordId: params.recordId,
      fieldId: params.fieldId,
      [fieldProps.valueName]: params.value,
    },
    {
      fields: [fieldProps.valueName],
    },
  );
}

module.exports = {
  createFieldValue(params) {
    return fieldValues.create(params);
  },

  upsertFieldValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const upsertValue = UPSERT_MAP[fieldProps.name];
    return upsertValue(params, fieldProps);
  },

  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['id', 'recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },

  createArrayType(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createValue = CREATE_MAP[fieldProps.name];
    return createValue(params);
  },

  findOrCreateFieldValue(recordId, fieldId) {
    return fieldValues
      .findOrCreate({
        where: { recordId, fieldId },
        defaults: { recordId, fieldId },
      })
      .spread(fieldValue => fieldValue);
  },

  deleteFieldValue({ recordId, fieldId }) {
    return fieldValues.destroy({
      where: { recordId, fieldId },
    });
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
            const fieldValueResult = await module.exports.findOrCreateFieldValue(
              recordResult.id,
              fieldResult.foreignFieldId,
            );
            await module.exports.createArrayType({
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
            const fieldValueResult = await findOrCreateFieldValue(
              recordResult.id,
              fieldResult.fieldId,
            );
            await createArrayType({
              fieldTypeId: field.fieldTypeId,
              fieldValueId: fieldValueResult.id,
              value: values[k],
            });
          }
        } else {
          throw new Error('unsupported fieldType');
        }
      }
    }
  },
};
