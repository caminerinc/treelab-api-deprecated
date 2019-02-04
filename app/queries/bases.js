const { Bases } = require('../models');

module.exports = {
  getAll() {
    return Bases.findAll({
      attributes: ['id', 'name'],
      // include: [
      //   {
      //     model: models.positions,
      //     as: 'tablePositions',
      //     attributes: ['id', 'position'],
      //     where: { type: 'table' },
      //     required: false,
      //   },
      //   {
      //     model: models.positions,
      //     as: 'pos',
      //     attributes: ['position'],
      //     where: { type: 'base' },
      //     required: false,
      //   },
      // ],
      // order: [[models.sequelize.col('tablePositions.position'), 'asc']],
      // order: [[models.sequelize.col('pos.position'), 'asc']],
    });
  },

  create(name) {
    return Bases.create({ name });
  },

  getOne(id) {
    return Bases.findOne({
      attributes: ['id', 'name', 'createdAt'],
      where: { id },
    });
  },

  // getBaseForSymmetricFieldId(id) {
  //   return models.bases.findOne({
  //     where: {
  //       id,
  //     },
  //     include: [
  //       {
  //         model: models.tables,
  //         as: 'tables',
  //         include: [
  //           {
  //             model: models.fields,
  //             as: 'flds',
  //             where: {
  //               fieldTypeId: 3,
  //             },
  //             include: [
  //               {
  //                 model: models.foreignKeyTypes,
  //                 attributes: ['symmetricFieldId'],
  //                 as: 'foreignKeyTypes',
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   });
  // },

  // destroy(id) {
  //   return models.bases.destroy({ where: { id } });
  // },
};
