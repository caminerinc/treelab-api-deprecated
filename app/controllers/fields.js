const { pick } = require('lodash');
const { numberTypes, typeOptions, fields } = require('../models');
const { FIELD_TYPES } = require('../constants/fieldTypes');

const TYPE_OPTION_MAP = {
  number: createNumberOptions,
};

async function createNumberOptions(options) {
  return await numberTypes.create(options);
}

module.exports = {
  async dbCreateField(params) {
    const fieldProps = FIELD_TYPES[params.fieldTypeId];
    const createOption = TYPE_OPTION_MAP[fieldProps.name];
    const fieldParams = pick(params, ['tableId', 'name', 'fieldTypeId']);

    if (fieldProps.isTypeOptionsRequired && createOption) {
      const fieldSpecificOption = await createOption(params.typeOptions);
      const typeOptionProps = { [fieldProps.typeFK]: fieldSpecificOption.id };

      const option = await typeOptions.create(typeOptionProps);
      fieldParams.typeOptionsId = option.id;
    }

    return fields.create(fieldParams);
  },
};
