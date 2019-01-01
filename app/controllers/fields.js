const { pick } = require('lodash');
const { sequelize } = require('../models');
const {
  numberTypes,
  foreignKeyTypes,
  typeOptions,
  fields,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
};

async function createGenericField(fieldParams) {
  return fields.create(fieldParams);
}

async function createNumberOptions(fieldParams, options, fieldProps) {
  const newNumberType = await numberTypes.create(options);
  const typeOptionProps = { [fieldProps.typeFK]: newNumberType.id };

  const option = await typeOptions.create(typeOptionProps);
  fieldParams.typeOptionId = option.id;

  return fields.create(fieldParams);
}

async function createForeignKey(fieldParams, options, fieldProps) {
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

    const newForeignKeyType = await foreignKeyTypes.create(
      {
        ...options,
        symmetricFieldId: newSymmetricField.id,
      },
      transact,
    );
    const newSymmetricForeignKeyType = await foreignKeyTypes.create(
      {
        relationship: options.relationship,
        foreignTableId: fieldParams.tableId,
        symmetricFieldId: newField.id,
      },
      transact,
    );

    const newTypeOption = await typeOptions.create(
      { [fieldProps.typeFK]: newForeignKeyType.id },
      transact,
    );
    const newSymmetricTypeOption = await typeOptions.create(
      {
        [fieldProps.typeFK]: newSymmetricForeignKeyType.id,
      },
      transact,
    );

    await newField.update({ typeOptionId: newTypeOption.id }, transact);
    await newSymmetricField.update(
      { typeOptionId: newSymmetricTypeOption.id },
      transact,
    );
  }

  return await sequelize.transaction(transactionSteps);
}

module.exports = {
  async dbCreateField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['tableId', 'name', 'fieldTypeId']);

    return await createOption(fieldParams, params.typeOptions, fieldProps);
  },
};
