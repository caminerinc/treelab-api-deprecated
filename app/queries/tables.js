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
    const sql = `SELECT "Tables"."id",
                    Records."id" AS "Records.id",
                    Fields."id" AS "Fields.id",
                    Fields."width" AS "Fields.width",
                    FieldValues."id" AS "FieldValues.id",
                    FieldValues."value" AS "FieldValues.value",
                    RecordPositions."siblingId" AS "RecordPositions.siblingId"
                  FROM "Tables"
                  LEFT JOIN "Records" AS Records ON Records."tableId"="Tables"."id"
                  LEFT JOIN "Fields" AS Fields ON Fields."tableId"="Tables"."id"
                  LEFT JOIN "FieldValues" as FieldValues ON Records."id"=FieldValues."recordId" AND Fields."id"=FieldValues."fieldId"
                  LEFT JOIN "FieldPositions" as FieldPositions ON FieldPositions."siblingId"=Fields."id"
                  LEFT JOIN "RecordPositions" as RecordPositions ON RecordPositions."siblingId"=Records."id"
                  WHERE "Tables"."id" = ?
                  ORDER BY FieldPositions."position" ASC, RecordPositions."position" ASC;`;
    return sequelize.query(sql, { replacements: [id] });
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

  bulkCreate(records) {
    return Tables.bulkCreate(records);
  },
};
