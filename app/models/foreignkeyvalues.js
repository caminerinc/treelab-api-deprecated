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
  });
  foreignKeyValues.associate = function(models) {
    foreignKeyValues.belongsTo(models.fieldValues, {
      foreignKey: 'symmetricFieldValueId',
      as: 'symmetricFieldValue',
    });
    foreignKeyValues.belongsTo(models.fieldValues, {
      foreignKey: 'fieldValueId',
      as: 'fieldValue',
    });
  };
  return foreignKeyValues;
};
