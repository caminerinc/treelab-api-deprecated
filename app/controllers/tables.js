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
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const _ = require('lodash');

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

  async getTable(id) {
    return await tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          model: records,
          attributes: ['id', 'createdAt'],
          as: 'records',
          required: false,
          include: [
            {
              association: records.hasMany(fieldValues, {
                foreignKey: 'recordId',
                as: 'fV',
              }),
              as: 'fV',
              attributes: ['fieldId', 'textValue', 'numberValue'],
              required: false,
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
                {
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  model: foreignKeyValues,
                  as: 'foreignKeyValue',
                  required: false,
                  include: [
                    {
                      model: fieldValues,
                      as: 'symmetricFieldValue',
                      attributes: ['id'],
                      required: false,
                      // SEQUELIZE BUG, KEYS ARE BEING SLICED
                      include: [
                        {
                          model: records,
                          as: 'record',
                        },
                      ],
                    },
                  ],
                },
                {
                  model: foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'symmetricKeyValue',
                  include: [
                    {
                      model: fieldValues,
                      as: 'fieldValue',
                      attributes: ['id'],
                      include: [
                        {
                          model: records,
                          as: 'record',
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
