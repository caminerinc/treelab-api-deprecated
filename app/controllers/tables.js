const {
  fields,
  fieldValues,
  numberTypes,
  foreignKeyTypes,
  records,
  tables,
  typeOptions,
  multipleAttachmentValues,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  getTables(baseId) {
    return tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: fields,
          as: 'fields',
          attributes: ['id', 'name', 'fieldTypeId', 'typeOptionId'],
          include: [
            {
              model: typeOptions,
              as: 'typeOptions',
              include: [
                {
                  model: numberTypes,
                  as: FIELD_TYPES[2].typeName,
                },
                {
                  model: foreignKeyTypes,
                  as: FIELD_TYPES[3].typeName,
                },
              ],
            },
          ],
        },
      ],
    });
  },

  getTable(id) {
    return tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: records,
          as: 'records',
          include: [
            {
              model: fieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fieldValues',
              include: [
                {
                  model: fields,
                  attributes: ['fieldTypeId'],
                  as: 'field',
                },
                {
                  model: multipleAttachmentValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'multipleAttachmentValues',
                },
              ],
            },
          ],
        },
        {
          model: fields,
          as: 'fieldPositions',
          attributes: ['id'],
        },
        {
          model: records,
          as: 'recordPositions',
          attributes: ['id'],
        },
      ],
    });
  },

  createTable(params) {
    return tables.create(params);
  },

  getEasyTable(id) {
    return tables.findOne({ where: { id } });
  },
};
