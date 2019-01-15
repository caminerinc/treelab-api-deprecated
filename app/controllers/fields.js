const { pick } = require('lodash');
const {
  fields,
  numberTypes,
  foreignKeyTypes,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const { createPosition } = require('../controllers/positions');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
};

async function createGenericField(fieldParams, options, transact) {
  const field = await fields.create(fieldParams, transact);
  return { fieldId: field.id };
}

async function createNumberOptions(fieldParams, options, transact) {
  checkKeyExists(options, 'format', 'precision', 'negative');
  const field = await fields.create(fieldParams, transact);
  await numberTypes.create(
    {
      ...options,
      fieldId: field.id,
    },
    transact,
  );
  return {
    fieldId: field.id,
  };
}

async function createForeignKey(fieldParams, options, transact) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
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
  await foreignKeyTypes.create(
    {
      relationship: options.relationship,
      foreignTableId: fieldParams.tableId,
      symmetricFieldId: newField.id,
      fieldId: newSymmetricField.id,
    },
    transact,
  );
  return {
    foreignFieldId: newField.id,
    symmetricFieldId: newSymmetricField.id,
  };
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
    return await fields.destroy(
      {
        where: { id: symmetricFieldId.id },
        cascade: true,
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
    async function transactionSteps(t) {
      const transact = { transaction: t };
      const result = await createOption(
        fieldParams,
        params.typeOptions,
        transact,
      );
      if (fieldProps.name === 'foreignKey') {
        await createPosition(
          {
            parentId: params.tableId,
            id: result.foreignFieldId,
            type: 'field',
          },
          transact,
        );
        await createPosition(
          {
            parentId: params.tableId,
            id: result.symmetricFieldId,
            type: 'field',
          },
          transact,
        );
      } else {
        await createPosition(
          {
            parentId: params.tableId,
            id: result.fieldId || result.id,
            type: 'field',
          },
          transact,
        );
      }
      return result;
    }
    return await sequelize.transaction(transactionSteps);
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
