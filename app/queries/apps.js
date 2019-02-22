const { Apps, sequelize } = require('../models');

module.exports = {
  getAll() {
    return Apps.findAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    });
  },

  getOne(id) {
    return Apps.findOne({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      where: { id },
    });
  },
};
