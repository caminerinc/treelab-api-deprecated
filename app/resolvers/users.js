const { createUser, getAllUsers, getUser } = require('../controllers/users');
const { checkKeyExists } = require('../util/helper');
const { EMAIL_REGEX } = require('../constants/validations');
const { error, ECodes } = require('../util/error');
const { authenticate, createAuthToken, getToken } = require('../util/auth');

module.exports = {
  async resolveGetUsers(ctx) {
    const users = await getAllUsers();
    ctx.body = users;
  },

  async resolveCreateUser(ctx) {
    checkKeyExists(
      ctx.request.body,
      'firstName',
      'lastName',
      'password',
      'email',
    );

    if (!EMAIL_REGEX.test(ctx.request.body.email)) {
      error(400, ECodes.INVALID_EMAIL);
    }

    await createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },

  async resolveLogin(ctx) {
    checkKeyExists(ctx.request.body, 'email', 'password');

    const { email, password } = ctx.request.body;
    const user = await getUser({ email });
    if (!user) {
      ctx.status = 401;
      return (ctx.body = { error: 'This email does not exist' });
    }

    if (!authenticate({ password, passwordDigest: user.passwordDigest })) {
      ctx.status = 402;
      return (ctx.body = { error: 'wrong password' });
    }

    const token = getToken({ userId: user.id });

    ctx.body = { token };
  },

  resolveTestAuth(ctx) {
    try {
      createAuthToken({ token: ctx.headers.authorization });
    } catch (e) {
      ctx.status = 401;
      return (ctx.body = { error: e.message });
    }
    ctx.body = { message: 'success' };
  },
};
