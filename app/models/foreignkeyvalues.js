'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyValues = sequelize.define('foreignKeyValues', {
    fieldValueId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    symmetricFieldValueId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
  });
  foreignKeyValues.associate = function(models) {
    foreignKeyValues.belongsTo(models.fieldValues, {
      foreignKey: 'symmetricFieldValueId',
      as: 'symFldV',
    });
    foreignKeyValues.belongsTo(models.fieldValues, {
      foreignKey: 'fieldValueId',
      as: 'fldV',
    });
  };
  return foreignKeyValues;
};
