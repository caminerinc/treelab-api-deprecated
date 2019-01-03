const {
  fieldValues,
  multipleAttachmentValues,
  foreignKeyValues,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
  foreignKey: createForeignKey,
};
async function createMultipleAttachment({ fieldValueId, value }) {
  return multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
}
async function createForeignKey({ fieldValueId, symmetricFieldValueId, name }) {
  async function transactionSteps() {
    const transact = { transaction: t };
    const newField = await foreignKeyValues.create(
      {
        fieldValueId,
        symmetricFieldValueId,
        name,
      },
      transact,
    );
  }
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
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_MAP[fieldProps.name];

    return await createOption(params);
  },
};
