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

  bulkUpdate(fieldId, records) {
    let sql = `update "FieldValues" set "value" = case`;
    records.forEach(i => {
      let value = null;
      if (i.value !== null) {
        if (typeof i.value === 'string') {
          value = `'"${i.value}"'`;
        } else {
          value = `'${i.value}'`;
        }
      }
      sql += ` when "id" = ${i.id} then ${value}`;
    });
    sql += ` else "value" end where "fieldId" = '${fieldId}'`;
    return sequelize.query(sql);
  },

  getValuesWithRecords(fieldId, recordIds) {
    return FieldValues.findAll({
      attributes: ['fieldId', 'recordId', 'value'],
      where: { fieldId, recordId: { $in: recordIds } },
    });
  },
};
