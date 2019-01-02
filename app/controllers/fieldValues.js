const { fieldValues } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};

async function upsertGenericFieldValue(
  { recordId, fieldId, value },
  fieldProps,
) {
  console.log(recordId);
  return fieldValues.upsert(
    {
      recordId,
      fieldId,
      [fieldProps.valueName]: value,
    },
    {
      fields: [fieldProps.valueName],
    },
  );
}
module.exports = {
  updateFieldValue(params) {
    return fieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  },
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
      attributes: ['recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
};
