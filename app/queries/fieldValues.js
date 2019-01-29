const models = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = {
  create(params) {
    return models.fieldValues.create(params);
  },

  createMultipleAttachmentValue(params) {
    return models.multipleAttachmentValues.create(params);
  },

  createForeignKeyValue(params) {
    return models.foreignKeyValues.create(params);
  },

  upsertGenericFieldValue({ recordId, fieldId, value }, valueName) {
    return models.fieldValues.upsert(
      {
        recordId: recordId,
        fieldId: fieldId,
        [valueName]: value,
      },
      {
        fields: [valueName],
      },
    );
  },

  findCreateFindFieldValue(recordId, fieldId) {
    return models.fieldValues
      .findCreateFind({ where: { recordId, fieldId } })
      .spread(fieldValue => fieldValue);
  },

  findOrCreateFieldValue(recordId, fieldId) {
    return models.fieldValues
      .findOrCreate({
        where: { recordId, fieldId },
        defaults: { recordId, fieldId },
      })
      .spread(fieldValue => fieldValue);
  },

  destroyMultipleAttachmentValue(id) {
    return models.multipleAttachmentValues.destroy({ where: { id } });
  },

  destroyForeignFieldValue(fieldValueId, symmetricFieldValueId) {
    return models.foreignKeyValues.destroy({
      where: {
        fieldValueId,
        symmetricFieldValueId,
      },
    });
  },

  getForeignFieldValue({ recordId, fieldId, itemId }) {
    const fieldProps = FIELD_TYPES['3'];
    return models.fieldValues.findOne({
      where: {
        recordId,
        fieldId,
      },
      include: [
        {
          model: models.foreignKeyValues,
          attributes: ['fieldValueId', 'symmetricFieldValueId'],
          as: fieldProps.valueName,
          include: [
            {
              where: {
                recordId: itemId,
              },
              model: models.fieldValues,
              attributes: [],
              as: 'symFldV',
            },
          ],
        },
      ],
    });
  },
};
