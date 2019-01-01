'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyTypes = sequelize.define(
    'foreignKeyTypes',
    {
      relationship: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      foreignTableId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      symmetricFieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  foreignKeyTypes.associate = function(models) {
    foreignKeyTypes.belongsTo(models.fields, {
      foreignKey: 'symmetricFieldId',
      as: 'symmetricField',
    });
    foreignKeyTypes.belongsTo(models.tables, {
      foreignKey: 'foreignTableId',
      as: 'foreignTable',
    });
  };
  return foreignKeyTypes;
};
