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
    name: 'foreignKey',
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
  5: {
    name: 'formula',
    valueName: 'fmlV',
    typeModel: 'formulaTypes',
    typeName: 'formulaTypes',
    typeProps: ['count', 'sum', 'average'],
  },
};

module.exports = {
  FIELD_TYPES,
};
