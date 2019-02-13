const tblQueries = require('../queries/tables');
const posController = require('../controllers/positions');
const recController = require('../controllers/records');
const fldController = require('../controllers/fields');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');

const checkTable = async id => {
  const table = await tblQueries.getEasyTable(id);
  if (!table) error(Status.Forbidden, ECodes.TABLE_NOT_FOUND);
  return table;
};

const checkNameWithinBase = async (baseId, name) => {
  const bseController = require('../controllers/bases');
  await bseController.getOne(baseId);
  const table = await tblQueries.getTableByBaseAndName(baseId, name);
  if (table) error(Status.Forbidden, ECodes.TABLE_NAME_EXIST);
};

module.exports = {
  checkTable,
  async createNewTableSet(params) {
    await checkNameWithinBase(params.baseId, params.name);

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
      type: 'text',
    });

    let descField = await fldController.create({
      tableId: table.id,
      name: 'Description',
      type: 'text',
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
    await checkTable(id);
    return tblQueries.getOneById(id);
  },

  async getShallowRows(id) {
    await checkTable(id);
    const table = await tblQueries.getOneById(id);
    const tableSchema = await tblQueries.getTableSchema(id);

    return { table, tableSchema };
  },

  getEasyTable(id) {
    return tblQueries.getEasyTable(id);
  },

  async delete(id) {
    await checkTable(id);
    await tblQueries.destroy(id);
  },

  async update(params) {
    const table = await checkTable(params.tableId);
    if (params.name.toLowerCase() === table.name.toLowerCase()) return null;
    await checkNameWithinBase(table.baseId, params.name);
    return await tblQueries.update(params);
  },
};
