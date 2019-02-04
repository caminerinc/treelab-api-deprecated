const { map } = require('lodash');
const bseQueries = require('../queries/bases');
const tables = require('../queries/tables');
const positions = require('../queries/positions');
const fieldsController = require('../controllers/fields');
const tblController = require('../controllers/tables');
const posController = require('../controllers/positions');
const { error, Status, ECodes } = require('../util/error');

const findSymmetricFieldId = async id => {
  const base = await bases.getBaseForSymmetricFieldId(id);
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
};

module.exports = {
  getAll() {
    return bseQueries.getAll();
  },
  // async createBase(params) {
  //   const base = await bases.create(params.name);
  //   await positionsController.createPosition({
  //     parentId: 'baseParent', //TODO base的父级未确定
  //     id: base.id,
  //     type: 'base',
  //   });
  //   const table = await tablesController.createTable({
  //     baseId: base.id,
  //     name: 'Table 1',
  //   });
  //   return { base, table };
  // },
  async getOne(id) {
    const base = await bseQueries.getOne(id);
    if (!base) error(Status.Unauthorized, ECodes.BASE_NOT_FOUND);
  },
  // async deleteBase(baseId) {
  //   const result = await positions.getPositionsByIds([baseId]);
  //   await positionsController.deletePositions({
  //     deletePositions: [result[0].position],
  //     parentId: result[0].parentId,
  //     type: result[0].type,
  //   });
  //   const symmetricFieldIds = await findSymmetricFieldId(baseId);
  //   for (const i of symmetricFieldIds) {
  //     await fieldsController.deleteField(i);
  //   }
  //   const easyTables = await tables.getEasyTables(baseId);
  //   await positions.deleteParentId([baseId, ...easyTables.map(i => i.id)]);
  //   await bases.destroy(baseId);
  //   return null;
  // },

  async create(params) {
    const base = await bseQueries.create(params.name);
    await posController.create({
      //TODO base的父级未确定
      id: base.id,
      type: 'base',
    });
    const table = await tblController.createNewTableSet({
      baseId: base.id,
      name: 'Table 1',
    });
    return { base, table };
  },
};
