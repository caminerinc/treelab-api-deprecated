const { bases, positions } = require('../models');

module.exports = {
  getBases(db) {
    // What would happen if this is actually a transaction DB that is sent down?
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
};
