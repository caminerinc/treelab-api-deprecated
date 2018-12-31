const { users } = require('../models');
const { sha1 } = require('../util/helper');

module.exports = {
  dbGetAllUsers() {
    return users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'passwordDigest'],
      raw: true,
    });
  },
  dbCreateUser({ firstName, lastName, password, email }) {
    return users.create({
      firstName,
      lastName,
      passwordDigest: sha1(password),
      email,
    });
  },
  dbGetUser({ email }) {
    return users.findOne({
      where: {
        email,
      },
      raw: true,
    });
  },
};
