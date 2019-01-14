const {
  bases,
  tables,
  fields,
  foreignKeyTypes,
  sequelize,
} = require('../models');

module.exports = {
  getBases() {
    return bases.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: tables,
          as: 'tables',
          attributes: ['id'],
        },
      ],
    });
  },

  async createBase(params) {
    return await bases.create({
      name: params.name,
    });
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
          // attributes: [sequelize.col('foreignKeyTypes')],
          as: 'tables',
          include: [
            {
              where: {
                fieldTypeId: 3,
              },
              model: fields,
              // attributes: ['flds->foreignKeyTypes'],
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
    const flds = [];
    for (let i = 0; i < base.tables.length; i++) {
      // flds = flds.concat(base.tables[i].flds);
      flds.push(...base.tables[i].flds);
    }
    const symmetricFieldId = [];
    for (let i = 0; i < flds.length; i++) {
      symmetricFieldId.push(flds[i].foreignKeyTypes.symmetricFieldId);
    }
    return symmetricFieldId;
  },
};
