const { get, pick, forEach, map } = require('lodash');
const tblQueries = require('../queries/tables');
// const positions = require('../queries/positions');
// const { createPosition, deletePositions } = require('../controllers/positions');
const bseController = require('../controllers/bases');
const posController = require('../controllers/positions');
const recController = require('../controllers/records');
// const { createField, deleteField } = require('../controllers/fields');
const fldController = require('../controllers/fields');

const checkIfExists = async id => {
  const field = await tblQueries.getEasyTable(id);
  if (!field) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);

  return field;
};

module.exports = {
  checkIfExists,
  async getAll(baseId) {
    // Really not sure why the important at the top doens't work.
    const bseCtrl = require('../controllers/bases');
    await bseCtrl.getOne(baseId);
    return tblQueries.getAllByBaseId(baseId);
  },

  getOne(id) {
    return tblQueries.getOneById(id);
  },

  async createNewTableSet(params) {
    const table = await tblQueries.create(params);
    await posController.create({
      parentId: params.baseId,
      id: table.id,
      type: 'table',
    });

    const nameField = await fldController.create({
      tableId: table.id,
      name: 'Name',
      fieldTypeId: 1,
    });
    const descField = await fldController.create({
      tableId: table.id,
      name: 'Description',
      fieldTypeId: 1,
    });

    let recordResults = [];
    for (let i = 0; i < 3; i++) {
      recordResults.push(await recController.create(table.id));
    }

    return {
      table,
      fields: [nameField, descField],
      records: recordResults,
    };
  },

  // getEasyTable(id) {
  //   return tables.getEasyTable(id);
  // },

  // getTableByBaseId({ baseId }) {
  //   return tables.getTableByBaseId(baseId);
  // },

  async delete(id) {
    // const symmetricFieldIds = await tables.getSymmetricFieldIdsByTableId(id);
    // if (symmetricFieldIds) {
    //   forEach(symmetricFieldIds.flds, field => {
    //     if (!field.foreignKeyTypes) return;
    //     deleteField({ id: get(field, 'foreignKeyTypes.symmetricFieldId') });
    //   });
    // }
    await tblQueries.destroy(id);
    await posController.deleteByParentId(id);
  },

  // async getRowsMatchingName(id) {
  //   const table = await tables.getTable(id);
  //   const tableSchema = await tables.getTableSchema(id);
  //   return { table, tableSchema };
  // },
};
