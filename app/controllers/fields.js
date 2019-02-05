const { pick } = require('lodash');
const fldQueries = require('../queries/fields');
const posController = require('../controllers/positions');
const tblController = require('../controllers/tables');
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
    id: field.id,
    type: 'field',
  });

  return field;
};

const createReferenceField = async (params, createdField) => {
  checkKeyExists(params.typeOptions, 'referenceTableId', 'relationship');
  const currentTable = await tblController.getEasyTable(params.tableId);

  // Create Reference field using the newly created field
  const referenceField = await createWithPosition({
    name: currentTable.name,
    tableId: params.typeOptions.referenceTableId,
    fieldTypeId: 3,
    typeOptions: {
      relationship: params.typeOptions.relationship,
      referenceTableId: createdField.tableId,
      symmetricColumnId: createdField.id,
    },
  });

  // Update newly created field with referenceTableId
  await fldQueries.update(
    {
      typeOptions: {
        relationship: params.typeOptions.relationship,
        referenceTableId: params.typeOptions.referenceTableId,
        symmetricColumnId: referenceField.id,
      },
    },
    createdField.id,
  );
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

    // Handle reference field types
    if (params.fieldTypeId === 3) {
      await createReferenceField(params, field);
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
    await checkFieldExists(id);
    await fldQueries.destroy(id);
    await posController.deleteByParentId(id);
  },
};
