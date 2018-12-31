const FIELD_TYPES = {
  1: {
    name: 'text',
    valueName: 'textValue',
  },
  2: {
    name: 'number',
    isTypeOptionsRequired: true,
    typeName: 'numberTypes',
    typeProps: ['format', 'precision', 'negative'],
    typeFK: 'numberTypeId',
    valueName: 'numberValue',
  },
};

module.exports = {
  FIELD_TYPES,
};
