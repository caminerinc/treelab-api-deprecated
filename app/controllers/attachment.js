const DB = require('../models');
const { FIELD_TYPES } = require('../constants').fieldTypes;

module.exports = {
  findFieldValue({ recordId, fieldId, typeId }) {
    return DB.fieldValues.findOne({
      where: {
        recordId,
        fieldId,
      },
      attributes: ['id'],
      raw: true,
    });
  },
  addFieldValue({ fieldValueId, typeId, value }) {
    console.log(value);
    return FIELD_TYPES[typeId].valueModel.create({
      fieldValueId,
      ...value,
    });
  },
};
