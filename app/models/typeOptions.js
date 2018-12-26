'use strict';
module.exports = (sequelize, DataTypes) => {
  const typeOptions = sequelize.define(
    'typeOptions',
    {
      numberTypeId: DataTypes.INTEGER,
      foreignKeyTypeId: DataTypes.INTEGER,
      multiSelectTypeId: DataTypes.INTEGER,
      rollupTypeId: DataTypes.INTEGER,
      formulaTypeId: DataTypes.INTEGER,
    },
    {},
  );
  typeOptions.associate = function(models) {
    typeOptions.belongsTo(models.numberTypes, {
      foreignKey: 'numberTypeId',
      as: 'numberType',
    });
    typeOptions.belongsTo(models.foreignKeyTypes, {
      foreignKey: 'foreignKeyTypeId',
      as: 'foreignKeyType',
    });
  };
  return typeOptions;
};
