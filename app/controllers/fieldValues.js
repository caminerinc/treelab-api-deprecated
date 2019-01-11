const {
  fieldValues,
  multipleAttachmentValues,
  foreignKeyValues,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');

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
async function deleteMultipleAttachment({ itemId: id }) {
  return multipleAttachmentValues.destroy({
    where: { id },
  });
}
async function deleteForeignKeyValue(
  { recordId, fieldId, itemId },
  fieldProps,
) {
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
    const createValue = DELETE_ARRAY_MAP[fieldProps.name];
    return createValue(params, fieldProps);
  },
};
