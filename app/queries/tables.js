const {
  Fields,
  FieldValues,
  Positions,
  Records,
  Tables,
  sequelize,
} = require('../models');

module.exports = {
  create(params) {
    return Tables.create(params);
  },

  getEasyTable(id) {
    return Tables.findOne({ where: { id } });
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

  destroy(id) {
    return Tables.destroy({ where: { id } });
  },
};
