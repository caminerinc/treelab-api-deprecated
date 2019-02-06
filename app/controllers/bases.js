const bseQueries = require('../queries/bases');
const posController = require('../controllers/positions');
const tblController = require('../controllers/tables');
const { POSITION_TYPE } = require('../constants/app');
const { error, Status, ECodes } = require('../util/error');

module.exports = {
  async create(params) {
    const base = await bseQueries.create(params.name);
    const table = await tblController.createNewTableSet({
      baseId: base.id,
      name: 'Table 1',
    });
    await posController.create({
      siblingId: base.id,
      // TODO: Temporary fix
      parentId: '11111111-1111-1111-1111-111111111111',
      type: POSITION_TYPE.BASE,
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

  delete(baseId) {
    return bseQueries.destroy(baseId);
  },
};
