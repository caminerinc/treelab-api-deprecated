const bseQueries = require('../queries/bases');
const tblController = require('../controllers/tables');
const posController = require('../controllers/positions');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async create(params) {
    const base = await bseQueries.create(params.name);
    await posController.create({
      id: base.id,
      type: 'base',
    });
    const table = await tblController.createNewTableSet({
      baseId: base.id,
      name: 'Table 1',
    });
    return { base, table };
  },

  getAll() {
    return bseQueries.getAll();
  },

  async getOne(id) {
    const base = await bseQueries.getOne(id);
    if (!base) error(Status.Unauthorized, ECodes.BASE_NOT_FOUND);
  },

  async delete(baseId) {
    const result = await posController.getByIds([baseId]);
    await posController.deletePositions({
      deletePositions: [result[0].position],
      parentId: result[0].parentId,
      type: result[0].type,
    });
    await bseQueries.destroy(baseId);
    return;
  },
};
