const { pick } = require('lodash');
const {
  numberTypes,
  foreignKeyTypes,
  fields,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
};

async function createGenericField(fieldParams) {
  return fields.create(fieldParams);
}

async function createNumberOptions(fieldParams, options) {
  checkKeyExists(options, 'format', 'precision', 'negative');
  const field = await fields.create(fieldParams);
  return await numberTypes.create({
    ...options,
    fieldId: field.id,
  });
}

async function createForeignKey(fieldParams, options) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
  async function transactionSteps(t) {
    const transact = { transaction: t };
    const newField = await fields.create(fieldParams, transact);
    const newSymmetricField = await fields.create(
      {
        tableId: options.foreignTableId,
        name: 'Link',
        fieldTypeId: 3,
      },
      transact,
    );
    await foreignKeyTypes.create(
      {
        ...options,
        symmetricFieldId: newSymmetricField.id,
        fieldId: newField.id,
      },
      transact,
    );
    return await foreignKeyTypes.create(
      {
        relationship: options.relationship,
        foreignTableId: fieldParams.tableId,
        symmetricFieldId: newField.id,
        fieldId: newSymmetricField.id,
      },
      transact,
    );
  }
  return await sequelize.transaction(transactionSteps);
}

module.exports = {
  async createField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['tableId', 'name', 'fieldTypeId']);
    return await createOption(fieldParams, params.typeOptions);
  },
};
