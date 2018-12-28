const DB = require('../models');

module.exports = {
  findTables(baseId) {
    return DB.tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: DB.fields,
          as: 'fields',
          attributes: ['id', 'name', 'fieldTypeId'],
        },
      ],
    });
  },

  findTable(id) {
    return DB.tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: DB.records,
          as: 'records',
          include: [
            {
              attributes: ['fieldId'],
              model: DB.fieldValues,
              as: 'fieldValues',
              include: [
                {
                  model: DB.fields,
                  attributes: ['fieldTypeId'],
                  as: 'field',
                },
                {
                  attributes: ['value'],
                  model: DB.textValues,
                  as: 'value',
                },
                {
                  model: DB.multipleAttachmentValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'multipleAttachmentValues',
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
