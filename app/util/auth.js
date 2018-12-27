const jwt = require('jsonwebtoken');
const helper = require('./helper');

module.exports = {
  authenticate({ userPassword, password }) {
    return helper.sha1(password) === userPassword;
  },
  getToken(payload) {
    return jwt.sign(payload, process.env.SHARED_SECRET, {
      expiresIn: '4h',
    });
  },
  authToken({ token }) {
    return jwt.verify(token.split(' ')[1], process.env.SHARED_SECRET);
  },
};
