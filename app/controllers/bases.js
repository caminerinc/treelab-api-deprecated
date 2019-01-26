const {
  bases,
  tables,
  fields,
  foreignKeyTypes,
  sequelize,
  positions,
} = require('../models');
const { createOneBase, getAllBases } = require('../queries/bases');
const { createPosition } = require('../controllers/positions');
const { createTable } = require('../controllers/tables');

module.exports = {
  getBases(db) {
    return getAllBases(db);
  },

  async createBase(db, params) {
    async function transactionSteps(t) {
      const base = await createOneBase(db, params.name);

      // needs to be refactored
      await createPosition(
        // looks like the ordering for new bases doesn't work correctly.
        {
          parentId: 'baseParent', //TODO base的父级未确定
          id: base.id,
          type: 'base',
        },
        t,
      );
      // also needs to be refactored
      const table = await createTable({ baseId: base.id, name: 'Table 1' }, t);

      return {
        id: base.id,
        name: base.name,
        primaryTableId: table.table.id,
      };
    }
    return await db.transaction(transactionSteps);
  },

  getBase(id) {
    return bases.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: { id },
    });
  },

  deleteBase(id, fieldId) {
    return sequelize.transaction(async t => {
      await fields.destroy(
        {
          where: {
            id: {
              $in: fieldId,
            },
          },
        },
        { transaction: t },
      );
      return await bases.destroy(
        {
          where: {
            id,
          },
        },
        { transaction: t },
      );
    });
  },
  async findSymmetricFieldId({ baseId: id }) {
    const base = await bases.findOne({
      where: {
        id,
      },
      include: [
        {
          model: tables,
          as: 'tables',
          include: [
            {
              where: {
                fieldTypeId: 3,
              },
              model: fields,
              as: 'flds',
              include: [
                {
                  model: foreignKeyTypes,
                  attributes: ['symmetricFieldId'],
                  as: 'foreignKeyTypes',
                },
              ],
            },
          ],
        },
      ],
    });
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
