'use strict';
module.exports = (sequelize, DataTypes) => {
  const typeOptions = sequelize.define(
    'typeOptions',
    {
      numberTypeId: DataTypes.INTEGER,
    },
    {},
  );
  typeOptions.associate = function(models) {
    typeOptions.belongsTo(models.numberTypes, {
      foreignKey: 'numberTypeId',
      as: 'numberType',
    });
  };
  return typeOptions;
};
