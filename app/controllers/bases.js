const {
  getAllBases,
  creatOneBase,
  getOneBase,
  deleteOneBase,
  findOneSymmetricFieldId,
} = require('../queries/bases');
const { createPosition } = require('../controllers/positions');
const { createTable } = require('../controllers/tables');

module.exports = {
  getBases() {
    return getAllBases();
  },

  createBase(params) {
    return creatOneBase(params.name);
  },

  getBase(id) {
    return getOneBase(id);
  },

  deleteBase(id, fieldId) {
    return deleteOneBase(id, fieldId);
  },

  async findSymmetricFieldId(id) {
    const base = await findOneSymmetricFieldId(id);
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
