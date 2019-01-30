const users = require('../queries/users');

module.exports = {
  getAllUsers() {
    return users.getAllUsers();
  },

  createUser(params) {
    return users.create(params);
  },

  getUser(params) {
    return users.getUser(params);
  },
};
