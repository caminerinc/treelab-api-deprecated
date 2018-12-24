const Bases = require('../models').bases;
const Tables = require('../models').tables;
const Fields = require('../models').fields;
const FieldTypes = require('../models').fieldTypes;
const Records = require('../models').records;
const FieldValues = require('../models').fieldValues;
const TextValues = require('../models').textValues;

module.exports = {
  findByBaseId(baseId) {
    return Bases.findOne({
      where: {
        id: baseId,
      },
      include: [
        {
          model: Tables,
          as: 'tables',
          limit: 30,
          include: [
            {
              model: Fields,
              as: 'fields',
              include: [
                {
                  model: FieldTypes,
                  as: 'type',
                },
              ],
            },
            {
              model: Records,
              as: 'records',
              include: [
                {
                  model: FieldValues,
                  as: 'fieldValues',
                  include: [
                    {
                      model: TextValues,
                      as: 'value',
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
