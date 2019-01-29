const { pick } = require('lodash');
const fields = require('../queries/fields');
const tables = require('../queries/tables');
const positions = require('../queries/positions');
const numberTypes = require('../queries/numberTypes');
const foreignKeyTypes = require('../queries/foreignKeyTypes');
const positionsController = require('../controllers/positions');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

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

async function createForeignKey(params, options) {
  checkKeyExists(options, 'relationship', 'foreignTableId');
  const newField = await fields.create(params);
  const foreignTable = await tables.getEasyTable(options.foreignTableId);
  const fieldNameExist = await fields.checkFieldNameExist(
    options.foreignTableId,
    foreignTable.name,
  );
  let fieldName = foreignTable.name;
  let index = 1;
  while (fieldNameExist) {
    index++;
    const _fieldNameExist = await fields.checkFieldNameExist(
      options.foreignTableId,
      `${fieldName} (${index})`,
    );
    if (!_fieldNameExist) break;
  }
  const newSymmetricField = await fields.create({
    tableId: options.foreignTableId,
    name: `${fieldName}` + (index === 1 ? '' : ` (${index})`),
    fieldTypeId: 3,
  });
  await foreignKeyTypes.create({
    ...options,
    symmetricFieldId: newSymmetricField.id,
    fieldId: newField.id,
  });
  await foreignKeyTypes.create({
    relationship: options.relationship,
    foreignTableId: params.tableId,
    symmetricFieldId: newField.id,
    fieldId: newSymmetricField.id,
  });
  return {
    foreignFieldId: newField.id,
    symmetricFieldId: newSymmetricField.id,
  };
}

async function deleteGenericField(fieldId) {
  await fields.destroy(fieldId);
  return { fieldId };
}

async function deleteForeignField(fieldId) {
  const symmetricFieldId = await fields.getSymmetricFieldId(fieldId);
  if (symmetricFieldId) await fields.destroy([fieldId, symmetricFieldId.id]);
  return {
    fieldId,
    symmetricFieldId: symmetricFieldId ? symmetricFieldId.id : null,
  };
}

async function createFieldStep(params) {
  const fieldNameExist = await fields.checkFieldNameExist(
    params.tableId,
    params.name,
  );
  if (fieldNameExist) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
  const fieldProps = FIELD_TYPES[params.fieldTypeId];
  const createOption = TYPE_OPTION_MAP[fieldProps.name];
  const fieldParams = pick(params, ['id', 'tableId', 'name', 'fieldTypeId']);
  const result = await createOption(fieldParams, params.typeOptions);
  return { fieldProps, result };
}

function deleteFieldStep(fieldId, fieldTypeId) {
  const fieldProps = FIELD_TYPES[fieldTypeId];
  const deleteOption = DELETE_MAP[fieldProps.name];
  return deleteOption(fieldId, fieldProps);
}

module.exports = {
  async createField(params) {
    const { fieldProps, result } = await createFieldStep(params);
    if (fieldProps.name === 'foreignKey') {
      await positionsController.createPosition({
        parentId: params.tableId,
        id: result.foreignFieldId,
        type: 'field',
      });
      await positionsController.createPosition({
        parentId: params.typeOptions.foreignTableId,
        id: result.symmetricFieldId,
        type: 'field',
      });
    } else {
      await positionsController.createPosition({
        parentId: params.tableId,
        id: result.fieldId || result.id,
        type: 'field',
      });
    }
    return result;
  },

  async deleteField(id) {
    const field = await fields.getField(id);
    if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);
    const ids = await deleteFieldStep(id, field.fieldTypeId);
    const result = await positions.getPositionsByIds([
      ids.fieldId,
      ids.symmetricFieldId,
    ]);
    for (const i of result) {
      await positionsController.deletePositions({
        deletePositions: [i.position],
        parentId: i.parentId,
        type: 'field',
      });
    }
  },

  updateFieldWidth({ fieldId: id, width }) {
    return fields.updateFieldWidth(id, width);
  },
};
