const models = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  create(params) {
    return models.tables.create(params);
  },

  destroy(id) {
    return models.tables.destroy({ where: { id } });
  },

  getEasyTable(id) {
    return models.tables.findOne({ where: { id } });
  },

  getEasyTables(baseId) {
    return models.tables.findAll({ where: { baseId }, attributes: ['id'] });
  },

  getTables(baseId) {
    return models.tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: models.fields,
          as: 'flds',
          attributes: ['id', 'name', 'fieldTypeId'],
          include: [
            {
              model: models.numberTypes,
              as: FIELD_TYPES[2].typeName,
            },
            {
              model: models.foreignKeyTypes,
              as: FIELD_TYPES[3].typeName,
            },
          ],
        },
        {
          model: models.positions,
          as: 'pos',
          attributes: ['position'],
          where: { type: 'table' },
          required: false,
        },
      ],
      order: [[models.sequelize.col('pos.position'), 'asc']],
    });
  },

  getTable(id) {
    return models.tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: models.records,
          as: 'recs',
          include: [
            {
              model: models.fieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fldVs',
              include: [
                {
                  model: models.fields,
                  attributes: ['fieldTypeId', 'width'],
                  as: 'fld',
                },
                {
                  model: models.multipleAttachmentValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'multiAttV',
                },
                {
                  model: models.foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'fgnKV',
                  include: [
                    {
                      model: models.fieldValues,
                      as: 'symFldV',
                      attributes: ['id', 'fieldId'],
                      include: [
                        {
                          model: models.records,
                          as: 'rec',
                          attributes: ['id', 'tableId'],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: models.foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'symKV',
                  include: [
                    {
                      model: models.fieldValues,
                      as: 'fldV',
                      attributes: ['id'],
                      include: [
                        {
                          model: models.records,
                          as: 'rec',
                          attributes: ['id', 'tableId'],
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
          model: models.positions,
          as: 'positions',
          attributes: ['id', 'position', 'type'],
          include: [
            {
              model: models.fields,
              as: 'field',
              attributes: ['width'],
            },
          ],
        },
      ],
      order: [
        [models.sequelize.col('positions.type'), 'asc'],
        [models.sequelize.col('positions.position'), 'asc'],
      ],
    });
  },

  getSymmetricFieldIdsByTableId(id) {
    return models.tables.findOne({
      where: {
        id,
      },
      include: [
        {
          where: {
            fieldTypeId: 3,
          },
          model: models.fields,
          as: 'flds',
          include: [
            {
              model: models.foreignKeyTypes,
              as: 'foreignKeyTypes',
              include: [
                {
                  model: models.fields,
                  as: 'symmetricField',
                },
              ],
            },
          ],
        },
      ],
    });
  },
};
