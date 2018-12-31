const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = (sequelize, DataTypes) => {
  const typeOptions = sequelize.define(
    'typeOptions',
    {
      [FIELD_TYPES[2].typeFK]: DataTypes.INTEGER,
    },
    {},
  );
  typeOptions.associate = function(models) {
    typeOptions.belongsTo(models.numberTypes, {
      foreignKey: FIELD_TYPES[2].typeFK,
      as: FIELD_TYPES[2].typeName,
    });
  };
  return typeOptions;
};
