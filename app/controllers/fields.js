const { pick } = require('lodash');
const {
  fields,
  numberTypes,
  foreignKeyTypes,
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

const DELETE_MAP = {
  text: deleteGenericField,
  number: deleteGenericField,
  foreignKey: deleteForeignField,
  multipleAttachment: deleteGenericField,
};
async function deleteGenericField({ fieldId }) {
  return await fields.destroy({
    where: { id: fieldId },
    cascade: true,
  });
}
async function deleteForeignField({ fieldId, fieldProps }) {
  async function transactionSteps(t) {
    const transact = { transaction: t };
    const symmetricFieldId = await fields.findOne(
      {
        where: {
          id: fieldId,
        },
        attributes: [
          [sequelize.col(`${fieldProps.typeName}.symmetricFieldId`), 'id'],
        ],
        include: [
          {
            model: foreignKeyTypes,
            attributes: [],
            as: fieldProps.typeName,
          },
        ],
        raw: true,
      },
      transact,
    );
    await fields.destroy(
      {
        where: { id: fieldId },
        cascade: true,
      },
      transact,
    );
    return await fields.update(
      {
        fieldTypeId: 1,
      },
      {
        where: {
          id: symmetricFieldId.id,
        },
        transaction: t,
      },
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

  async findFieldType({ fieldId: id }) {
    return await fields.findOne({
      where: { id },
      attributes: [['id', 'fieldId'], 'fieldTypeId'],
      raw: true,
    });
  },
  async deleteField({ fieldId, fieldTypeId }) {
    const fieldProps = FIELD_TYPES[fieldTypeId];
    const deleteOption = DELETE_MAP[fieldProps.name];

    return await deleteOption({ fieldId, fieldProps });
  },
};
