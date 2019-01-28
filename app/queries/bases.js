const {
  bases,
  tables,
  fields,
  foreignKeyTypes,
  sequelize,
  positions,
} = require('../models');

module.exports = {
  getAllBases() {
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

  creatOneBase(name) {
    async function transactionSteps(t) {
      const transact = { transaction: t };
      const base = await bases.create(
        {
          name: name,
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
    return sequelize.transaction(transactionSteps);
  },

  getOneBase(id) {
    return bases.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: { id },
    });
  },

  deleteOneBase(id, fieldId) {
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
      return bases.destroy(
        {
          where: {
            id,
          },
        },
        { transaction: t },
      );
    });
  },

  findOneSymmetricFieldId(id) {
    return bases.findOne({
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
  },
};
