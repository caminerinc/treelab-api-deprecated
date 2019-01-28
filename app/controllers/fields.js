const { pick } = require('lodash');
const fields = require('../queries/fields');
const numberTypes = require('../queries/numberTypes');
const foreignKeyTypes = require('../queries/foreignKeyTypes');
const positionsContoller = require('../controllers/positions');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
};

const DELETE_MAP = {
  text: deleteGenericField,
  number: deleteGenericField,
  foreignKey: deleteForeignField,
  multipleAttachment: deleteGenericField,
};

async function createGenericField(params) {
  const field = await fields.create(params);
  return { fieldId: field.id };
}

async function createNumberOptions(params, options) {
  checkKeyExists(options, 'format', 'negative');
  const field = await fields.create(params);
  await numberTypes.create({ ...options, fieldId: field.id });
  return { fieldId: field.id };
}

async function createForeignKey(fieldParams, options) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
  const newField = await fields.create(fieldParams);
  const newSymmetricField = await fields.create({
    tableId: options.foreignTableId,
    name: 'Link',
    fieldTypeId: 3,
  });
  await foreignKeyTypes.create({
    ...options,
    symmetricFieldId: newSymmetricField.id,
    fieldId: newField.id,
  });
  await foreignKeyTypes.create({
    relationship: options.relationship,
    foreignTableId: fieldParams.tableId,
    symmetricFieldId: newField.id,
    fieldId: newSymmetricField.id,
  });
  return {
    foreignFieldId: newField.id,
    symmetricFieldId: newSymmetricField.id,
  };
}

function deleteGenericField(fieldId) {
  return fields.destroy(fieldId);
}

async function deleteForeignField(fieldId) {
  const symmetricFieldId = await fields.getSymmetricFieldId(fieldId);
  await fields.destroy([fieldId, symmetricFieldId.id]);
  return { fieldId, symmetricFieldId: symmetricFieldId.id };
}

async function createFieldStep(params) {
  const fieldProps = FIELD_TYPES[params.fieldTypeId];
  const createOption = TYPE_OPTION_MAP[fieldProps.name];
  const fieldParams = pick(params, ['id', 'tableId', 'name', 'fieldTypeId']);
  const result = await createOption(fieldParams, params.typeOptions);
  return { fieldProps, result };
}

function deleteFieldStep({ id: fieldId, fieldTypeId }, t) {
  const fieldProps = FIELD_TYPES[fieldTypeId];
  const deleteOption = DELETE_MAP[fieldProps.name];

  return deleteOption({ fieldId, fieldProps }, t);
}

module.exports = {
  async createField(params) {
    const { fieldProps, result } = await createFieldStep(params);
    if (fieldProps.name === 'foreignKey') {
      await positionsContoller.createPosition({
        parentId: params.tableId,
        id: result.foreignFieldId,
        type: 'field',
      });
      await positionsContoller.createPosition({
        parentId: params.typeOptions.foreignTableId,
        id: result.symmetricFieldId,
        type: 'field',
      });
    } else {
      await positionsContoller.createPosition({
        parentId: params.tableId,
        id: result.fieldId || result.id,
        type: 'field',
      });
    }
    return result;
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
      const result = await getPositionsByIds(
        [ids.fieldId, ids.symmetricFieldId],
        t,
      );
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
        t,
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
  updateFieldWidth({ fieldId: id, width }) {
    return fields.update(
      {
        width,
      },
      {
        where: {
          id,
        },
      },
    );
  },
};
