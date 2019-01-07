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
    valueName: 'fgnKV',
    symmetricName: 'symKV',
  },
  4: {
    name: 'multipleAttachment',
    valueName: 'multiAttV',
  },
};

module.exports = {
  FIELD_TYPES,
};
