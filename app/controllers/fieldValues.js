const { fieldValues, multipleAttachmentValues } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
};
async function createMultipleAttachment({ fieldValueId, value }) {
  return multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
}

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};
async function upsertGenericFieldValue(params, fieldProps) {
  const fieldValue = await module.exports.getFieldValue(
    params.recordId,
    params.fieldId,
  );
  if (!fieldValue) {
    await fieldValues.create({
      [fieldProps.valueName]: params.value,
      recordId: params.recordId,
      fieldId: params.fieldId,
    });
  } else {
    await fieldValues.update(
      { [fieldProps.valueName]: params.value },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  }
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
};
