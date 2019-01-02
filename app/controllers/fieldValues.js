const { fieldValues } = require('../models');

module.exports = {
  dbUpdateFieldValue(params) {
    return fieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );
  },
  dbCreateFieldValue(params) {
    return fieldValues.create(params);
  },
  dbGetFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
  addFieldValue({ fieldValueId, value }) {
    return multipleAttachmentValues.create({
      fieldValueId,
      ...value,
    });
  },
};
