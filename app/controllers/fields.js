const DB = require('../models');
const { FIELD_TYPES } = require('../constants').fieldTypes;

module.exports = {
  async createField(params) {
    if (FIELD_TYPES[params.fieldTypeId].typeModel) {
      DB[FIELD_TYPES[params.fieldTypeId].typeModel]
        .create(params.typeOptions)
        .then(type => {
          let typeOptionsParams = {};
          typeOptionsParams[FIELD_TYPES[params.fieldTypeId].field] = type.id;

          DB.typeOptions.create(typeOptionsParams).then(Option => {
            params.typeOptionsId = Option.id;
          });
        });
    }

    return DB.fields.create(params);
  },
};
