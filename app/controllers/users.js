const { users } = require('../models');
const { sha1 } = require('../util/helper');

module.exports = {
  getAllUsers() {
    return users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email'],
      raw: true,
    });
  },
  createUser({ firstName, lastName, password, email }) {
    return users.create({
      firstName,
      lastName,
      passwordDigest: sha1(password),
      email,
    });
  },
  getUser({ email }) {
    return users.findOne({
      where: {
        email,
      },
      raw: true,
    });
  },
};
