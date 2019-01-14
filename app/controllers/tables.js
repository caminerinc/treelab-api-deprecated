const {
  sequelize,
  fields,
  fieldValues,
  numberTypes,
  foreignKeyTypes,
  records,
  tables,
  multipleAttachmentValues,
  foreignKeyValues,
  positions,
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
          as: 'flds',
          attributes: ['id', 'name', 'fieldTypeId'],
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
          as: 'recs',
          include: [
            {
              model: fieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fldVs',
              include: [
                {
                  model: fields,
                  attributes: ['fieldTypeId', 'width'],
                  as: 'fld',
                },
                {
                  model: multipleAttachmentValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'multiAttV',
                },
                {
                  model: foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'fgnKV',
                  include: [
                    {
                      model: fieldValues,
                      as: 'symFldV',
                      attributes: ['id', 'fieldId'],
                      include: [
                        {
                          model: records,
                          as: 'rec',
                          attributes: ['id'],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'symKV',
                  include: [
                    {
                      model: fieldValues,
                      as: 'fldV',
                      attributes: ['id'],
                      include: [
                        {
                          model: records,
                          as: 'rec',
                          attributes: ['id'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          model: positions,
          as: 'positions',
          attributes: ['id', 'position', 'type'],
          include: [
            {
              model: fields,
              as: 'field',
              attributes: ['width'],
            },
          ],
        },
      ],
      order: [
        [sequelize.col('positions.type'), 'asc'],
        [sequelize.col('positions.position'), 'asc'],
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
