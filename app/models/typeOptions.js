const { FIELD_TYPES } = require('../constants/fieldTypes');

module.exports = (sequelize, DataTypes) => {
  const typeOptions = sequelize.define(
    'typeOptions',
    {
      [FIELD_TYPES[2].typeFK]: DataTypes.INTEGER,
      [FIELD_TYPES[3].typeFK]: DataTypes.INTEGER,
    },
    {},
  );
  typeOptions.associate = function(models) {
    typeOptions.belongsTo(models[FIELD_TYPES[2].typeModel], {
      foreignKey: FIELD_TYPES[2].typeFK,
      as: FIELD_TYPES[2].typeName,
    });
    typeOptions.belongsTo(models[FIELD_TYPES[3].typeModel], {
      foreignKey: FIELD_TYPES[3].typeFK,
      as: FIELD_TYPES[3].typeName,
    });
  };
  return typeOptions;
};
