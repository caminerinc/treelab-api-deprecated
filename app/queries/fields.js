const { sequelize, Fields, FieldTypes } = require('../models');

module.exports = {
  create(params) {
    return Fields.create(params);
  },

  getById(id) {
    return Fields.findOne({
      where: { id },
      attributes: ['id', 'name', 'tableId', 'fieldTypeId'],
      include: [
        {
          model: FieldTypes,
          as: 'types',
          attributes: { exclude: ['updatedAt', 'createdAt'] },
        },
      ],
    });
  },

  getFieldByTableAndName(tableId, name) {
    return Fields.findOne({
      attributes: ['name'],
      where: {
        $and: [
          { tableId },
          sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            sequelize.fn('lower', name),
          ),
        ],
      },
    });
  },

  update(updates, id) {
    return Fields.update(updates, { where: { id } });
  },

  updateWidth(id, width) {
    return Fields.update({ width }, { where: { id } });
  },

  destroy(fieldId) {
    return Fields.destroy({
      where: { id: { $in: Array.isArray(fieldId) ? fieldId : [fieldId] } },
      cascade: true,
    });
  },

  bulkCreate(records) {
    return Fields.bulkCreate(records);
  },
};
