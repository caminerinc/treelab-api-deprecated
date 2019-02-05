const ECodes = {
  UNIQUE_CONSTRAINT: {
    code: 'UNIQUE_CONSTRAINT',
    message: 'Duplicate key value violates unique constraint.',
  },
  FOREIGN_TABLE_NOT_FOUND: {
    code: 'FOREIGN_TABLE_NOT_FOUND',
    message: 'Foreign table not be found.',
  },
  FIELD_NAME_EXIST: {
    code: 'FIELD_NAME_EXIST',
    message: 'Field name already exists.',
  },
  REQUIRED: {
    code: 'PARAMS_REQUIRED',
    message: 'Parameters is required.',
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
  FIELD_VALUE_NOT_FOUND: {
    code: 'FIELD_VALUE_NOT_FOUND',
    message: 'Field value could not be found.',
  },
  FIELD_VALUE_NOT_ARRAY: {
    code: 'FIELD_VALUE_NOT_ARRAY',
    message: 'Field value is not an array.',
  },
  ITEM_NOT_FOUND: {
    code: 'ITEM_NOT_FOUND',
    message: 'Field value item is not found.',
  },
  INVALID_EMAIL: { code: 'INVALID_EMAIL', message: 'Incorrect email format.' },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: 'User already exists.',
  },
  UNSURPPORTED_FIELD_TYPE: {
    code: 'UNSURPPORTED_FIELD_TYPE',
    message: 'Unsupported field type.',
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
  PASSWORD_ERROR: {
    code: 'PASSWORD_ERROR',
    message: 'Password is wrong.',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'InternalServerError.',
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

module.exports = {
  ECodes,
  Status,
};
