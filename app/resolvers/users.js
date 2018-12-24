const usersController = require('../controllers').users;
const helper = require('../util/helper');

module.exports = {
  async users(ctx) {
    const users = await usersController.findAllUser();
    ctx.body = users;
  },
};
