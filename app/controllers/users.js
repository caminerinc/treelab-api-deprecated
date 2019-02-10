const { error, Status, ECodes } = require('../util/error');
const usrQueries = require('../queries/users');

const getAll = () => usrQueries.getAll();

const getOne = async params => {
  const user = await usrQueries.getOne(params);
  if (!user) error(Status.Unauthorized, ECodes.USER_NOT_FOUND);

  return user;
};

const checkAndCreate = async params => {
  const user = await usrQueries.getOne(params);
  if (user) error(null, ECodes.USER_ALREADY_EXISTS);
  await usrQueries.create(params);
};

module.exports = {
  checkAndCreate,
  getAll,
  getOne,
};
