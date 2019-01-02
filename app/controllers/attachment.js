const { fieldValues, multipleAttachmentValues } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  findFieldValue({ recordId, fieldId, typeId }) {
    return fieldValues.findOne({
      where: {
        recordId,
        fieldId,
      },
      attributes: ['id'],
      raw: true,
    });
  },
  addFieldValue({ fieldValueId, value }) {
    return multipleAttachmentValues.create({
      fieldValueId,
      ...value,
    });
  },
};
