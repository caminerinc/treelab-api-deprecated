const usersController = require('../controllers').users;

module.exports = {
  /**
   * users 获取所有用户
   * @returns {Object[]} msg 数组形式
   * @returns {String} msg[].id 用户id
   * @returns {String} msg[].first_name 姓
   * @returns {String} msg[].last_name 名
   * @returns {String} msg[].email 邮箱
   * @returns {String} msg[].password_digest 密码摘要
   */
  async users(ctx) {
    try {
      const users = await usersController.findAllUser();
      ctx.body = users;
    } catch (err) {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: err.message || 'Sorry, an error has occurred.',
      };
    }
  },
};
