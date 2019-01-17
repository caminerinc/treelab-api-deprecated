const { pick } = require('lodash');
const {
  fields,
  numberTypes,
  foreignKeyTypes,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const {
  createPosition,
  deletePositions,
  getPositionsByIds,
} = require('../controllers/positions');

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
async function deleteGenericField({ fieldId }, transaction) {
  return await fields.destroy({
    where: { id: fieldId },
    cascade: true,
    transaction,
  });
}
async function deleteForeignField({ fieldId, fieldProps }, transaction) {
  const symmetricFieldId = await fields.findOne({
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
    transaction,
  });
  await fields.destroy({
    where: { id: fieldId },
    cascade: true,
    transaction,
  });
  await fields.destroy({
    where: { id: symmetricFieldId.id },
    cascade: true,
    transaction,
  });
  return { fieldId, symmetricFieldId: symmetricFieldId.id };
}
async function createFieldStep(params, transact) {
  const fieldProps = FIELD_TYPES[params.fieldTypeId];
  const createOption = TYPE_OPTION_MAP[fieldProps.name];
  const fieldParams = pick(params, ['id', 'tableId', 'name', 'fieldTypeId']);
  const result = await createOption(fieldParams, params.typeOptions, transact);
  return {
    fieldProps,
    result,
  };
}
function deleteFieldStep({ id: fieldId, fieldTypeId }, t) {
  const fieldProps = FIELD_TYPES[fieldTypeId];
  const deleteOption = DELETE_MAP[fieldProps.name];

  return deleteOption({ fieldId, fieldProps }, t);
}
module.exports = {
  async createField(params, t1) {
    async function transactionSteps(t) {
      const transact = { transaction: t1 || t };
      const { fieldProps, result } = await createFieldStep(params, transact);
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
            parentId: params.typeOptions.foreignTableId,
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
    return t1
      ? transactionSteps()
      : await sequelize.transaction(transactionSteps);
  },

  async findFieldType({ fieldId: id }) {
    return await fields.findOne({
      where: { id },
      attributes: ['id', 'name', 'tableId', 'fieldTypeId'],
      raw: true,
    });
  },

  async deleteField({ id, fieldTypeId }, t1) {
    async function transactionSteps(t) {
      const ids = await deleteFieldStep({ id, fieldTypeId }, t);
      const result = await getPositionsByIds([
        ids.fieldId,
        ids.symmetricFieldId,
      ]);
      if (result.length) {
        await deletePositions(
          {
            deletePositions: Array.from(result, i => i.position),
            parentId: result[0].parentId,
            type: 'field',
          },
          t,
        );
      }
    }
    return t1
      ? transactionSteps(t1)
      : await sequelize.transaction(transactionSteps);
  },

  replaceField(field, params) {
    return sequelize.transaction(async t => {
      await deleteFieldStep(
        {
          ...field,
        },
        t,
      );
      params.name = params.name || field.name;
      const { result } = await createFieldStep(
        {
          id: field.id,
          tableId: field.tableId,
          ...params,
        },
        { transaction: t },
      );
      return result;
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
