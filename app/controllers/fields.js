const Bases = require('../models').bases;
const Tables = require('../models').tables;
const Fields = require('../models').fields;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;

module.exports = {
  createField(params) {
    return Fields.create({
      name: params.name,
      tableId: params.tableId,
      fieldTypeId: params.fieldTypeId,
    });
  },
};
