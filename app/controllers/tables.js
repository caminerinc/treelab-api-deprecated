const {
  fields,
  fieldValues,
  numberTypes,
  records,
  tables,
  typeOptions,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  dbGetTables(baseId) {
    return tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: fields,
          as: 'fields',
          attributes: ['id', 'name', 'fieldTypeId', 'typeOptionsId'],
          include: [
            {
              model: typeOptions,
              as: 'typeOptions',
              include: [
                {
                  model: numberTypes,
                  as: FIELD_TYPES[2].typeName,
                },
              ],
            },
          ],
        },
      ],
    });
  },

  dbGetTable(id) {
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
              ],
            },
          ],
        },
      ],
    });
  },
};
