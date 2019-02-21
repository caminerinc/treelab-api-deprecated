const usrControllers = require('../controllers/users');
const { checkKeyExists } = require('../util/helper');
const { EMAIL_REGEX } = require('../constants/validations');
const { error, Status, ECodes } = require('../util/error');
const { authenticate, createAuthToken, getToken } = require('../util/auth');

const { prisma } = require('./generated/prisma-client');

module.exports = {
  async getAll(ctx) {
    const users = await usrControllers.getAll();
    ctx.body = users;
  },

  async create(ctx) {
    checkKeyExists(
      ctx.request.body,
      'firstName',
      'lastName',
      'password',
      'email',
    );
    if (!EMAIL_REGEX.test(ctx.request.body.email))
      error(null, ECodes.INVALID_EMAIL);
    await usrControllers.checkAndCreate(ctx.request.body);

    ctx.body = { message: 'success' };
  },

  async login(ctx) {
    checkKeyExists(ctx.request.body, 'email', 'password');
    const { email, password } = ctx.request.body;
    const user = await usrControllers.getOne({ email });

    if (!authenticate({ password, passwordDigest: user.passwordDigest }))
      error(Status.Unauthorized, ECodes.PASSWORD_ERROR);
    const token = getToken({ userId: user.id });
    ctx.body = { token };
  },

  testAuth(ctx) {
    try {
      createAuthToken({ token: ctx.headers.authorization });
    } catch (e) {
      error(Status.Unauthorized, ECodes.UNAUTHORIZED, e.message);
    }
    ctx.body = { message: 'success' };
  },
};
