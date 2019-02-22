const { Templates, sequelize } = require('../models');

module.exports = {
  getOne(id) {
    return Templates.findOne({
      attributes: { exclude: ['updatedAt', 'createdAt'] },
      where: { id },
    });
  },
};
