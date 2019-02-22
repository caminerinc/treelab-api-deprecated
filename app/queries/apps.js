const { Apps, sequelize } = require('../models');

module.exports = {
  getAll() {
    return Apps.findAll({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
    });
  },
};
