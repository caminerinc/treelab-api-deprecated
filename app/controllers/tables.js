const { get, pick, forEach, map } = require('lodash');
const tblQueries = require('../queries/tables');
const positions = require('../queries/positions');
// const { createPosition, deletePositions } = require('../controllers/positions');
const posController = require('../controllers/positions');
// const { createField, deleteField } = require('../controllers/fields');
const fldController = require('../controllers/fields');
const { createRecord } = require('../controllers/records');

module.exports = {
  getAll(baseId) {
    return tblQueries.getAllByBaseId(baseId);
  },

  // getTable(id) {
  //   return tables.getTable(id);
  // },

  async createNewBaseTables(params) {
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
    // field1.name = 'Name';
    // field1.fieldTypeId = 1;
    const descField = await createField({
      tableId: table.id,
      name: 'Description',
      fieldTypeId: 1,
    });
    // field2.name = 'Description';
    // field2.fieldTypeId = 1;
    // let recordResults = [];
    // for (let i = 0; i < 3; i++) {
    //   recordResults.push(await createRecord(table.id));
    // }
    return {
      table,
      fields: [nameField, descField],
      // records: recordResults,
    };
  },

  // getEasyTable(id) {
  //   return tables.getEasyTable(id);
  // },

  // getTableByBaseId({ baseId }) {
  //   return tables.getTableByBaseId(baseId);
  // },

  // async deleteTable(id) {
  //   const symmetricFieldIds = await tables.getSymmetricFieldIdsByTableId(id);
  //   if (symmetricFieldIds) {
  //     forEach(symmetricFieldIds.flds, field => {
  //       if (!field.foreignKeyTypes) return;
  //       deleteField({ id: get(field, 'foreignKeyTypes.symmetricFieldId') });
  //     });
  //   }
  //   await tables.destroy(id);
  //   await positions.deleteParentId([id]);
  //   const positionsResult = await positions.getPositionsByIds([id]);
  //   await deletePositions({
  //     deletePositions: [positionsResult[0].position],
  //     parentId: positionsResult[0].parentId,
  //     type: positionsResult[0].type,
  //   });
  // },

  // async getRowsMatchingName(id) {
  //   const table = await tables.getTable(id);
  //   const tableSchema = await tables.getTableSchema(id);
  //   return { table, tableSchema };
  // },
};
