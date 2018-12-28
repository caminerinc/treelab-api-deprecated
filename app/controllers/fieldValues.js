const FieldValues = require('../models').fieldValues;
const helperUtil = require('../util').helper;

module.exports = {
  update(params) {
    return FieldValues.update(
      { textValue: params.textValue },
      { where: { id: params.id } },
    );
  },
  create(params) {
    return FieldValues.create(params);
  },
  getFieldValue(id) {
    return FieldValues.findOne({
      where: { id },
    });
  },
};
