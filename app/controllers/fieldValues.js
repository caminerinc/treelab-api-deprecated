const {
  fieldValues,
  multipleAttachmentValues,
  foreignKeyValues,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { sequelize } = require('../models');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
  foreignKey: createForeignKeyValue,
};
async function createMultipleAttachment({ fieldValueId, value }) {
  return multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
}
async function createForeignKeyValue({ fieldValueId, value }) {
  async function transactionSteps(t) {
    const transact = { transaction: t };
    const foreignKey = await foreignKeyValues.create(
      {
        fieldValueId,
        symmetricFieldValueId: value.symmetricFieldValueId,
        name: value.name,
      },
      transact,
    );
    const symmetricFieldKeyName = await fieldValues.findOne(
      {
        attributes: ['id', 'textValue'],
        where: { id: value.symmetricFieldValueId },
      },
      transact,
    );
    const symmetricFieldKey = await foreignKeyValues.create(
      {
        fieldValueId: value.symmetricFieldValueId,
        symmetricFieldValueId: fieldValueId,
        name: symmetricFieldKeyName.textValue,
      },
      transact,
    );
  }
  return await sequelize.transaction(transactionSteps);
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
