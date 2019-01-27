const { pick } = require('lodash');
const {
  sequelize,
  fields,
  numberTypes,
  foreignKeyTypes,
  formulaTypes,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const {
  createPosition,
  deletePositions,
  getPositionsByIds,
} = require('../controllers/positions');

const CREATE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
  formula: createFormulaField,
};

async function createGenericField(fieldParams, options, t) {
  const field = await fields.create(fieldParams, { transaction: t });
  return { fieldId: field.id };
}

async function createNumberOptions(fieldParams, options, t) {
  checkKeyExists(options, 'format', 'negative');
  const field = await fields.create(fieldParams, { transaction: t });
  await numberTypes.create(
    {
      ...options,
      fieldId: field.id,
    },
    { transaction: t },
  );
  return {
    fieldId: field.id,
  };
}

async function createForeignKey(fieldParams, options, t) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
  const newField = await fields.create(fieldParams, { transaction: t });
  const newSymmetricField = await fields.create(
    {
      tableId: options.foreignTableId,
      name: 'Link',
      fieldTypeId: 3,
    },
    { transaction: t },
  );
  await foreignKeyTypes.create(
    {
      ...options,
      symmetricFieldId: newSymmetricField.id,
      fieldId: newField.id,
    },
    { transaction: t },
  );
  await foreignKeyTypes.create(
    {
      relationship: options.relationship,
      foreignTableId: fieldParams.tableId,
      symmetricFieldId: newField.id,
      fieldId: newSymmetricField.id,
    },
    { transaction: t },
  );
  return {
    foreignFieldId: newField.id,
    symmetricFieldId: newSymmetricField.id,
  };
}

async function createFormulaField(fieldParams, options, t) {
  checkKeyExists(options, 'format');
  const newField = await fields.create(fieldParams, { transaction: t });
  await formulaTypes.create(
    Object.assign({}, options, { fieldId: newField.id }),
    t,
  );
  return {
    fieldId: newField.id,
  };
}

const UPDATE_OPTION_MAP = {
  number: updateNumberOptions,
  foreignKey: updateForeignKey,
  formula: updateFormulaField,
};

function updateNumberOptions(fieldId, options, t) {
  checkKeyExists(options, 'format', 'negative');
  return numberTypes.update(options, { where: { fieldId }, transaction: t });
}

async function updateForeignKey(fieldId, options, t) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
  await fields.update(options, { where: { fieldId }, transaction: t });
  await foreignKeyTypes.create(
    {
      ...options,
      symmetricFieldId: newSymmetricField.id,
      fieldId: newField.id,
    },
    { transaction: t },
  );
  await foreignKeyTypes.create(
    {
      relationship: options.relationship,
      foreignTableId: fieldParams.tableId,
      symmetricFieldId: newField.id,
      fieldId: newSymmetricField.id,
    },
    { transaction: t },
  );
  return {
    foreignFieldId: newField.id,
    symmetricFieldId: newSymmetricField.id,
  };
}

function updateFormulaField(fieldId, options, t) {
  return formulaTypes.update(options, { fieldId }, t);
}

const DELETE_MAP = {
  text: deleteGenericField,
  number: deleteGenericField,
  foreignKey: deleteForeignField,
  multipleAttachment: deleteGenericField,
  formula: deleteGenericField,
};
async function deleteGenericField({ fieldId }, t) {
  return await fields.destroy({
    where: { id: fieldId },
    cascade: true,
    transaction: t,
  });
}
async function deleteForeignField({ fieldId, fieldProps }, t) {
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
    transaction: t,
  });
  await fields.destroy({
    where: { id: fieldId },
    cascade: true,
    transaction: t,
  });
  await fields.destroy({
    where: { id: symmetricFieldId.id },
    cascade: true,
    transaction: t,
  });
  return { fieldId, symmetricFieldId: symmetricFieldId.id };
}
async function createFieldStep(params, t) {
  const fieldProps = FIELD_TYPES[params.fieldTypeId];
  const createOption = CREATE_OPTION_MAP[fieldProps.name];
  const fieldParams = pick(params, ['id', 'tableId', 'name', 'fieldTypeId']);
  const result = await createOption(fieldParams, params.typeOptions, t);
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
      const { fieldProps, result } = await createFieldStep(params, t);
      if (fieldProps.name === 'foreignKey') {
        await createPosition(
          {
            parentId: params.tableId,
            id: result.foreignFieldId,
            type: 'field',
          },
          t,
        );
        await createPosition(
          {
            parentId: params.typeOptions.foreignTableId,
            id: result.symmetricFieldId,
            type: 'field',
          },
          t,
        );
      } else {
        await createPosition(
          {
            parentId: params.tableId,
            id: result.fieldId || result.id,
            type: 'field',
          },
          t,
        );
      }
      return result;
    }
    return t1
      ? transactionSteps(t1)
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

  updateField(params, t1) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const updateOption = UPDATE_OPTION_MAP[fieldProps.name];
    async function transactionSteps(t) {
      if (params.name)
        await fields.update(
          { name: params.name },
          { where: { id: params.fieldId }, transaction: t },
        );
      if (updateOption) {
        return await updateOption(params.fieldId, params.typeOptions, t1);
      }
    }
    return t1 ? transactionSteps(t1) : sequelize.transaction(transactionSteps);
  },

  getFormulaFields(tableId) {
    return fields.findAll({
      where: {
        tableId,
        fieldTypeId: 5,
      },
      include: [
        {
          model: formulaTypes,
          as: 'formulaTypes',
          attributes: [
            'formulaText',
            'format',
            'precision',
            'symbol',
            'fieldId',
          ],
        },
      ],
    });
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
