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
    },
    {},
  );
  fieldValues.associate = function(models) {
    fieldValues.hasOne(models.textValues, {
      foreignKey: 'textValueId',
      as: 'value',
    });
  };
  return fieldValues;
};
