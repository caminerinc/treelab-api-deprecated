const usersController = require('../controllers').users;
const helper = require('../util/helper');
const email_regex = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

module.exports = {
  async users(ctx) {
    const users = await usersController.findAllUser();
    ctx.body = users;
  },
  async user(ctx) {
    helper.checkKeyExists(
      ctx.request.body,
      'firstName',
      'lastName',
      'password',
      'email',
    );

    if (!email_regex.test(ctx.request.body.email)) {
      ctx.status = 400;
      return (ctx.body = { message: 'The mailbox is incorrect' });
    }
    await usersController.createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },
};
