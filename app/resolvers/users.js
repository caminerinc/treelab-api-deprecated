const usersController = require('../controllers').users;
const { helper, auth } = require('../util');
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
      return (ctx.body = { error: 'Incorrect email format' });
    }
    await usersController.createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },
  async login(ctx) {
    helper.checkKeyExists(ctx.request.body, 'email', 'password');

    const { email, password } = ctx.request.body;

    const user = await usersController.findOneUser({ email });
    if (!user) {
      ctx.status = 401;
      return (ctx.body = { error: 'This email does not exist' });
    }

    if (!auth.authenticate({ password, passwordDigest: user.passwordDigest })) {
      ctx.status = 402;
      return (ctx.body = { error: 'wrong password' });
    }

    const token = auth.getToken({
      userId: user.id,
    });

    ctx.body = { token };
  },
  testAuth(ctx) {
    try {
      auth.authToken({
        token: ctx.headers.authorization,
      });
    } catch (e) {
      ctx.status = 401;
      return (ctx.body = { error: e.message });
    }
    ctx.body = { message: 'success' };
  },
};
