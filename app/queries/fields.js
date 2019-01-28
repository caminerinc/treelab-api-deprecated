const { sequelize, fields, foreignKeyTypes } = require('../models');

module.exports = {
  create: params => {
    return fields.create(params);
  },

  destroy: fieldId => {
    return fields.destroy({
      where: { id: { $in: Array.isArray(fieldId) ? fieldId : [fieldId] } },
      cascade: true,
    });
  },

  getSymmetricFieldId: fieldId => {
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
};
