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
    valueName: 'numberValue',
  },
  3: {
    name: 'reference',
    isTypeOptionsRequired: true,
    typeModel: 'foreignKeyTypes',
    typeName: 'foreignKeyTypes',
    typeProps: ['relationship', 'foreignTableId', 'symmetricFieldId'],
    valueName: 'fgnKV',
    symmetricName: 'symKV',
    isArrayValue: true,
  },
  4: {
    name: 'multipleAttachment',
    valueName: 'multiAttV',
    isArrayValue: true,
  },
};

module.exports = {
  FIELD_TYPES,
};
