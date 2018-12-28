const DB = require('../models');

const FIELD_TYPES = {
  1: {
    name: 'text',
    valueModel: DB.textValues,
  },
  2: {
    name: 'number',
    typeModel: DB.numberTypes,
    valueModel: DB.numberValues,
    typeField: 'numberTypeId',
  },
};

module.exports = {
  FIELD_TYPES,
};
