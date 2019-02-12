const { pick } = require('lodash');
const fldQueries = require('../queries/fields');
const posController = require('../controllers/positions');
const { POSITION_TYPE } = require('../constants/app');
const { checkKeyExists } = require('../util/helper');
const { error, Status, ECodes } = require('../util/error');

const checkFieldExists = async id => {
  const field = await fldQueries.getById(id);
  if (!field) error(Status.Forbidden, ECodes.FIELD_NOT_FOUND);

  return field;
};

const checkNameWithinTable = async ({ tableId, name }) => {
  const field = await fldQueries.getFieldByTableAndName(tableId, name);
  if (field) error(Status.Forbidden, ECodes.FIELD_NAME_EXIST);
};

const createWithPosition = async params => {
  const field = await fldQueries.create(params);
  await posController.create({
    parentId: params.tableId,
    siblingId: field.id,
    type: POSITION_TYPE.FIELD,
  });

  return field;
};

const createReferenceField = async (params, createdField) => {
  checkKeyExists(params.typeOptions, 'referenceTableId', 'relationship');
  const tblCtrl = require('../controllers/tables');
  const currentTable = await tblCtrl.getEasyTable(params.tableId);
  // TODO: Check the field type, see what is inside typeOptions

  // Create Reference field using the newly created field
  const referenceField = await createWithPosition({
    name: currentTable.name,
    tableId: params.typeOptions.referenceTableId,
    fieldTypeId: 3,
    typeOptions: {
      relationship: params.typeOptions.relationship,
      referenceTableId: createdField.tableId,
      referenceColumnId: createdField.id,
    },
  });

  // Update newly created field with referenceTableId
  await fldQueries.update(
    {
      typeOptions: {
        relationship: params.typeOptions.relationship,
        referenceTableId: params.typeOptions.referenceTableId,
        referenceColumnId: referenceField.id,
      },
    },
    createdField.id,
  );

  // Return the referenceColumnId so that front end can also receive
  return referenceField.id;
};

module.exports = {
  async create(params) {
    await checkNameWithinTable(params);
    const fieldParams = pick(params, [
      'id',
      'tableId',
      'name',
      'fieldTypeId',
      'typeOptions',
    ]);
    const field = await createWithPosition(fieldParams);

    // TODO: Check field type id from db table
    if (parseInt(params.fieldTypeId) === 3) {
      field.typeOptions.referenceColumnId = await createReferenceField(
        params,
        field,
      );
    }

    return field;
  },

  async update(params) {
    // TODO handle reference fieldTypes
    await checkFieldExists(params.fieldId);
    const updatedFields = pick(params, ['typeOptions', 'name']);
    return await fldQueries.update(updatedFields, params.fieldId);
  },

  async updateWidth({ fieldId: id, width }) {
    await checkFieldExists(id);
    return fldQueries.updateWidth(id, width);
  },

  async delete(id) {
    // TODO handle reference fieldTypes
    // TODO can not delete first column
    await checkFieldExists(id);
    await fldQueries.destroy(id);
  },
};
