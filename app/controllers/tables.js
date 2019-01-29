const { get, pick, forEach, map } = require('lodash');
const tables = require('../queries/tables');
const positions = require('../queries/positions');
const fields = require('../queries/fields');
const { createPosition } = require('../controllers/positions');
const { createField, deleteField } = require('../controllers/fields');
const { createRecord } = require('../controllers/records');

module.exports = {
  getTables(baseId) {
    return tables.getTables(baseId);
  },

  getTable(id) {
    return tables.getTable(id);
  },

  async createTable(params) {
    const table = await tables.create(params);
    await createPosition({
      parentId: params.baseId,
      id: table.id,
      type: 'table',
    });
    const field1 = await createField({
      tableId: table.id,
      name: 'Name',
      fieldTypeId: 1,
    });
    field1.name = 'Name';
    field1.fieldTypeId = 1;
    const field2 = await createField({
      tableId: table.id,
      name: 'Description',
      fieldTypeId: 1,
    });
    field2.name = 'Description';
    field2.fieldTypeId = 1;
    let recordResults = [];
    for (let i = 0; i < 3; i++) {
      recordResults.push(await createRecord(table.id));
    }
    return { table, fields: [field1, field2], records: recordResults };
  },

  getEasyTable(id) {
    return tables.getEasyTable(id);
  },

  getTableByBaseId({ baseId }) {
    return tables.getTableByBaseId(baseId);
  },

  async deleteTable(id) {
    const symmetricFieldIds = await tables.getSymmetricFieldIdsByTableId(id);
    forEach(symmetricFieldIds.flds, field => {
      if (!field.foreignKeyTypes) return;
      deleteField({ id: get(field, 'foreignKeyTypes.symmetricFieldId') });
    });
    await tables.destroy(id);
    await positions.deleteParentId([id]);
    const positionsResult = await positions.getPositionsByIds([id]);
    await positions.deletePositions({
      deletePositions: [positionsResult[0].position],
      parentId: symmetricFieldIds.baseId,
      type: 'table',
    });
  },
};
