const Users = require('../models').users;

module.exports = {
  findAllUser() {
    return Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'passwordDigest'],
      raw: true,
    });
  },
};
