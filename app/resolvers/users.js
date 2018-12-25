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
      return (ctx.body = { message: 'Incorrect email format' });
    }
    await usersController.createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },
  async login(ctx) {
    helper.checkKeyExists(ctx.request.body, 'email', 'password');

    if (!email_regex.test(ctx.request.body.email)) {
      ctx.status = 400;
      return (ctx.body = { message: 'Incorrect email format' });
    }
    let user = await usersController.findOneUser(ctx.request.body);

    if (!user) {
      ctx.status = 401;
      return (ctx.body = { message: 'Did not find this mailbox' });
    }
    let auth = await usersController.authenticate({
      password: ctx.request.body.password,
      passwordDigest: user.passwordDigest,
    });
    if (!auth) {
      ctx.status = 402;
      return (ctx.body = { message: 'wrong password' });
    }

    ctx.body = { message: 'success' };
  },
};
