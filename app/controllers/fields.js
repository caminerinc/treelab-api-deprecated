const { pick } = require('lodash');
const fldQueries = require('../queries/fields');
const tables = require('../queries/tables');
const positions = require('../queries/positions');
// const numberTypes = require('../queries/numberTypes');
// const foreignKeyTypes = require('../queries/foreignKeyTypes');
const posController = require('../controllers/positions');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

// const CREATE_OPTION_MAP = {
//   text: createGenericField,
//   number: createNumberOptions,
//   foreignKey: createForeignKey,
//   multipleAttachment: createGenericField,
// };

// const DELETE_MAP = {
//   text: deleteGenericField,
//   number: deleteGenericField,
//   foreignKey: deleteForeignField,
//   multipleAttachment: deleteGenericField,
// };

// const UPDATE_OPTION_MAP = {
//   number: updateNumberOptions,
// };

// async function createGenericField(params) {
//   const field = await fields.create(params);
//   return { fieldId: field.id };
// }

// async function createNumberOptions(params, options) {
//   checkKeyExists(options, 'format', 'negative');
//   const field = await fields.create(params);
//   await numberTypes.create({ ...options, fieldId: field.id });
//   return { fieldId: field.id };
// }

// async function createForeignKey(params, options) {
//   checkKeyExists(options, 'relationship', 'foreignTableId');
//   const newField = await fields.create(params);
//   const foreignTable = await tables.getEasyTable(options.foreignTableId);
//   if (!foreignTable) error(Status.Forbidden, ECodes.FOREIGN_TABLE_NOT_FOUND);
//   const fieldNameExist = await fields.checkFieldNameExist(
//     options.foreignTableId,
//     foreignTable.name,
//   );
//   let fieldName = foreignTable.name;
//   let index = 1;
//   while (fieldNameExist) {
//     index++;
//     const _fieldNameExist = await fields.checkFieldNameExist(
//       options.foreignTableId,
//       `${fieldName} (${index})`,
//     );
//     if (!_fieldNameExist) break;
//   }
//   const newSymmetricField = await fields.create({
//     tableId: options.foreignTableId,
//     name: `${fieldName}` + (index === 1 ? '' : ` (${index})`),
//     fieldTypeId: 3,
//   });
//   await foreignKeyTypes.create({
//     ...options,
//     symmetricFieldId: newSymmetricField.id,
//     fieldId: newField.id,
//   });
//   await foreignKeyTypes.create({
//     relationship: options.relationship,
//     foreignTableId: params.tableId,
//     symmetricFieldId: newField.id,
//     fieldId: newSymmetricField.id,
//   });
//   return {
//     foreignFieldId: newField.id,
//     symmetricFieldId: newSymmetricField.id,
//   };
// }

// async function deleteGenericField(fieldId) {
//   await fields.destroy(fieldId);
//   return { fieldId };
// }

// async function deleteForeignField(fieldId) {
//   const symmetricFieldId = await fields.getSymmetricFieldId(fieldId);
//   if (symmetricFieldId) await fields.destroy([fieldId, symmetricFieldId.id]);
//   return {
//     fieldId,
//     symmetricFieldId: symmetricFieldId ? symmetricFieldId.id : null,
//   };
// }

// function updateFieldName(fieldId, fieldName) {
//   return fields.updateFieldName(fieldId, fieldName);
// }

// function updateNumberOptions(fieldId, options) {
//   checkKeyExists(options, 'format', 'negative');
//   return numberTypes.update(options, { where: { fieldId } });
// }

const checkNameWithinTable = async ({ tableId, name }) => {
  const field = await fldQueries.getFieldByTableAndName(tableId, name);
  if (field) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
};

const checkFieldExists = async id => {
  const field = await fldQueries.getById(id);
  if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);

  return field;
};

module.exports = {
  async create(params) {
    await checkNameWithinTable(params);

    // const fieldProps = FIELD_TYPES[params.fieldTypeId];
    // const createOption = CREATE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, [
      'id',
      'tableId',
      'name',
      'fieldTypeId',
      'typeOptions',
    ]);
    const field = await fldQueries.create(fieldParams);
    // return { fieldId: field.id };
    // const result = await createOption(fieldParams, params.typeOptions);
    // if (fieldProps.name === 'foreignKey') {
    //   await positionsController.createPosition({
    //     parentId: params.tableId,
    //     id: result.foreignFieldId,
    //     type: 'field',
    //   });
    //   await positionsController.createPosition({
    //     parentId: params.typeOptions.foreignTableId,
    //     id: result.symmetricFieldId,
    //     type: 'field',
    //   });
    // } else {
    await posController.create({
      parentId: params.tableId,
      id: field.id,
      type: 'field',
    });
    // }
    return field;
  },

  async delete(id) {
    await checkFieldExists(id);
    // const fieldProps = FIELD_TYPES[field.fieldTypeId];
    // const deleteOption = DELETE_MAP[fieldProps.name];
    await fldQueries.destroy(id);
    // const ids = await deleteOption(id);
    // const result = await posController.getByIds([
    //   ids.fieldId,
    //   ids.symmetricFieldId,
    // ]);
    // for (const i of result) {
    // await posController.deletePositions({
    //   deletePositions: [i.position],
    //   parentId: i.parentId,
    //   type: 'field',
    // });
    await posController.deleteByParentId(id);
    // }
  },

  async updateWidth({ fieldId: id, width }) {
    await checkFieldExists(id);
    return fldQueries.updateWidth(id, width);
  },

  async update(params) {
    await checkFieldExists(params.fieldId);
    //当fieldTypeId不同时暂时将原field及fieldValue直接删除重新创建，未对fieldValue做类型转换

    // if (params.name && params.name !== field.name) {
    //   const fieldNameExist = await fields.checkFieldNameExist(
    //     field.tableId,
    //     params.name,
    //   );
    //   if (fieldNameExist) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
    //   await updateFieldName(params.fieldId, params.name);
    // }
    // if (params.fieldTypeId) {
    //   const fieldProps = FIELD_TYPES[params.fieldTypeId];
    //   if (!fieldProps) error(Status.Forbidden, ECodes.UNSURPPORTED_FIELD_TYPE);
    //   if (
    //     field.fieldTypeId == params.fieldTypeId &&
    //     fieldProps.name !== 'foreignKey'
    //   ) {
    //     const updateOption = UPDATE_OPTION_MAP[fieldProps.name];
    //     if (updateOption)
    //       await updateOption(params.fieldId, params.typeOptions);
    //   } else {
    //     await module.exports.deleteField(params.fieldId);
    //     await module.exports.createField({
    //       id: field.id,
    //       tableId: field.tableId,
    //       name: params.name || field.name,
    //       ...params,
    //     });
    //   }
    // }
    const updatedFields = pick(params, ['typeOptions', 'name']);
    return await fldQueries.update(updatedFields, params.fieldId);
  },
};
