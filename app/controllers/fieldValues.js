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
  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['id', 'recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
  async createArrayType(params) {
    const fieldProps = FIELD_TYPES[params.typeId];
    const createOption = TYPE_MAP[fieldProps.name];

    return await createOption(params);
  },
};
