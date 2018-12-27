const usersController = require('../controllers').users;
const helperUtil = require('../util').helper;
const authUtil = require('../util').auth;
const email_regex = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

module.exports = {
  async users(ctx) {
    const users = await usersController.findAllUser();
    ctx.body = users;
  },
  async user(ctx) {
    helperUtil.checkKeyExists(
      ctx.request.body,
      'firstName',
      'lastName',
      'password',
      'email',
    );

    if (!email_regex.test(ctx.request.body.email)) {
      ctx.status = 400;
      return (ctx.body = { error: 'Incorrect email format' });
    }
    await usersController.createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },
  async login(ctx) {
    helperUtil.checkKeyExists(ctx.request.body, 'email', 'password');

    const { email, password } = ctx.request.body;

    const user = await usersController.findOneUser({ email });
    if (!user) {
      ctx.status = 401;
      return (ctx.body = { error: 'This email does not exist' });
    }

    if (!authUtil.authenticate({ password, userPassword: user.password })) {
      ctx.status = 402;
      return (ctx.body = { error: 'wrong password' });
    }

    const token = authUtil.getToken({
      userId: user.id,
    });

    ctx.body = { token };
  },
  testAuth(ctx) {
    try {
      authUtil.authToken({
        token: ctx.headers.authorization,
      });
    } catch (e) {
      ctx.status = 401;
      return (ctx.body = { error: e.message });
    }
    ctx.body = { message: 'success' };
  },
};
