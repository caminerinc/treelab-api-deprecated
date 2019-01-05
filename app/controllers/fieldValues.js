const {
  fieldValues,
  multipleAttachmentValues,
  foreignKeyValues,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { sequelize } = require('../models');
const { checkKeyExists } = require('../util/helper');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
  foreignKey: createForeignKeyValue,
};

async function createMultipleAttachment({ fieldValueId, value }) {
  return await multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });
}
async function createForeignKeyValue({ fieldValueId, value }) {
  checkKeyExists(value, 'symmetricFieldValueId', 'name');

  const foreignKey = await foreignKeyValues.create({
    fieldValueId,
    symmetricFieldValueId: value.symmetricFieldValueId,
    name: value.name,
  });
  // async function transactionSteps(t) {
  //   const transact = { transaction: t };
  //   const foreignKey = await foreignKeyValues.create(
  //     {
  //       fieldValueId,
  //       symmetricFieldValueId: value.symmetricFieldValueId,
  //       name: value.name,
  //     },
  //     transact,
  //   );
  //   const symmetricFieldKeyName = await fieldValues.findOne(
  //     {
  //       attributes: ['id', 'textValue'],
  //       where: { id: value.symmetricFieldValueId },
  //     },
  //     transact,
  //   );
  //   const symmetricFieldKey = await foreignKeyValues.create(
  //     {
  //       fieldValueId: value.symmetricFieldValueId,
  //       symmetricFieldValueId: fieldValueId,
  //       name: symmetricFieldKeyName.textValue,
  //     },
  //     transact,
  //   );
  // }
  // return await sequelize.transaction(transactionSteps);
}

const UPSERT_MAP = {
  text: upsertGenericFieldValue,
  number: upsertGenericFieldValue,
};

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
  async findOrCreateFieldValue(recordId, fieldId) {
    return await fieldValues.findCreateFind({
      where: { recordId, fieldId },
      defaults: {
        recordId,
        fieldId,
      },

  async deleteFieldValue({ recordId, fieldId }) {
    return await fieldValues.destroy({
      where: { recordId, fieldId },
    });
  },
};
