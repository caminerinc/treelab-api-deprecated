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

async function createGenericField({ fieldParams, isTransaction }) {
  const field = await fields.create(fieldParams, isTransaction);

  return {
    fieldId: field.id,
  };
}

async function createNumberOptions({ fieldParams, options, isTransaction }) {
  checkKeyExists(options, 'format', 'precision', 'negative');
  const field = await fields.create(fieldParams, isTransaction);
  await numberTypes.create(
    {
      ...options,
      fieldId: field.id,
    },
    isTransaction,
  );
  return {
    fieldId: field.id,
  };
}

async function createForeignKey({ fieldParams, options, isTransaction }) {
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
  if (isTransaction.transaction) {
    return await transactionSteps(isTransaction.transaction);
  } else {
    return await sequelize.transaction(transactionSteps);
  }
}

const DELETE_MAP = {
  text: deleteGenericField,
  number: deleteGenericField,
  foreignKey: deleteForeignField,
  multipleAttachment: deleteGenericField,
};
async function deleteGenericField({ fieldId, isTransaction }) {
  return await fields.destroy(
    {
      where: { id: fieldId },
      cascade: true,
    },
    isTransaction,
  );
}
async function deleteForeignField({ fieldId, fieldProps, isTransaction }) {
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
  if (isTransaction.transaction) {
    return await transactionSteps(isTransaction.transaction);
  } else {
    return await sequelize.transaction(transactionSteps);
  }
}

module.exports = {
  async createField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['id', 'tableId', 'name', 'fieldTypeId']);
    const { isTransaction = {} } = params;
    return await createOption({
      fieldParams,
      options: params.typeOptions,
      isTransaction,
    });
  },

  async findFieldType({ fieldId: id }) {
    return await fields.findOne({
      where: { id },
      attributes: ['id', 'name', 'tableId', 'fieldTypeId'],
      raw: true,
    });
  },
  async deleteField({ id: fieldId, fieldTypeId, isTransaction = {} }) {
    const fieldProps = FIELD_TYPES[fieldTypeId];
    const deleteOption = DELETE_MAP[fieldProps.name];

    return await deleteOption({ fieldId, fieldProps, isTransaction });
  },

  replaceField(field, params) {
    return sequelize.transaction(async t => {
      await module.exports.deleteField({
        isTransaction: { transaction: t },
        ...field,
      });
      params.name = params.name || field.name;
      return await module.exports.createField({
        id: field.id,
        tableId: field.tableId,
        isTransaction: { transaction: t },
        ...params,
      });
    });
  },
  updateField(field, params) {
    return fields.update(
      {
        name: params.name,
      },
      {
        where: { id: field.id },
      },
    );
  },
};
