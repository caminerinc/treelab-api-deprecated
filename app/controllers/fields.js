const { pick } = require('lodash');
const NumberTypes = require('../models').numberTypes;
const TypeOptions = require('../models').typeOptions;
const Fields = require('../models').fields;
const { FIELD_TYPES } = require('../constants').fieldTypes;

const TYPE_OPTION_MAP = {
  number: createNumberOptions,
};

async function createNumberOptions(typeOptions) {
  return await NumberTypes.create(typeOptions);
}

module.exports = {
  async createField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['tableId', 'name', 'fieldTypeId']);

    if (fieldProps.isTypeOptionsRequired && createOption) {
      const fieldSpecificOption = await createOption(params.typeOptions);
      const typeOptionProps = { [fieldProps.typeFK]: fieldSpecificOption.id };

      const option = await TypeOptions.create(typeOptionProps);
      fieldParams.typeOptionsId = option.id;
    }

    return Fields.create(fieldParams);
  },
};
