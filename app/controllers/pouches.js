const { pouches, modules } = require('../models');

module.exports = {
  getPouches() {
    return pouches.findAll({
      attributes: ['id', 'name'],
    });
  },
  getPouch(id) {
    return pouches.findOne({
      attributes: ['id', 'name', 'baseId', 'triggerFieldId', 'triggerTableId'],
      include: [
        {
          model: modules,
          as: 'module',
          attributes: ['id', 'name'],
        },
      ],
      where: { id },
    });
  },
};
