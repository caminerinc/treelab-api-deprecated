const { sequelize, Fields, foreignKeyTypes } = require('../models');

module.exports = {
  create(params) {
    return Fields.create(params);
  },

  destroy(fieldId) {
    return Fields.destroy({
      where: { id: { $in: Array.isArray(fieldId) ? fieldId : [fieldId] } },
      cascade: true,
    });
  },

  getById(id) {
    return Fields.findOne({
      where: { id },
      attributes: ['id', 'name', 'tableId', 'fieldTypeId'],
    });
  },

  // getSymmetricFieldId(fieldId) {
  //   return fields.findOne({
  //     where: {
  //       id: fieldId,
  //     },
  //     attributes: [[sequelize.col(`foreignKeyTypes.symmetricFieldId`), 'id']],
  //     include: [
  //       {
  //         model: foreignKeyTypes,
  //         attributes: [],
  //         as: 'foreignKeyTypes',
  //       },
  //     ],
  //     raw: true,
  //   });
  // },

  getFieldByTableAndName(tableId, name) {
    return Fields.findOne({ attributes: ['name'], where: { tableId, name } });
  },

  updateWidth(id, width) {
    return Fields.update({ width }, { where: { id } });
  },

  // updateFieldName(id, name) {
  //   return fields.update({ name }, { where: { id } });
  // },

  update(updates, id) {
    return Fields.update(updates, { where: { id } });
  },
};
