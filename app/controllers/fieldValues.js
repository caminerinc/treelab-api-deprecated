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

function createMultipleAttachment({ fieldValueId, value }) {
  checkKeyExists(value, 'url', 'fileName', 'fileType');
  return multipleAttachmentValues.create({
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
    return await foreignKeyValues.create(
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

  createArrayValue(params) {
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
    let fieldIds = [];
    for (let i = 0; i < sourceColumnConfigs.length; i++) {
      const field = sourceColumnConfigs[i];
      field.tableId = tableId;
      const result = await createField(field);
      if (field.fieldTypeId == 1 || field.fieldTypeId == 2) {
        upsertFieldValue({
          fieldTypeId: field.fieldTypeId,
        });
      }
      if (field.fieldTypeId == 3) {
        fieldIds.push([result.foreignFieldId, result.symmetricFieldId]);
      } else {
        fieldIds.push(result.fieldId);
      }
    }
    for (let i = 0; i < sourceCellValues2dArray.length; i++) {
      const result = await createRecord({ tableId });
    }
    return fieldIds;
  },
};
