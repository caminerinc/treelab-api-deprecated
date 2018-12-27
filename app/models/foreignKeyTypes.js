'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyTypes = sequelize.define(
    'foreignKeyTypes',
    {
      relationship: DataTypes.STRING,
      foreignTableId: DataTypes.STRING,
      symmetricFieldId: DataTypes.STRING,
    },
    {},
  );
  foreignKeyTypes.associate = function(models) {
    foreignKeyTypes.belongsTo(models.tables, {
      foreignKey: 'foreignTableId',
      as: 'foreignTable',
    });
    foreignKeyTypes.belongsTo(models.fields, {
      foreignKey: 'symmetricFieldId',
      as: 'symmetricField',
    });
  };
  return foreignKeyTypes;
};
