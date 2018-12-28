const DB = require('../models');
const { FIELD_TYPES } = require('../constants').fieldTypes;

module.exports = {
  async createField(params) {
    if (FIELD_TYPES[params.fieldTypeId].typeModel) {
      const type = await FIELD_TYPES[params.fieldTypeId].typeModel.create(
        params.typeOptions,
      );
      let typeOptionsParams = {};
      typeOptionsParams[FIELD_TYPES[params.fieldTypeId].typeField] = type.id;

      const option = await DB.typeOptions.create(typeOptionsParams);
      params.typeOptionsId = option.id;
    }

    return DB.fields.create(params);
  },
};
