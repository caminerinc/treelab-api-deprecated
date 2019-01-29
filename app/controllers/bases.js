const bases = require('../queries/bases');
const tables = require('../queries/tables');
const positions = require('../queries/positions');
const fieldsController = require('../controllers/fields');
const tablesController = require('../controllers/tables');
const positionsController = require('../controllers/positions');

module.exports = {
  getBases() {
    return bases.getAllBases();
  },

  async createBase(params) {
    const base = await bases.create(params.name);
    await positionsController.createPosition({
      parentId: 'baseParent', //TODO base的父级未确定
      id: base.id,
      type: 'base',
    });
    const table = await tablesController.createTable({
      baseId: base.id,
      name: 'Table 1',
    });
    return { base, table };
  },

  getBase(id) {
    return bases.getOneBase(id);
  },

  async deleteBase(baseId) {
    await bases.destroy(ctx.params.baseId);
    const symmetricFieldIds = await findSymmetricFieldId(baseId);
    symmetricFieldIds.forEach(i => {
      fieldsController.deleteField(i);
    });
    const tableIds = await tables.getEasyTables(baseId);
    tableIds = map(tableIds, 'id');
    await positions.deleteParentId([baseId, ...tableIds]);
    await positions.deletePositions([baseId]);
  },

  async findSymmetricFieldId(id) {
    const base = await bases.getBase(id);
    if (base && base.tables) {
      const flds = [];
      for (let i = 0; i < base.tables.length; i++) {
        flds.push(...base.tables[i].flds);
      }
      const symmetricFieldId = [];
      for (let i = 0; i < flds.length; i++) {
        symmetricFieldId.push(flds[i].foreignKeyTypes.symmetricFieldId);
      }
      return symmetricFieldId;
    }
    return [];
  },
};
