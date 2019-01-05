const { pick } = require('lodash');
const { sequelize } = require('../models');
const {
  fields,
  numberTypes,
  typeOptions,
  foreignKeyTypes,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
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

const DELETE_MAP = {
  text: deleteTextField,
  number: deleteNumberField,
  foreignKey: deleteForeignField,
  multipleAttachment: deleteMultipleAttachmentField,
};
async function deleteTextField({ fieldId }) {
  return await fields.destroy({
    where: { id: fieldId },
    cascade: true,
  });
}
async function deleteNumberField({ fieldId, fieldProps }) {
  const typeOption = await fields.findOne({
    where: {
      id: fieldId,
    },
    attributes: ['typeOptionId'],
    include: [
      {
        model: typeOptions,
        as: 'typeOptions',
        include: [
          {
            model: numberTypes,
            attributes: ['id'],
            as: fieldProps.typeName,
          },
        ],
      },
    ],
    raw: true,
  });
  return await numberTypes.destroy({
    where: { id: typeOption[`typeOptions.${fieldProps.typeName}.id`] },
    cascade: true,
  });
}
async function deleteForeignField({ fieldId, fieldProps }) {
  const typeOption = await fields.findOne({
    where: {
      id: fieldId,
    },
    attributes: ['typeOptionId'],
    include: [
      {
        model: typeOptions,
        as: 'typeOptions',
        include: [
          {
            model: foreignKeyTypes,
            attributes: ['id'],
            as: fieldProps.typeName,
          },
        ],
      },
    ],
    raw: true,
  });
  return await foreignKeyTypes.destroy({
    where: { id: typeOption[`typeOptions.${fieldProps.typeName}.id`] },
    cascade: true,
  });
}
async function deleteMultipleAttachmentField({ fieldId }) {
  return await fields.destroy({
    where: { id: fieldId },
    cascade: true,
  });
}

module.exports = {
  async createField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['tableId', 'name', 'fieldTypeId']);

    return await createOption(fieldParams, params.DB.typeOptions, fieldProps);
  },
  async deleteField({ fieldId, fieldTypeId }) {
    const fieldProps = FIELD_TYPES[fieldTypeId];
    const deleteOption = DELETE_MAP[fieldProps.name];

    return await deleteOption({ fieldId, fieldProps });
  },
};
