const { ECodes, Status } = require('../constants/codes');

/**
 * @param {Number} status
 * @param {Object} ecode
 * @param {Array|String|Number=} params
 */
const error = (status, ecode, params) => {
  let err = new Error(ecode.message);
  err.status = status || Status.BadRequest;
  err.code = ecode.code;
  err.details = !Array.isArray(params) ? [params] : params;
  throw err;
};

module.exports = {
  error,
  Status,
  ECodes,
};
