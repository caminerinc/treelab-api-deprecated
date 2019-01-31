const { sequelize, fields, foreignKeyTypes } = require('../models');

module.exports = {
  create(params) {
    return fields.create(params);
  },

  destroy(fieldId) {
    return fields.destroy({
      where: { id: { $in: Array.isArray(fieldId) ? fieldId : [fieldId] } },
      cascade: true,
    });
  },

  getField(id) {
    return fields.findOne({
      where: { id },
      attributes: ['id', 'name', 'tableId', 'fieldTypeId'],
      raw: true,
    });
  },

  getSymmetricFieldId(fieldId) {
    return fields.findOne({
      where: {
        id: fieldId,
      },
      attributes: [[sequelize.col(`foreignKeyTypes.symmetricFieldId`), 'id']],
      include: [
        {
          model: foreignKeyTypes,
          attributes: [],
          as: 'foreignKeyTypes',
        },
      ],
      raw: true,
    });
  },

  checkFieldNameExist(tableId, name) {
    return fields.findOne({ attributes: ['name'], where: { tableId, name } });
  },

  updateFieldWidth(id, width) {
    return fields.update({ width }, { where: { id } });
  },

  updateFieldName(id, name) {
    return fields.update({ name }, { where: { id } });
  },
};
