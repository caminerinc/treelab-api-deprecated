const { pick } = require('lodash');
const { sequelize } = require('../models');
const DB = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_OPTION_MAP = {
  text: createGenericField,
  number: createNumberOptions,
  foreignKey: createForeignKey,
  multipleAttachment: createGenericField,
};

async function createGenericField(fieldParams) {
  return DB.fields.create(fieldParams);
}

async function createNumberOptions(fieldParams, options, fieldProps) {
  const newNumberType = await DB.numberTypes.create(options);
  const typeOptionProps = { [fieldProps.typeFK]: newNumberType.id };

  const option = await DB.typeOptions.create(typeOptionProps);
  fieldParams.typeOptionId = option.id;

  return DB.fields.create(fieldParams);
}

async function createForeignKey(fieldParams, options, fieldProps) {
  async function transactionSteps(t) {
    const transact = { transaction: t };
    const newField = await DB.fields.create(fieldParams, transact);
    const newSymmetricField = await DB.fields.create(
      {
        tableId: options.foreignTableId,
        name: 'Link',
        fieldTypeId: 3,
      },
      transact,
    );

    const newForeignKeyType = await DB.foreignKeyTypes.create(
      {
        ...options,
        symmetricFieldId: newSymmetricField.id,
      },
      transact,
    );
    const newSymmetricForeignKeyType = await DB.foreignKeyTypes.create(
      {
        relationship: options.relationship,
        foreignTableId: fieldParams.tableId,
        symmetricFieldId: newField.id,
      },
      transact,
    );

    const newTypeOption = await DB.typeOptions.create(
      { [fieldProps.typeFK]: newForeignKeyType.id },
      transact,
    );
    const newSymmetricTypeOption = await DB.typeOptions.create(
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
async function deleteTypeOptionsRequired({ fieldId, fieldProps }) {
  const typeOption = await DB.fields.findOne({
    where: {
      id: fieldId,
    },
    attributes: ['typeOptionId'],
    include: [
      {
        model: DB.typeOptions,
        as: 'typeOptions',
        include: [
          {
            model: DB[fieldProps.typeModel],
            attributes: ['id'],
            as: fieldProps.typeName,
          },
        ],
      },
    ],
    raw: true,
  });
  return await DB[fieldProps.typeModel].destroy({
    where: { id: typeOption[`typeOptions.${fieldProps.typeName}.id`] },
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
    if (fieldProps.isTypeOptionsRequired) {
      return await deleteTypeOptionsRequired({
        fieldId,
        fieldProps,
      });
    } else {
      return await DB.fields.destroy({
        where: { id: fieldId },
        cascade: true,
      });
    }
  },
};
