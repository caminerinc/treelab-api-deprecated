const {
  bases,
  tables,
  fields,
  foreignKeyTypes,
  sequelize, // this should be removed when all function are updated to receive db
  positions,
} = require('../models');
const { createPosition } = require('../controllers/positions');
const { createTable } = require('../controllers/tables');

module.exports = {
  getBases() {
    return bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: positions,
          as: 'tablePositions',
          attributes: ['id', 'position'],
          where: { type: 'table' },
          required: false,
        },
        {
          model: positions,
          as: 'pos',
          attributes: ['position'],
          where: { type: 'base' },
          required: false,
        },
      ],
      order: [[sequelize.col('tablePositions.position'), 'asc']],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  async createBase(db, params) {
    async function transactionSteps(t) {
      // bases.createBase is hidding all the database mess.
      // It receives which db needs to create, in this case its the
      // transactional database t
      const base = bases.createBase(t, params.name);
      // Position needs to be created in the same transaction db `t`
      await createPosition(t,
        {
          parentId: 'baseParent', //TODO base的父级未确定
          id: base.id,
          type: 'base',
        }
      );
      // Same here, creating table in the transactional db t
      const table = await createTable(t, { baseId: base.id, name: 'Table 1' });
      return {
        id: result.base.id,
        name: result.base.name,
        primaryTableId: result.table.table.id,
      };
    }
    return await db.transaction(transactionSteps);
  },

  getBase(id) {
    return bases.findOne({
      attributes: ['id', 'name'],
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
