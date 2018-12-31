const Tables = require('../models').tables;
const Fields = require('../models').fields;
const TypeOptions = require('../models').typeOptions;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;
const NumberValues = require('../models').numberValues;
const NumberTypes = require('../models').numberTypes;

const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  findTables(baseId) {
    return Tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: Fields,
          as: 'fields',
          attributes: ['id', 'name', 'fieldTypeId', 'typeOptionsId'],
          include: [
            {
              model: TypeOptions,
              as: 'typeOptions',
              include: [
                {
                  model: NumberTypes,
                  as: FIELD_TYPES[2].typeName,
                },
              ],
            },
          ],
        },
      ],
    });
  },

  findTable(id) {
    return Tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: Records,
          as: 'records',
          include: [
            {
              model: FieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fieldValues',
              include: [
                {
                  model: Fields,
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
