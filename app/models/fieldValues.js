module.exports = (sequelize, DataTypes) => {
  const fieldValues = sequelize.define(
    'fieldValues',
    {
      recordId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      fieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      textValue: DataTypes.STRING,
      numberValue: DataTypes.INTEGER,
    },
    {},
  );
  fieldValues.associate = function(models) {
    fieldValues.belongsTo(models.fields, {
      foreignKey: 'fieldId',
      as: 'field',
    });
  };
  return fieldValues;
};
