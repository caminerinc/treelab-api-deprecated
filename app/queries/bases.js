const { bases, positions } = require('../models');

module.exports = {
  getAllBases(db) {
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
      order: [[db.col('tablePositions.position'), 'asc']],
      order: [[db.col('pos.position'), 'asc']],
    });
  },

  createOneBase(db, name) {
    // https://github.com/caminerinc/elephante-api/pull/66/commits/b1144234e1f94d95c00d9b1aacc5b667d0b926a6#diff-2e7a0decef51e69d9691c3b5268aa9caR40
    // According to this, does this mean that its possible to send the actually sequelize db?
    // It breaks if that happens, or what other db is there that it would send?
    return bases.create({ name: name }, { transaction: db });
  },
};
