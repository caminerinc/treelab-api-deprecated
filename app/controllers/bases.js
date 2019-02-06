const bseQueries = require('../queries/bases');
const posController = require('../controllers/positions');
const tblController = require('../controllers/tables');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async create(params) {
    const base = await bseQueries.create(params.name);
    const table = await tblController.createNewTableSet({
      baseId: base.id,
      name: 'Table 1',
    });
    await posController.create({
      id: base.id,
      type: 'base',
    });
    return { base, table };
  },

  getAll() {
    return bseQueries.getAll();
  },

  async getOne(id) {
    const base = await bseQueries.getOne(id);
    if (!base) error(Status.Unauthorized, ECodes.BASE_NOT_FOUND);
    return base;
  },

  async delete(baseId) {
    const result = await posController.getByIds([baseId]);
    // TODO This is not working properly. Something to do with the base not having
    // a correct parentId in position (look in the create function)
    await posController.deletePositions({
      deletePositions: [result[0].position],
      parentId: result[0].parentId,
      type: result[0].type,
    });
    await bseQueries.destroy(baseId);
  },
};
