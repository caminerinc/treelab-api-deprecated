const jwt = require('jsonwebtoken');
const helper = require('./helper');
const config = require('../../config/config');

module.exports = {
  authenticate({ passwordDigest, password }) {
    return helper.sha1(password) === passwordDigest;
  },
  getToken(payload) {
    return jwt.sign(payload, config.sharedSecret, {
      expiresIn: config.tokenExpiresIn || '4h',
    });
  },
  createAuthToken({ token }) {
    return jwt.verify(token.split(' ')[1], config.sharedSecret);
  },
};
