const { fieldValues, multipleAttachmentValues } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');
const socketIo = require('../../lib/core/socketIo');

const TYPE_MAP = {
  multipleAttachment: createMultipleAttachment,
};

async function createMultipleAttachment({ fieldValueId, value }) {
  const result = await multipleAttachmentValues.create({
    fieldValueId,
    ...value,
  });

  socketIo.sync({
    op: 'createMultipleAttachment',
    body: {
      result,
    },
  });

  return result;
}

module.exports = {
  async updateFieldValue(params) {
    const result = await fieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );

    socketIo.sync({
      op: 'updateFieldValue',
      body: {
        result: params,
      },
    });

    return result;
  },

  async createFieldValue(params) {
    const result = await fieldValues.create(params);

    socketIo.sync({
      op: 'createFieldValue',
      body: {
        result,
      },
    });

    return result;
  },

  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['id', 'recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },

  async createArrayType(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_MAP[fieldProps.name];

    return await createOption(params);
  },
};
