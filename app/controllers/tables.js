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
                  attributes: ['fieldTypeId', 'width', 'name'],
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
                          attributes: ['id', 'tableId'],
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
          model: positions,
          as: 'positions',
          attributes: ['id', 'position', 'type'],
          include: [
            {
              model: fields,
              as: 'field',
              attributes: ['name', 'width'],
            },
          ],
        },
      ],
      order: [[sequelize.col('positions.type'), 'asc'], [sequelize.col('positions.position'), 'asc']],
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
      field1.name = 'Name';
      field1.fieldTypeId = 1;
      const field2 = await createField(
        {
          tableId: table.id,
          name: 'Description',
          fieldTypeId: 1,
        },
        t,
      );
      field2.name = 'Description';
      field2.fieldTypeId = 1;
      let recordResults = [];
      for (let i = 0; i < 3; i++) {
        recordResults.push(await createRecord({ tableId: table.id }, t));
      }
      return { table, fields: [field1, field2], records: recordResults };
    }
    return t1 ? transactionSteps(t1) : await sequelize.transaction(transactionSteps);
  },

  getEasyTable(id) {
    return tables.findOne({ where: { id } });
  },

  getTableByBaseId({ baseId }) {
    return tables.findAll({ where: { baseId }, attributes: ['id'] });
  },

  findSymmetricFieldId({ tableId: id }) {
    return tables.findOne({
      where: {
        id,
      },
      attributes: ['baseId', sequelize.col('flds->foreignKeyTypes')],
      include: [
        {
          where: {
            fieldTypeId: 3,
          },
          model: fields,
          as: 'flds',
          include: [
            {
              model: foreignKeyTypes,
              attributes: ['symmetricFieldId'],
              as: 'foreignKeyTypes',
            },
          ],
        },
      ],
    });
  },

  async deleteTable(id, fieldId) {
    return sequelize.transaction(async t => {
      await fields.destroy({ where: { id: { $in: fieldId } } }, { transaction: t });
      return await tables.destroy({ where: { id } }, { transaction: t });
    });
  },
};
