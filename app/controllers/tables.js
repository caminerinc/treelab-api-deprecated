const Tables = require('../models').tables;
const Fields = require('../models').fields;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;

module.exports = {
  findTables(baseId) {
    return Tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: Fields,
          as: 'fields',
          attributes: ['id', 'name'],
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
              attributes: ['fieldId'],
              model: FieldValues,
              as: 'fieldValues',
              include: [
                {
                  attributes: ['value'],
                  model: TextValues,
                  as: 'value',
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
