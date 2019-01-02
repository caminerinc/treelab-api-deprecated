const { fieldValues } = require('../models');

module.exports = {
  updateFieldValue(params) {
    return fieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  },
  createFieldValue(params) {
    return fieldValues.create(params);
  },
  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
};
