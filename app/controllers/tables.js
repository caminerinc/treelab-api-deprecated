const {
  fields,
  fieldValues,
  numberTypes,
  foreignKeyTypes,
  records,
  tables,
  typeOptions,
  multipleAttachmentValues,
  foreignKeyValues,
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
          as: 'recs',
          include: [
            {
              model: fieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fldVs',
              include: [
                {
                  model: fields,
                  attributes: ['fieldTypeId'],
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
      ],
    });
  },
};
