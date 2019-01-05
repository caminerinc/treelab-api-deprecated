const { fieldValues, multipleAttachmentValues } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
};

async function createMultipleAttachment({ fieldValueId, value }) {
  const result = await multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
  return result;
}

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};

async function upsertGenericFieldValue(params, fieldProps) {
  await fieldValues.upsert(
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

  async upsertFieldValue(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const option = UPSERT_MAP[fieldProps.name];
    return await option(params, fieldProps);
  },

  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['id', 'recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },

  async createArrayType(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_MAP[fieldProps.name];
    return await createOption(params);
  },

  async deleteFieldValue({ recordId, fieldId }) {
    return await fieldValues.destroy({
      where: { recordId, fieldId },
    });
  },
};
