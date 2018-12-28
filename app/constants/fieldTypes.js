const DB = require('../models');
const FIELD_TYPES = {
  1: {
    name: 'text',
    valueModel: DB.textValues,
  },
  2: {
    name: 'multipleAttachment',
    valueModel: DB.multipleAttachmentValues,
  },
};

module.exports = {
  FIELD_TYPES,
};
