const { sequelize, users } = require('../models');
const { sha1 } = require('../util/helper');

module.exports = {
  getAll() {
    return users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });
  },

  create({ firstName, lastName, password, email }) {
    return users.create({
      firstName,
      lastName,
      passwordDigest: sha1(password),
      email,
    });
  },

  getOne({ email }) {
    return users.findOne({
      where: {
        email,
      },
    });
  },
};
