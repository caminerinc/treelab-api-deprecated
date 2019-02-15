const { FieldValues } = require('../models');

module.exports = {
  upsert({ recordId, fieldId, value }) {
    return FieldValues.upsert({
      recordId,
      fieldId,
      value,
    });
  },

  findOrCreate(recordId, fieldId) {
    return FieldValues.findOrCreate({
      where: { recordId, fieldId },
      defaults: { recordId, fieldId },
    }).spread(fieldValue => fieldValue);
  },

  find(recordId, fieldId) {
    return FieldValues.findOne({
      attributes: ['recordId', 'fieldId', 'value'],
      where: { recordId, fieldId },
    });
  },

  updateValue(recordId, fieldId, value) {
    return FieldValues.update({ value }, { where: { recordId, fieldId } });
  },

  destroy(recordId, fieldId) {
    return FieldValues.destroy({
      where: { recordId, fieldId },
    });
  },

  bulkCreate(records) {
    return FieldValues.bulkCreate(records);
  },
};
