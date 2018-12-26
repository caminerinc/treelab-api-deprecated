'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyTypes = sequelize.define(
    'foreignKeyTypes',
    {
      relationship: DataTypes.STRING,
      foreignTableId: DataTypes.INTEGER,
      symmetricFieldId: DataTypes.INTEGER,
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
      as: 'symmetricFie',
    });
  };
  return foreignKeyTypes;
};
