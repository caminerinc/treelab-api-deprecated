const Users = require('../models').users;
const helper = require('../util/helper');

module.exports = {
  findAllUser() {
    return Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'passwordDigest'],
      raw: true,
    });
  },
  createUser({ firstName, lastName, password, email }) {
    return Users.create({
      firstName,
      lastName,
      passwordDigest: helper.sha1(password),
      email,
    });
  },
};
