const tblQueries = require('../queries/tables');
const posController = require('../controllers/positions');
const recController = require('../controllers/records');
const fldController = require('../controllers/fields');

const checkIfExists = async id => {
  const field = await tblQueries.getEasyTable(id);
  if (!field) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);

  return field;
};

module.exports = {
  checkIfExists,
  async createNewTableSet(params) {
    const table = await tblQueries.create(params);
    // @Moya Here I am manually creating two fields, and 3 rows. Any better approach?
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

  async getAll(baseId) {
    // @Moya Really not sure why the important at the top doens't work.
    const bseCtrl = require('../controllers/bases');
    await bseCtrl.getOne(baseId);
    return tblQueries.getAllByBaseId(baseId);
  },

  getOne(id) {
    return tblQueries.getOneById(id);
  },

  async getShallowRows(id) {
    // INCOMPLETE
    await checkIfExists(id);
    const table = await tblQueries.getAllByBaseId(id);
    // const tableSchema = await tblQueries.getTableSchema(id);

    return { table, tableSchema };
  },

  getEasyTable(id) {
    return tblQueries.getEasyTable(id);
  },

  async delete(id) {
    await tblQueries.destroy(id);

    // @Moya again, I think its weird that we have to delete the children
    // manually. If a table is deleted, the rows and fields should be cascaded, and
    // also deleting its position right?
    await posController.deleteByParentId(id);
  },
};
