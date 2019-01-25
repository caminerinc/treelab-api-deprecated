const { fieldValues, multipleAttachmentValues, foreignKeyValues, sequelize } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
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
function deleteMultipleAttachment({ itemId: id }) {
  return multipleAttachmentValues.destroy({
    where: { id },
  });
}
async function deleteForeignKeyValue({ recordId, fieldId, itemId }, fieldProps) {
  const {
    [fieldProps.valueName]: [{ fieldValueId, symmetricFieldValueId }],
  } = await fieldValues.findOne({
    where: {
      recordId,
      fieldId,
    },
    attributes: [],
    include: [
      {
        model: foreignKeyValues,
        attributes: ['fieldValueId', 'symmetricFieldValueId'],
        as: fieldProps.valueName,
        include: [
          {
            where: {
              recordId: itemId,
            },
            model: fieldValues,
            attributes: [],
            as: 'symFldV',
          },
        ],
      },
    ],
  });
  return await foreignKeyValues.destroy({
    where: {
      fieldValueId,
      symmetricFieldValueId,
    },
  });
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

  createArrayValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createValue = CREATE_MAP[fieldProps.name];
    return createValue(params);
  },

  findFieldValue(recordId, fieldId) {
    return fieldValues.findOne({ where: { recordId, fieldId } });
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

  deleteArrayValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const deleteValue = DELETE_ARRAY_MAP[fieldProps.name];
    return deleteValue(params, fieldProps);
  },

  async bulkCopyFieldValue({ sourceColumnConfigs, sourceCellValues2dArray, tableId }) {
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
            const fieldValueResult = await findOrCreateFieldValue(recordResult.id, fieldResult.fieldId);
            await createArrayValue({
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
