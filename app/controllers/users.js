const Users = require('../models').users;
const helper = require('../util/helper');
const jwt = require('jsonwebtoken');

module.exports = {
  findAllUser() {
    return Users.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'passwordDigest'],
      raw: true,
    });
  },
  createUser({ firstName, lastName, password, email }) {
    return Users.create({
      firstName,
      lastName,
      passwordDigest: helper.sha1(password),
      email,
    });
  },
  findOneUser({ email }) {
    return Users.findOne({
      where: {
        email,
      },
      raw: true,
    });
  },
  authenticate({ passwordDigest, password }) {
    return helper.sha1(password) === passwordDigest;
  },
  getToken({ payload }) {
    return jwt.sign(payload, process.env.sharedSecret, {
      expiresIn: '4h',
    });
  },
  authToken({ token }) {
    return jwt.verify(token.split(' ')[1], process.env.sharedSecret);
  },
};
