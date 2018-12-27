const DB = require('../models');
const FIELD_TYPES = require('../constants').fieldTypes.FIELD_TYPES;

function createType(params) {
  return eval(
    `DB.${FIELD_TYPES[params.fieldTypeId]}Types.create(params.typeOptions)`,
  );
}

module.exports = {
  async createField(params) {
    createType(params).then(type => {
      let typeOptionsParams = {};
      typeOptionsParams[`${FIELD_TYPES[params.fieldTypeId]}TypeId`] = type.id;

      DB.typeOptions.create(typeOptionsParams).then(Option => {
        params.typeOptionsId = Option.id;
        DB.fields.create(params);
      });
    });
    // return ;
  },
};
