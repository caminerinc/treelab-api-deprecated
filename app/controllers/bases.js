const { bases, positions, sequelize } = require('../models');
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

  async createBase(params) {
    async function transactionSteps(t) {
      const transact = { transaction: t };
      const base = await bases.create(
        {
          name: params.name,
        },
        transact,
      );
      await createPosition(
        {
          parentId: 'baseParent', //TODO base的父级未确定
          id: base.id,
          type: 'base',
        },
        t,
      );
      const table = await createTable({ baseId: base.id, name: 'Table 1' }, t);
      return { base, table };
    }
    return await sequelize.transaction(transactionSteps);
  },

  getBase(id) {
    return bases.findOne({
      attributes: ['id', 'name'],
      where: { id },
    });
  },
};
