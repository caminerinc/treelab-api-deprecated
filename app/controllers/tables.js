const Tables = require('../models').tables;
const Fields = require('../models').fields;
const TypeOptions = require('../models').typeOptions;
const NumberTypes = require('../models').numberTypes;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;
const NumberValues = require('../models').numberValues;

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
                  as: 'numberType',
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
              attributes: ['fieldId'],
              as: 'fieldValues',
              include: [
                {
                  model: Fields,
                  attributes: ['fieldTypeId'],
                  as: 'field',
                },
                {
                  attributes: ['value'],
                  model: TextValues,
                  as: 'textValue',
                },
                {
                  model: NumberValues,
                  attributes: ['value'],
                  as: 'numberValue',
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
