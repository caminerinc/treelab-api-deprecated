const Users = require('../models').users;

module.exports = {
  /**
   * 查询所有用户
   */
  findAllUser() {
    return Users.findAll({
      where: {},
      attributes: ['id', 'first_name', 'last_name', 'email', 'password_digest'],
      raw: true,
    });
  },
};
