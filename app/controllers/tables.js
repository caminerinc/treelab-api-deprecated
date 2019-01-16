const {
  sequelize,
  fields,
  fieldValues,
  numberTypes,
  foreignKeyTypes,
  records,
  tables,
  multipleAttachmentValues,
  foreignKeyValues,
  positions,
} = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const { createPosition } = require('../controllers/positions');
const { createField } = require('../controllers/fields');
const { createRecord } = require('../controllers/records');

module.exports = {
  getTables(baseId) {
    return tables.findAll({
      attributes: ['id', 'name'],
      where: { baseId },
      include: [
        {
          model: fields,
          as: 'flds',
          attributes: ['id', 'name', 'fieldTypeId'],
          include: [
            {
              model: numberTypes,
              as: FIELD_TYPES[2].typeName,
            },
            {
              model: foreignKeyTypes,
              as: FIELD_TYPES[3].typeName,
            },
          ],
        },
        {
          model: positions,
          as: 'pos',
          attributes: ['position'],
          where: { type: 'table' },
          required: false,
        },
      ],
      order: [[sequelize.col('pos.position'), 'asc']],
    });
  },

  getTable(id) {
    return tables.findOne({
      attributes: ['id'],
      where: { id },
      include: [
        {
          attributes: ['id', 'createdAt'],
          model: records,
          as: 'recs',
          include: [
            {
              model: fieldValues,
              attributes: ['fieldId', 'textValue', 'numberValue'],
              as: 'fldVs',
              include: [
                {
                  model: fields,
                  attributes: ['fieldTypeId'],
                  as: 'fld',
                },
                {
                  model: multipleAttachmentValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'multiAttV',
                },
                {
                  model: foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'fgnKV',
                  include: [
                    {
                      model: fieldValues,
                      as: 'symFldV',
                      attributes: ['id', 'fieldId'],
                      include: [
                        {
                          model: records,
                          as: 'rec',
                          attributes: ['id'],
                        },
                      ],
                    },
                  ],
                },
                {
                  model: foreignKeyValues,
                  attributes: { exclude: ['createdAt', 'updatedAt'] },
                  as: 'symKV',
                  include: [
                    {
                      model: fieldValues,
                      as: 'fldV',
                      attributes: ['id'],
                      include: [
                        {
                          model: records,
                          as: 'rec',
                          attributes: ['id'],
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
          model: positions,
          as: 'positions',
          attributes: ['id', 'position', 'type'],
        },
      ],
      order: [
        [sequelize.col('positions.type'), 'asc'],
        [sequelize.col('positions.position'), 'asc'],
      ],
    });
  },

  async createTable(params, t1) {
    async function transactionSteps(t) {
      const table = await tables.create(params, { transaction: t });
      await createPosition(
        {
          parentId: params.baseId,
          id: table.id,
          type: 'table',
        },
        t,
      );
      const field1 = await createField(
        {
          tableId: table.id,
          name: 'Name',
          fieldTypeId: 1,
        },
        t,
      );
      const field2 = await createField(
        {
          tableId: table.id,
          name: 'Description',
          fieldTypeId: 1,
        },
        t,
      );
      let recordResults = [];
      for (let i = 0; i < 3; i++) {
        recordResults.push(await createRecord({ tableId: table.id }, t));
      }
      return { table, fields: [field1, field2], records: recordResults };
    }
    return t1
      ? transactionSteps(t1)
      : await sequelize.transaction(transactionSteps);
  },

  getEasyTable(id) {
    return tables.findOne({ where: { id } });
  },
};
