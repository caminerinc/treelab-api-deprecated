const { sequelize, FieldValues } = require('../models');

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

  getValuesByFieldId(fieldId) {
    return FieldValues.findAll({
      attributes: ['id', 'value'],
      where: { fieldId },
    });
  },

  bulkUpdateToNumber(fieldId, records) {
    let sql = `update "FieldValues" set "value" = case`;
    let values = [];
    records.forEach(i => {
      sql += ` when "id" = ${i.id} then ?`;
      values.push(i.value);
    });
    sql += ` else "value" end where "fieldId" = '${fieldId}'`;
    return sequelize.query(sql, { replacements: values });
  },
};
