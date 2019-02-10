const { sequelize, Users } = require('../models');
const { sha1 } = require('../util/helper');

module.exports = {
  getAll() {
    return Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email'],
    });
  },

  create({ firstName, lastName, password, email }) {
    return Users.create({
      firstName,
      lastName,
      passwordDigest: sha1(password),
      email,
    });
  },

  getOne({ email }) {
    return Users.findOne({
      where: {
        email,
      },
    });
  },
};
