module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      textValueId: DataTypes.INTEGER,
      numberValueId: DataTypes.INTEGER,
    },
    {},
  );
  fieldValues.associate = function(models) {
    fieldValues.belongsTo(models.textValues, {
      foreignKey: 'textValueId',
      as: 'value',
    });
    fieldValues.belongsTo(models.numberValues, {
      foreignKey: 'numberValueId',
      as: 'numberValue',
    });
  };
  return fieldValues;
};
