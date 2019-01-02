const FIELD_TYPES = {
  1: {
    name: 'text',
    valueName: 'textValue',
  },
  2: {
    name: 'number',
    isTypeOptionsRequired: true,
    typeModel: 'numberTypes',
    typeName: 'numberTypes',
    typeProps: ['format', 'precision', 'negative'],
    typeFK: 'numberTypeId',
    valueName: 'numberValue',
  },
  3: {
    name: 'foreignKey',
    isTypeOptionsRequired: true,
    typeModel: 'foreignKeyTypes',
    typeName: 'foreignKeyTypes',
    typeProps: ['relationship', 'foreignTableId', 'symmetricFieldId'],
    typeFK: 'foreignKeyTypeId',
    valueName: 'foreignKeyValue',
  },
  4: {
    name: 'multipleAttachment',
    valueModel: 'multipleAttachmentValues',
  },
};

module.exports = {
  FIELD_TYPES,
};
