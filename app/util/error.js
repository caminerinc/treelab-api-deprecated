const error = (status, ecode) => {
  throw {status: status, code: ecode.code, message: ecode.message};
}

const ECodes = {
  BASE_NOT_FOUND: {code: "BASE_NOT_FOUND", message: "Base id could not be found."},
  INVALID_EMAIL: {code: "INVALID_EMAIL", message: "Incorrect email format."},
  USER_ALREADY_EXISTS: {code: "USER_ALREADY_EXISTS", message: "User already exists."},
}

module.exports = {
  error,
  ECodes,
};
