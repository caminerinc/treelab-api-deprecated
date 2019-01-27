const { createUser, getAllUsers, getUser } = require('../controllers/users');
const { checkKeyExists } = require('../util/helper');
const { EMAIL_REGEX } = require('../constants/validations');
const { error, Status, ECodes } = require('../util/error');
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
    if (!EMAIL_REGEX.test(ctx.request.body.email))
      error(null, ECodes.INVALID_EMAIL);
    const user = await getUser(ctx.request.body);
    if (user) error(null, ECodes.USER_ALREADY_EXISTS);
    await createUser(ctx.request.body);
    ctx.body = { message: 'success' };
  },

  async resolveLogin(ctx) {
    checkKeyExists(ctx.request.body, 'email', 'password');
    const { email, password } = ctx.request.body;
    const user = await getUser({ email });
    if (!user) error(Status.Unauthorized, ECodes.USER_NOT_FOUND);
    if (!authenticate({ password, passwordDigest: user.passwordDigest }))
      error(Status.Unauthorized, ECodes.PASSWORD_ERROR);
    const token = getToken({ userId: user.id });
    ctx.body = { token };
  },

  resolveTestAuth(ctx) {
    try {
      createAuthToken({ token: ctx.headers.authorization });
    } catch (e) {
      error(Status.Unauthorized, ECodes.UNAUTHORIZED, e.message);
    }
    ctx.body = { message: 'success' };
  },
};
