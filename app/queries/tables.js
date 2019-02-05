const {
  Fields,
  FieldValues,
  Positions,
  Records,
  Tables,
  sequelize,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  create(params) {
    return Tables.create(params);
  },

  destroy(id) {
    return Tables.destroy({ where: { id } });
  },

  getEasyTable(id) {
    return Tables.findOne({ where: { id } });
  },

  // getEasyTables(baseId) {
  //   return Tables.findAll({ where: { baseId }, attributes: ['id'] });
  // },

  getAllByBaseId(baseId) {
    return Tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: Fields,
          as: 'flds',
          attributes: ['id', 'name', 'fieldTypeId', 'typeOptions'],
        },
        {
          model: Positions,
          as: 'pos',
          attributes: ['position'],
          where: { type: 'table' },
          required: false,
        },
      ],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  getOneById(id) {
    return Tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: Records,
          as: 'recs',
          include: [
            {
              model: FieldValues,
              attributes: ['fieldId', 'value'],
              as: 'fldVs',
            },
          ],
        },
        {
          model: Positions,
          as: 'positions',
          attributes: ['id', 'position', 'type'],
          include: [
            {
              model: Fields,
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

  // getSymmetricFieldIdsByTableId(id) {
  //   return Tables.findOne({
  //     where: {
  //       id,
  //     },
  //     include: [
  //       {
  //         where: {
  //           fieldTypeId: 3,
  //         },
  //         model: models.fields,
  //         as: 'flds',
  //         include: [
  //           {
  //             model: models.foreignKeyTypes,
  //             as: 'foreignKeyTypes',
  //             include: [
  //               {
  //                 model: models.fields,
  //                 as: 'symmetricField',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // },

  // getTableSchema(tableId) {
  //   return models.fields.findAll({
  //     attributes: ['id', 'name', 'fieldTypeId'],
  //     where: { tableId },
  //     include: [
  //       {
  //         model: models.numberTypes,
  //         as: FIELD_TYPES[2].typeName,
  //         attributes: { exclude: ['createdAt', 'updatedAt'] },
  //       },
  //       {
  //         model: models.foreignKeyTypes,
  //         as: FIELD_TYPES[3].typeName,
  //         attributes: { exclude: ['createdAt', 'updatedAt'] },
  //       },
  //       {
  //         model: models.positions,
  //         as: 'pos',
  //         attributes: ['position'],
  //         where: { type: 'field' },
  //         required: false,
  //       },
  //     ],
  //     order: [[models.sequelize.col('pos.position'), 'asc']],
  //   });
  // },
};
