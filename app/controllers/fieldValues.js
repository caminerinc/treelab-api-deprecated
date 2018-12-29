const FieldValues = require('../models').fieldValues;

module.exports = {
  update(params) {
    return FieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  },
  create(params) {
    return FieldValues.create(params);
  },
  getFieldValue(recordId, fieldId) {
    return FieldValues.findOne({
      attributes: ['recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
};
