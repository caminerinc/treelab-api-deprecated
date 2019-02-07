const tblQueries = require('../queries/tables');
const posController = require('../controllers/positions');
const recController = require('../controllers/records');
const fldController = require('../controllers/fields');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');

const checkIfExists = async id => {
  const table = await tblQueries.getEasyTable(id);
  if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);

  return table;
};

module.exports = {
  checkIfExists,
  async createNewTableSet(params) {
    const table = await tblQueries.create(params);

    await posController.create({
      parentId: params.baseId,
      siblingId: table.id,
      type: POSITION_TYPE.TABLE,
    });
    // TODO: try bulk creating
    let nameField = await fldController.create({
      tableId: table.id,
      name: 'Name',
      fieldTypeId: 1,
    });

    let descField = await fldController.create({
      tableId: table.id,
      name: 'Description',
      fieldTypeId: 1,
    });

    let recordResults = [];
    for (let i = 0; i < 3; i++) {
      // TODO: Put this inside a bulk create
      recordResults.push(await recController.create(table.id));
    }

    return {
      table,
      fields: [nameField, descField],
      records: recordResults,
    };
  },

  async getAll(baseId) {
    // @TODO Putting this require at the top doesn't work
    const bseCtrl = require('../controllers/bases');
    await bseCtrl.getOne(baseId);
    return tblQueries.getAllByBaseId(baseId);
  },

  async getOne(id) {
    await checkIfExists(id);
    return tblQueries.getOneById(id);
  },

  async getShallowRows(id) {
    await checkIfExists(id);
    const table = await tblQueries.getOneById(id);
    const tableSchema = await tblQueries.getTableSchema(id);

    return { table, tableSchema };
  },

  getEasyTable(id) {
    return tblQueries.getEasyTable(id);
  },

  async delete(id) {
    await checkIfExists(id);
    await tblQueries.destroy(id);
  },
};
