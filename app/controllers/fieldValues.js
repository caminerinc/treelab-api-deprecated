const FieldValues = require('../models').fieldValues;

module.exports = {
  update(params) {
    return FieldValues.update(
      { value: params.value },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  },
  create(params) {
    return FieldValues.create(params);
  },
  getFieldValue(recordId, fieldId) {
    return FieldValues.findOne({ where: { recordId, fieldId } });
  },
};
