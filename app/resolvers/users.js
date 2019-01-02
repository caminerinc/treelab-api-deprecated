const {
  dbCreateUser,
  dbGetAllUsers,
  dbGetUser,
} = require('../controllers/users');
const { checkKeyExists } = require('../util/helper');
const { EMAIL_REGEX } = require('../constants/validations');
const { authenticate, createAuthToken, getToken } = require('../util/auth');

module.exports = {
  async getUsers(ctx) {
    const users = await dbGetAllUsers();
    ctx.body = users;
  },

  async createUser(ctx) {
    checkKeyExists(
      ctx.request.body,
      'firstName',
      'lastName',
      'password',
      'email',
    );

    if (!EMAIL_REGEX.test(ctx.request.body.email)) {
      ctx.status = 400;
      return (ctx.body = { error: 'Incorrect email format' });
    }
    await dbCreateUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },

  async login(ctx) {
    checkKeyExists(ctx.request.body, 'email', 'password');

    const { email, password } = ctx.request.body;
    const user = await dbGetUser({ email });
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

  testAuth(ctx) {
    try {
      createAuthToken({ token: ctx.headers.authorization });
    } catch (e) {
      ctx.status = 401;
      return (ctx.body = { error: e.message });
    }
    ctx.body = { message: 'success' };
  },
};
