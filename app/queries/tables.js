const {
  sequelize,
  Fields,
  FieldPositions,
  FieldValues,
  Records,
  RecordPositions,
  Tables,
  TablePositions,
  FieldTypes,
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
          model: FieldPositions,
          as: 'fieldPositions',
          attributes: ['siblingId'],
          include: [
            {
              model: Fields,
              as: 'field',
              attributes: ['width'],
            },
          ],
        },
        {
          model: RecordPositions,
          as: 'recordPositions',
          attributes: ['siblingId'],
        },
      ],
      order: [
        [sequelize.col('fieldPositions.position'), 'asc'],
        [sequelize.col('recordPositions.position'), 'asc'],
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
          include: [
            {
              model: FieldTypes,
              as: 'types',
              attributes: ['name'],
            },
          ],
        },
        {
          model: TablePositions,
          as: 'pos',
          attributes: ['position'],
          required: false,
        },
      ],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  getTableSchema(tableId) {
    return Fields.findAll({
      attributes: ['id', 'name', 'fieldTypeId', 'typeOptions'],
      where: { tableId },
      include: [
        {
          model: FieldPositions,
          as: 'pos',
          attributes: ['position'],
          required: false,
        },
        {
          model: FieldTypes,
          as: 'types',
          attributes: ['name'],
        },
      ],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  destroy(id) {
    return Tables.destroy({ where: { id } });
  },

  update({ name, tableId: id }) {
    return Tables.update({ name }, { where: { id } });
  },

  getTableByBaseAndName(baseId, name) {
    return Tables.findOne({
      attributes: ['name'],
      where: {
        $and: [
          { baseId },
          sequelize.where(
            sequelize.fn('lower', sequelize.col('name')),
            sequelize.fn('lower', name),
          ),
        ],
      },
    });
  },
};
