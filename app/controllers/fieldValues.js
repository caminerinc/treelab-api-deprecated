const { fieldValues } = require('../models');
const socketIo = require('../../lib/core/socketIo');

module.exports = {
  async updateFieldValue(params) {
    const result = await fieldValues.update(
      { textValue: params.textValue },
      { where: { recordId: params.recordId, fieldId: params.fieldId } },
    );

    return socketIo.sync({
      op: 'updateFieldValue',
      body: {
        resul: params,
      },
    });
  },

  async createFieldValue(params) {
    const result = await fieldValues.create(params);

    return socketIo.sync({
      op: 'createFieldValue',
      body: {
        result,
      },
    });
  },

  getFieldValue(recordId, fieldId) {
    return fieldValues.findOne({
      attributes: ['recordId', 'fieldId', 'textValue'],
      where: { recordId, fieldId },
    });
  },
};
