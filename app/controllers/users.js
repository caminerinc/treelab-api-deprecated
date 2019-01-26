const { users } = require('../models');
const { sha1 } = require('../util/helper');
const { error, ECodes } = require('../util/error');

const getAllUsers = () => {
  return users.findAll({
    attributes: ['id', 'firstName', 'lastName', 'email'],
    raw: true,
  });
};

const getUser = ({ email }) => {
  return users.findOne({
    where: {
      email,
    },
    raw: true,
  });
};

const createUser = async body => {
  const user = await getUser(body);
  if (user) {
    error(400, ECodes.USER_ALREADY_EXISTS);
  }

  const { firstName, lastName, password, email } = body;

  return users.create({
    firstName,
    lastName,
    passwordDigest: sha1(password),
    email,
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
};
