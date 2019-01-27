const ECodes = {
  REQUIRED: {
    code: 'PARAMS_REQUIRED',
    message: '? is required.',
  },
  BASE_NOT_FOUND: {
    code: 'BASE_NOT_FOUND',
    message: 'Base id could not be found.',
  },
  TABLE_NOT_FOUND: {
    code: 'TABLE_NOT_FOUND',
    message: 'Table id could not be found.',
  },
  FIELD_NOT_FOUND: {
    code: 'FIELD_NOT_FOUND',
    message: 'Field id could not be found.',
  },
  INVALID_EMAIL: { code: 'INVALID_EMAIL', message: 'Incorrect email format.' },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'User already exists.',
  },
  UNSURPPORTED_FIELD_TYPE: {
    code: 'UNSURPPORTED_FIELD_TYPE',
    message: 'Unsupported field type: ?.',
  },
  BULK_COPY_PARAMS_MISSING: {
    code: 'BULK_COPY_PARAMS_ERROR',
    message: 'SourceColumnConfigs and sourceCellValues2dArray must be array.',
  },
  ORIGINAL_POSITIONS_MISSING: {
    code: 'ORIGINAL_POSITIONS_MISSING',
    message: 'OriginalPositions can not be empty.',
  },
  ILLEGAL_TARGET_POSITION: {
    code: 'ILLEGAL_TARGET_POSITION',
    message: 'Illegal targetPosition.',
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'This email does not exist.',
  },
  EMAIL_ERROR: {
    code: 'EMAIL_ERROR',
    message: 'Email is wrong.',
  },
  PASSWORD_ERROR: {
    code: 'PASSWORD_ERROR',
    message: 'Password is wrong.',
  },
};

const Status = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  InternalServerError: 500,
};

/**
 * @param {Number=} status - default: Status.BadRequest
 * @param {Object} ecode - use "?" to generate an error message
 * @param {Number|String|Array=} params - used to replace "?"
 */
const error = (status, ecode, params) => {
  if (typeof status === 'object') {
    params = ecode;
    ecode = status;
    status = Status.BadRequest;
  }
  params = !Array.isArray(params) ? [params] : params;
  let message = '';
  let index = 0;
  for (const i in ecode.message) {
    if (ecode.message[i] === '?' && params[index]) {
      message += params[index];
      index++;
    } else {
      message += ecode.message[i];
    }
  }
  message = message[0].toUpperCase() + message.slice(1);
  throw { status, code: ecode.code, message };
};

module.exports = {
  error,
  Status,
  ECodes,
};
