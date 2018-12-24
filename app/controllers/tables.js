const Bases = require('../models').bases;
const Tables = require('../models').tables;
const Fields = require('../models').fields;
const FieldTypes = require('../models').fieldTypes;
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
          include: [
            {
              attributes: ['name'],
              model: FieldTypes,
              as: 'type',
            },
          ],
        },
      ],
    });
  },
};
