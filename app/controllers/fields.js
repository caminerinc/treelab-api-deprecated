const Bases = require('../models').bases;
const Tables = require('../models').tables;
const Fields = require('../models').fields;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;

module.exports = {
  create(params) {
    return Fields.create(params);
  },
};
